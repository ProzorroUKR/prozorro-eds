export interface ITypeChecker {
  isString(value: any): boolean;
  isNumber(value: any): boolean;
  isArray(value: any): boolean;
  isFunction(value: any): boolean;
  isFunctionByString(value: any): boolean;
  isObject(value: any): boolean;
  isNull(value: any): boolean;
  isUndefined(value: any): boolean;
  isBoolean(value: any): boolean;
  isRegExp(value: any): boolean;
  isError(value: any): boolean;
  isDate(value: any): boolean;
  isSymbol(value: any): boolean;
}

export class TypeChecker implements ITypeChecker {
  isString(value: any): boolean {
    return typeof value === "string" || value instanceof String;
  }

  isNumber(value: any): boolean {
    return typeof value === "number" && isFinite(value);
  }

  isArray(value: any): boolean {
    return Boolean(value && typeof value === "object" && value.constructor === Array);
  }

  isFunction(value: any): boolean {
    return typeof value === "function";
  }

  isFunctionByString(value: any): boolean {
    return typeof window[value] === "function";
  }

  isObject(value: any): boolean {
    return Boolean(value && typeof value === "object" && value.constructor === Object);
  }

  isNull(value: any): boolean {
    return value === null;
  }

  isUndefined(value: any): boolean {
    return typeof value === "undefined";
  }

  isBoolean(value: any): boolean {
    return typeof value === "boolean";
  }

  isRegExp(value: any): boolean {
    return Boolean(value && typeof value === "object" && value.constructor === RegExp);
  }

  isError(value: any): boolean {
    return value instanceof Error && typeof value.message !== "undefined";
  }

  isDate(value: any): boolean {
    return value instanceof Date;
  }

  isSymbol(value: any): boolean {
    return typeof value === "symbol";
  }
}
