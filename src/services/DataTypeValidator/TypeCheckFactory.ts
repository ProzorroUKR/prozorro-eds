import type { ITypeChecker } from "@/utils/checker/TypeChecker.ts";
import type { IEmptyChecker } from "@/utils/checker/EmptyChecker.ts";
import type { TypeHandlerInterface } from "@/services/DataTypeValidator/TypeHandlerInterface";
import { Assert } from "@/utils/Assert";

export class TypeCheckFactory {
  constructor(
    private readonly typesMap: Map<
      string,
      new (typeChecker: ITypeChecker, emptyChecker: IEmptyChecker) => TypeHandlerInterface
    >,
    private readonly typeChecker: ITypeChecker,
    private readonly emptyChecker: IEmptyChecker
  ) {}

  public create(type: string): TypeHandlerInterface {
    const strategyClass = this.typesMap.get(type);

    Assert.isDefined(strategyClass, { message: "Cannot get types handler strategy", code: "" });

    return new strategyClass(this.typeChecker, this.emptyChecker);
  }
}
