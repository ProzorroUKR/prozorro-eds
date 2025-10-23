import { cloneDeep } from "lodash";
import type { EdsInitializationConfigType } from "@/types/EdsInitializationConfigType.ts";
import type { EnvironmentType } from "@/types/EnvironmentType";
import { DEFAULT_APP_CONFIG } from "@/config/defaultApp.config";
import type { DefaultOptionsType } from "@/types/DefaultOptionsType";
import type { CertificateType } from "@/types/IIT/Widget/CertificateType";
import { OptionsBuildDirector } from "@/services/OptionsBuilder/OptionsBuildDirector";

export interface IUserOptions {
  debug: boolean;
  ignoreFields: string[];
  envVars: EnvironmentType;
  callbackAfterAuth: (certificates: CertificateType[]) => void;
  setOptions(options?: EdsInitializationConfigType): void;
}

export class UserOptions implements IUserOptions {
  private _options: DefaultOptionsType = cloneDeep(DEFAULT_APP_CONFIG);

  get ignoreFields(): string[] {
    return this._options.ignoreFields;
  }

  get debug(): boolean {
    return this._options.debug;
  }

  get callbackAfterAuth(): (certificates: CertificateType[]) => void {
    return this._options.callbackAfterAuth;
  }

  get envVars(): EnvironmentType {
    return this._options.environment;
  }

  setOptions(options?: EdsInitializationConfigType): void {
    this._options = new OptionsBuildDirector().build(options);
  }
}
