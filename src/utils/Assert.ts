import { AssertionError } from "~/services/Error/AssertionError";
import { TypeChecker } from "~/utils/checker/TypeChecker";
import type { ErrorMessageType } from "~/types/ErrorMessageType";

export class Assert {
  static isDefined<T>(value: T, error?: ErrorMessageType, extra?: string): asserts value is NonNullable<T> {
    const typeChecker = new TypeChecker();

    if (typeChecker.isUndefined(value) || typeChecker.isNull(value)) {
      throw new AssertionError(error, extra);
    }
  }
}
