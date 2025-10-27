import { TypeChecker } from "@/utils/checker/TypeChecker";
import type { ErrorMessageType } from "@/types/ErrorMessageType";
import { EmptyChecker } from "@/utils/checker/EmptyChecker";
import { TypeCheckFactory } from "@/services/DataTypeValidator/TypeCheckFactory";
import { typeCheckStrategyMap } from "@/services/DataTypeValidator/TypeCheckStrategyMap";
import { errorMessages } from "@/config/errorMessages";
import { EdsError } from "@/services/Error/EdsError";

export interface IDataTypeValidator {
  validate(data: any, typesList: string[] | string, error?: ErrorMessageType): void;
}

export class DataTypeValidator implements IDataTypeValidator {
  private readonly typeChecker = new TypeChecker();
  private readonly emptyChecker = new EmptyChecker();
  private readonly factory = new TypeCheckFactory(typeCheckStrategyMap, this.typeChecker, this.emptyChecker);

  public validate(data: any, typesList: string[] | string, error?: ErrorMessageType): void {
    if (!this.typeChecker.isArray(typesList)) {
      typesList = [typesList as string];
    }

    const valid = (typesList as string[]).some((type: string) => this.checkType(data, type));

    if (!valid) {
      throw new EdsError(error || errorMessages.incorrectInputFormat);
    }
  }

  private checkType(data: any, type: string): boolean {
    const validator = this.factory.create(type);
    return validator.validate(data);
  }
}
