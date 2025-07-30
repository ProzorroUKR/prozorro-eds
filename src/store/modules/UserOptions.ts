import type { UserOptionsType } from "@/types/UserOptionsType";
import type { CertificateType } from "@/types/IIT/Widget/CertificateType";
import type { DefaultOptionsType } from "@/types/DefaultOptionsType";

export interface IUserOptions {
  ignoreFields: string[];
  debug: boolean;
  callbackAfterAuth: (certificates: CertificateType[]) => void;
  setOptions(options: DefaultOptionsType): void;
}

export class UserOptions implements IUserOptions {
  private options: UserOptionsType = {};

  get ignoreFields(): string[] {
    return this.options.ignoreFields || [];
  }

  get debug(): boolean {
    return Boolean(this.options.debug);
  }

  get callbackAfterAuth(): (certificates: CertificateType[]) => void {
    const func = (): void => {};
    return this.options.callbackAfterAuth || func;
  }

  setOptions(options: DefaultOptionsType): void {
    this.options = options;
  }
}
