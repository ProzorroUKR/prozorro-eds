import { AbstractTypeCheckHandler } from "@/services/DataTypeValidator/AbstractTypeCheckHandler";
import type { TypeHandlerInterface } from "@/services/DataTypeValidator/TypeHandlerInterface";

export class ObjectValidator extends AbstractTypeCheckHandler implements TypeHandlerInterface {
  public validate(data: any): boolean {
    return this.emptyChecker.isNotEmptyObject(data);
  }
}
