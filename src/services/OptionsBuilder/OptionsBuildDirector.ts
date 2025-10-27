import type { EdsInitializationConfigType } from "@/types/EdsInitializationConfigType.ts";
import { DefaultOptionsBuilder } from "@/services/OptionsBuilder/DefaultOptionsBuilder";
import type { DefaultOptionsType } from "@/types/DefaultOptionsType";

export class OptionsBuildDirector {
  private readonly builder = new DefaultOptionsBuilder();

  public build({
    ignoreFields,
    callbackAfterAuth,
    debug,
    environment,
  }: EdsInitializationConfigType = {}): DefaultOptionsType {
    return this.builder
      .reset()
      .setIgnoreFields(ignoreFields)
      .setDebugMode(debug)
      .setCbAfterAuth(callbackAfterAuth)
      .setEnvVars(environment)
      .getOptions();
  }
}
