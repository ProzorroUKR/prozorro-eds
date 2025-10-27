import { cloneDeep } from "lodash";
import { ENV_CONFIG } from "@/config/env.config";
import { DEFAULT_APP_CONFIG } from "@/config/defaultApp.config";
import type { EnvironmentModeType } from "@/types/EdsInitializationConfigType.ts";
import type { DefaultOptionsType } from "@/types/DefaultOptionsType";

export interface IOptionsBuilder {
  reset(): IOptionsBuilder;
  getOptions(): DefaultOptionsType;
  setIgnoreFields(fields?: string[]): IOptionsBuilder;
  setDebugMode(debug?: boolean): IOptionsBuilder;
  setEnvVars(mode?: EnvironmentModeType): IOptionsBuilder;
  setCbAfterAuth(fn?: any): IOptionsBuilder;
}

export class DefaultOptionsBuilder implements IOptionsBuilder {
  private _options: DefaultOptionsType = cloneDeep(DEFAULT_APP_CONFIG);

  reset(): IOptionsBuilder {
    this._options = cloneDeep(DEFAULT_APP_CONFIG);
    return this;
  }

  getOptions(): DefaultOptionsType {
    return this._options;
  }

  setIgnoreFields(fields?: string[]): IOptionsBuilder {
    this._setProp("ignoreFields", fields || []);
    return this;
  }

  setDebugMode(debug?: boolean): IOptionsBuilder {
    this._setProp("debug", Boolean(debug));
    (window as any).edsDebug = Boolean(debug);
    return this;
  }

  setCbAfterAuth(fn: any): IOptionsBuilder {
    this._setProp("callbackAfterAuth", fn, () => {});
    return this;
  }

  setEnvVars(mode: EnvironmentModeType = "development"): IOptionsBuilder {
    this._setProp("environment", cloneDeep(ENV_CONFIG[mode]));
    return this;
  }

  private _setProp(name: keyof DefaultOptionsType, value: any, defaultValue?: any): void {
    this._options[name] = value || defaultValue;
  }
}
