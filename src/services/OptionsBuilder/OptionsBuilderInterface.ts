import type { DefaultOptionsType } from "~/types/DefaultOptionsType";

export interface OptionsBuilderInterface {
  getOptions(): DefaultOptionsType;
  buildIgnoreFields(fields?: string[]): void;
  buildDebug(debug: boolean): void;
  buildCallbackAfterAuth(fn?: any): void;
}
