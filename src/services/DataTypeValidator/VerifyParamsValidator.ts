import { REGEX } from "@/constants/regex";
import { EdsError } from "@/services/Error/EdsError";
import { errorMessages } from "@/config/errorMessages";
import { TypeChecker } from "@/utils/checker/TypeChecker";
import { EmptyChecker } from "@/utils/checker/EmptyChecker";
import type { ErrorMessageType } from "@/types/ErrorMessageType";
import type { VerifyOptionsType } from "@/types/sign/VerifyOptionsType";

export interface IVerifyParamsValidator {
  validate(params: string | VerifyOptionsType): void;
}

export class VerifyParamsValidator implements IVerifyParamsValidator {
  private readonly typeChecker = new TypeChecker();
  private readonly emptyChecker = new EmptyChecker();

  public validate(params: string | VerifyOptionsType): void {
    if (this.typeChecker.isString(params)) {
      return;
    }

    const { data, dataUrl, sign, signUrl } = params as VerifyOptionsType;

    this.validateExclusive(sign, signUrl, errorMessages.verifySignConflict);
    this.validateExclusive(data, dataUrl, errorMessages.verifyDataConflict);

    if (this.isMissing(sign) && this.isMissing(signUrl)) {
      throw new EdsError(errorMessages.verifySignRequired);
    }

    this.validateUrl(dataUrl);
    this.validateUrl(signUrl);
  }

  private isMissing(value?: string): boolean {
    return this.typeChecker.isUndefined(value) || !this.emptyChecker.isNotEmptyString(value);
  }

  private validateExclusive(inline: string | undefined, url: string | undefined, error: ErrorMessageType): void {
    if (!this.isMissing(inline) && !this.isMissing(url)) {
      throw new EdsError(error);
    }
  }

  private validateUrl(url?: string): void {
    if (this.isMissing(url)) {
      return;
    }

    if (!REGEX.URL.test(url as string)) {
      throw new EdsError(errorMessages.verifyInvalidUrl, url);
    }
  }
}
