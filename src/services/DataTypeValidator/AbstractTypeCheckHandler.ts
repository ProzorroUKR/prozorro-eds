import type { ITypeChecker } from "@/utils/checker/TypeChecker.ts";
import type { IEmptyChecker } from "@/utils/checker/EmptyChecker.ts";
import type { TypeHandlerInterface } from "@/services/DataTypeValidator/TypeHandlerInterface";

export abstract class AbstractTypeCheckHandler implements TypeHandlerInterface {
  protected constructor(
    protected readonly typeChecker: ITypeChecker,
    protected readonly emptyChecker: IEmptyChecker
  ) {}

  abstract validate(data: any): boolean;
}
