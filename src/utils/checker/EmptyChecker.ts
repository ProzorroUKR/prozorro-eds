import { TypeChecker } from "@/utils/checker/TypeChecker";

export interface IEmptyChecker {
  isEmptyString(value: any): boolean;
  isNotEmptyString(value: any): boolean;
  isEmptyArray(value: any): boolean;
  isNotEmptyArray(value: any): boolean;
  isEmptyObject(value: any): boolean;
  isNotEmptyObject(value: any): boolean;
}

const EMPTY = 0;

export class EmptyChecker implements IEmptyChecker {
  private readonly typeChecker = new TypeChecker();

  isEmptyString(value: any): boolean {
    return this.typeChecker.isString(value) && this.isEmpty(value);
  }

  isNotEmptyString(value: any): boolean {
    return this.typeChecker.isString(value) && this.isNotEmpty(value);
  }

  isEmptyArray(value: any): boolean {
    return this.typeChecker.isArray(value) && this.isEmpty(value);
  }

  isNotEmptyArray(value: any): boolean {
    return this.typeChecker.isArray(value) && this.isNotEmpty(value);
  }

  isEmptyObject(value: any): boolean {
    return this.typeChecker.isObject(value) && this.isEmpty(Object.keys(value));
  }

  isNotEmptyObject(value: any): boolean {
    return this.typeChecker.isObject(value) && this.isNotEmpty(Object.keys(value));
  }

  private isEmpty(value: { length: number }): boolean {
    return value.length === EMPTY;
  }

  private isNotEmpty(value: { length: number }): boolean {
    return value.length > EMPTY;
  }
}
