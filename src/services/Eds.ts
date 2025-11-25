import packageJson from "@@/package.json";
import { Store } from "@/store";
import { Assert } from "@/utils/Assert";
import { Logger } from "@/utils/Logger";
import type { ILogger } from "@/utils/Logger";
import { ENCODING } from "@/constants/encoding";
import type { SignType } from "@/types/sign/SignType";
import { errorMessages } from "@/config/errorMessages";
import { WidgetService } from "./Widget/WidgetService";
import { WidgetFactory } from "./Widget/WidgetFactory";
import { type ISignService, SignService } from "./SignService";
import { type IObjectDecoder, ObjectDecoder } from "./ObjectDecoder";
import { type IObjectHandler, ObjectHandler } from "./ObjectHandler";
import { ValidationTypes } from "./DataTypeValidator/ValidationTypes";
import type { EdsWidgetConfigType } from "@/types/EdsWidgetConfigType";
import type { UserSignOptionsType } from "@/types/UserSignOptionsType";
import { DataTypeValidator } from "./DataTypeValidator/DataTypeValidator";
import type { VerifyObjectResponseType } from "@/types/VerifyObjectResponseType";
import type { EdsInitializationConfigType } from "@/types/EdsInitializationConfigType";
import { type IWidgetUserService, WidgetUserService } from "./Widget/WidgetUserService";
import { FormattedObjectDirector, type IFormattedObjectDirector } from "./ObjectFormatter/FormattedObjectDirector";

export interface IEds {
  init(options?: EdsInitializationConfigType): Promise<void>;
  loadWidget(config: EdsWidgetConfigType): Promise<IWidgetUserService>;
  sign(data: Uint8Array | string, options?: UserSignOptionsType): Promise<Uint8Array | string>;
  signHash(data: string, options?: UserSignOptionsType): Promise<Uint8Array | string>;
  verify(sign: string, encoding?: ENCODING): Promise<SignType>;
  verifyObjects(links: string[]): Promise<VerifyObjectResponseType[] | Error>;
  formatObject(data: Record<any, any>): Record<any, any>;
}

export class Eds implements IEds {
  readonly version = packageJson.version;
  private readonly store = new Store();
  private readonly dataTypeValidator = new DataTypeValidator();

  private logger?: ILogger;
  private signService?: ISignService;
  private objectHandler?: IObjectHandler;
  private objectDecoder?: IObjectDecoder;
  private formattedObjectDirector?: IFormattedObjectDirector;

  async init(userOptions?: EdsInitializationConfigType): Promise<void> {
    this.store.userOptions.setOptions(userOptions);
    this.logger = new Logger(this.store.userOptions.debug);
    this.signService = new SignService(this.store);
    this.objectDecoder = new ObjectDecoder(this.logger);
    this.formattedObjectDirector = new FormattedObjectDirector(this.store.userOptions.ignoreFields);
    this.objectHandler = new ObjectHandler(
      this.signService,
      this.formattedObjectDirector,
      this.objectDecoder,
      this.logger
    );
  }

  async loadWidget(config: EdsWidgetConfigType): Promise<IWidgetUserService> {
    Assert.isDefined(config?.parentId, errorMessages.incorrectWidgetParentIdParam);
    Assert.isDefined(config?.frameId, errorMessages.incorrectWidgetIdParam);

    const widgetFactory = new WidgetFactory(config.parentId, config.frameId, this.store.userOptions.envVars.widgetUrl);
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

  async signHash(data: string, options?: UserSignOptionsType): Promise<Uint8Array | string> {
    this.dataTypeValidator.validate(data, ValidationTypes.STRING);
    Assert.isDefined(this.signService, errorMessages.libraryInit);

    return this.signService.signHash(data, options);
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
}
