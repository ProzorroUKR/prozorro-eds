import { ValidationTypes } from "~/services/DataTypeValidator/ValidationTypes";
import { StringValidator } from "~/services/DataTypeValidator/typesHandler/StringValidator.ts";
import { ArrayValidator } from "~/services/DataTypeValidator/typesHandler/ArrayValidator.ts";
import { ObjectValidator } from "~/services/DataTypeValidator/typesHandler/ObjectValidator.ts";
import { ArrayBufferValidator } from "~/services/DataTypeValidator/typesHandler/ArrayBufferValidator.ts";

export const typeCheckStrategyMap = new Map<string, any>()
  .set(ValidationTypes.STRING, StringValidator)
  .set(ValidationTypes.ARRAY, ArrayValidator)
  .set(ValidationTypes.OBJECT, ObjectValidator)
  .set(ValidationTypes.ARRAY_BUFFER, ArrayBufferValidator);
