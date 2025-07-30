import type { OptionsBuilderInterface } from "./OptionsBuilderInterface";
import type { DefaultOptionsType } from "@/types/DefaultOptionsType";

export class DefaultOptionsBuilder implements OptionsBuilderInterface {
  private options: Record<any, any> = {};

  getOptions(): DefaultOptionsType {
    return this.options as DefaultOptionsType;
  }

  buildIgnoreFields(fields: string[]): void {
    this.setProp("ignoreFields", fields);
  }

  buildDebug(debug: boolean): void {
    this.setProp("debug", debug);
    (window as any).edsDebug = debug;
  }

  buildCallbackAfterAuth(fn: any): void {
    this.setProp("callbackAfterAuth", fn, () => {});
  }

  private setProp(name: keyof DefaultOptionsType, value: any, defaultValue?: any): void {
    this.options[name as string] = value || defaultValue;
  }
}
