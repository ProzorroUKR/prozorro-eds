import type { UserOptionsType } from "@/types/UserOptionsType";
import type { OptionsBuilderInterface } from "./OptionsBuilderInterface";

export class OptionsBuildDirector {
  constructor(private readonly builder: OptionsBuilderInterface) {}

  public buildDefaultOptions(options: UserOptionsType): void {
    this.builder.buildIgnoreFields(options.ignoreFields);
    this.builder.buildDebug(Boolean(options.debug));
    this.builder.buildCallbackAfterAuth(options.callbackAfterAuth);
  }
}
