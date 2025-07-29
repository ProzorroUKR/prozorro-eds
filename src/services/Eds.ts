import type { AxiosStatic } from "axios";
import { errorMessages } from "~/config/errorMessages.ts";
import { ENCODING } from "~/constants/encoding";
import { ApiSignAdapter } from "./ApiSign/ApiSignAdapter";
import { ApiSignService, type IApiSignService } from "./ApiSign/ApiSignService";
import type { ILogger } from "~/utils/Logger";
import { type IObjectDecoder, ObjectDecoder } from "./ObjectDecoder";
import { type IObjectHandler, ObjectHandler } from "./ObjectHandler";
import { type ISignService, SignService } from "./SignService";
import { WidgetFactory } from "./Widget/WidgetFactory";
import { WidgetService } from "./Widget/WidgetService";
import { type IWidgetUserService, WidgetUserService } from "./Widget/WidgetUserService";
import { Store } from "~/store";
import type { DefaultOptionsType } from "~/types/DefaultOptionsType";
import type { SignType } from "~/types/sign/SignType";
import type { UserOptionsType } from "~/types/UserOptionsType";
import type { UserSignOptionsType } from "~/types/UserSignOptionsType";
import type { VerifyObjectResponseType } from "~/types/VerifyObjectResponseType";
import { Assert } from "~/utils/Assert";
import { Base64 } from "~/utils/Base64";
import { TypeChecker } from "~/utils/checker/TypeChecker";
import { EmptyChecker } from "~/utils/checker/EmptyChecker";
import { Logger } from "~/utils/Logger";
import { DefaultOptionsBuilder } from "./OptionsBuilder/DefaultOptionsBuilder";
import { OptionsBuildDirector } from "./OptionsBuilder/OptionsBuildDirector";
import { DataTypeValidator } from "./DataTypeValidator/DataTypeValidator";
import { ValidationTypes } from "./DataTypeValidator/ValidationTypes";
import { FormattedObjectBuilder } from "./ObjectFormatter/FormattedObjectBuilder.ts";
import { FormattedObjectDirector, type IFormattedObjectDirector } from "./ObjectFormatter/FormattedObjectDirector";
import { ScriptReceiver } from "~/services/Dom/ScriptReceiver.ts";
import packageJson from "../../package.json";

export interface IEds {
  init(options?: UserOptionsType): Promise<void>;
  loadWidget(): Promise<IWidgetUserService>;
  sign(data: Uint8Array | string, options?: UserSignOptionsType): Promise<Uint8Array | string>;
  verify(sign: string, encoding?: ENCODING): Promise<SignType>;
  formatObject(data: Record<any, any>): Record<any, any>;
}

export class Eds implements IEds {
  readonly version = packageJson.version;

  private readonly store = new Store();
  private readonly optionsBuilder = new DefaultOptionsBuilder();
  private readonly optionsDirector = new OptionsBuildDirector(this.optionsBuilder);
  private readonly typeChecker = new TypeChecker();
  private readonly emptyChecker = new EmptyChecker();
  private readonly base64 = new Base64();
  private readonly scriptReceiver = new ScriptReceiver();
  private readonly apiSignAdapter = new ApiSignAdapter();
  private readonly dataTypeValidator = new DataTypeValidator();
  private readonly objectFormatterBuilder = new FormattedObjectBuilder();

  private axios?: AxiosStatic;
  private logger?: ILogger;
  private signService?: ISignService;
  private objectHandler?: IObjectHandler;
  private objectDecoder?: IObjectDecoder;
  private apiSignService?: IApiSignService;
  private formattedObjectDirector?: IFormattedObjectDirector;

  async init(userOptions?: UserOptionsType): Promise<void> {
    if (!this.typeChecker.isUndefined(userOptions)) {
      this.dataTypeValidator.validate(userOptions, ValidationTypes.OBJECT);
    }

    const options = this.setupOptions(userOptions);
    const diffPatcher = await import(/* webpackChunkName: "diff_patcher" */ "jsondiffpatch");
    const axios = await import(/* webpackChunkName: "axios_lib" */ "axios");

    this.axios = axios.default;
    this.logger = new Logger(options.debug);
    this.apiSignService = new ApiSignService(this.axios);
    this.signService = new SignService(this.store.widget, this.apiSignService, this.apiSignAdapter, this.base64);
    this.objectDecoder = new ObjectDecoder(this.base64, this.logger);
    this.formattedObjectDirector = new FormattedObjectDirector(
      this.objectFormatterBuilder,
      this.store.userOptions.ignoreFields
    );
    this.objectHandler = new ObjectHandler(
      this.signService,
      this.axios,
      this.typeChecker,
      this.emptyChecker,
      this.formattedObjectDirector,
      this.objectDecoder,
      diffPatcher.create(),
      this.logger
    );
  }

  async loadWidget(): Promise<IWidgetUserService> {
    await this.scriptReceiver.insert("/libs/eusign.js");

    const widgetFactory = new WidgetFactory();
    const widget = await widgetFactory.create();
    const widgetService = new WidgetService(widget, this.store.userOptions.callbackAfterAuth);

    widgetService.addReadKeyListener();
    this.store.widget.endUser = widget;

    return new WidgetUserService(widgetService);
  }

  async sign(data: Uint8Array | string, options?: UserSignOptionsType): Promise<Uint8Array | string> {
    this.dataTypeValidator.validate(data, [ValidationTypes.ARRAY_BUFFER, ValidationTypes.STRING]);
    Assert.isDefined(this.signService, errorMessages.libraryInit);

    return this.signService.sign(data, options);
  }

  async verify(sign: string, encoding?: ENCODING): Promise<SignType> {
    this.dataTypeValidator.validate(sign, ValidationTypes.STRING);
    Assert.isDefined(this.signService, errorMessages.libraryInit);

    return this.signService.verify(sign, encoding);
  }

  async verifyObjects(links: string[]): Promise<VerifyObjectResponseType[] | Error> {
    this.dataTypeValidator.validate(links, ValidationTypes.ARRAY);
    Assert.isDefined(this.objectHandler, errorMessages.libraryInit);

    return this.objectHandler.verify(links);
  }

  formatObject(data: Record<any, any>): Record<any, any> {
    this.dataTypeValidator.validate(data, ValidationTypes.OBJECT);
    Assert.isDefined(this.formattedObjectDirector, errorMessages.libraryInit);

    return this.formattedObjectDirector.build(data);
  }

  private setupOptions(options?: UserOptionsType): DefaultOptionsType {
    if (options === undefined) {
      return this.store.userOptions;
    }

    this.optionsDirector.buildDefaultOptions(options);
    const localData = this.optionsBuilder.getOptions();
    this.store.userOptions.setOptions(localData);
    return this.store.userOptions;
  }
}
