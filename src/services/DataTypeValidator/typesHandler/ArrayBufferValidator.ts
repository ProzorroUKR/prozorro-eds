import { AbstractTypeCheckHandler } from "@/services/DataTypeValidator/AbstractTypeCheckHandler";
import type { TypeHandlerInterface } from "@/services/DataTypeValidator/TypeHandlerInterface";

export class ArrayBufferValidator extends AbstractTypeCheckHandler implements TypeHandlerInterface {
  public validate(data: any): boolean {
    return ArrayBuffer.isView(data);
  }
}
