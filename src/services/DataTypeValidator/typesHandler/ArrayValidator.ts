import { AbstractTypeCheckHandler } from "@/services/DataTypeValidator/AbstractTypeCheckHandler";
import type { TypeHandlerInterface } from "@/services/DataTypeValidator/TypeHandlerInterface";

export class ArrayValidator extends AbstractTypeCheckHandler implements TypeHandlerInterface {
  public validate(data: any): boolean {
    return this.emptyChecker.isNotEmptyArray(data);
  }
}
