import axios from "axios";
import { create } from "jsondiffpatch";
import packageJson from "@@/package.json";
import { Store } from "@/store";
import { Assert } from "@/utils/Assert";
import { Base64 } from "@/utils/Base64";
import { Logger } from "@/utils/Logger";
import type { ILogger } from "@/utils/Logger";
import { ENCODING } from "@/constants/encoding";
import type { SignType } from "@/types/sign/SignType";
import { errorMessages } from "@/config/errorMessages";
import { WidgetService } from "./Widget/WidgetService";
import { WidgetFactory } from "./Widget/WidgetFactory";
import { ApiSignAdapter } from "./ApiSign/ApiSignAdapter";
import { TypeChecker } from "@/utils/checker/TypeChecker";
import { EmptyChecker } from "@/utils/checker/EmptyChecker";
import { type ISignService, SignService } from "./SignService";
import type { UserOptionsType } from "@/types/UserOptionsType";
import { type IObjectDecoder, ObjectDecoder } from "./ObjectDecoder";
import { type IObjectHandler, ObjectHandler } from "./ObjectHandler";
import type { DefaultOptionsType } from "@/types/DefaultOptionsType";
import { ValidationTypes } from "./DataTypeValidator/ValidationTypes";
import type { UserSignOptionsType } from "@/types/UserSignOptionsType";
import { DataTypeValidator } from "./DataTypeValidator/DataTypeValidator";
import { OptionsBuildDirector } from "./OptionsBuilder/OptionsBuildDirector";
import { DefaultOptionsBuilder } from "./OptionsBuilder/DefaultOptionsBuilder";
import { ApiSignService, type IApiSignService } from "./ApiSign/ApiSignService";
import type { VerifyObjectResponseType } from "@/types/VerifyObjectResponseType";
import { FormattedObjectBuilder } from "./ObjectFormatter/FormattedObjectBuilder";
import { type IWidgetUserService, WidgetUserService } from "./Widget/WidgetUserService";
import { FormattedObjectDirector, type IFormattedObjectDirector } from "./ObjectFormatter/FormattedObjectDirector";

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
  private readonly apiSignAdapter = new ApiSignAdapter();
  private readonly dataTypeValidator = new DataTypeValidator();
  private readonly objectFormatterBuilder = new FormattedObjectBuilder();

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

    this.logger = new Logger(options.debug);
    this.apiSignService = new ApiSignService(axios);
    this.signService = new SignService(this.store.widget, this.apiSignService, this.apiSignAdapter, this.base64);
    this.objectDecoder = new ObjectDecoder(this.base64, this.logger);
    this.formattedObjectDirector = new FormattedObjectDirector(
      this.objectFormatterBuilder,
      this.store.userOptions.ignoreFields
    );
    this.objectHandler = new ObjectHandler(
      this.signService,
      axios,
      this.typeChecker,
      this.emptyChecker,
      this.formattedObjectDirector,
      this.objectDecoder,
      create(),
      this.logger
    );
  }

  async loadWidget(): Promise<IWidgetUserService> {
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
