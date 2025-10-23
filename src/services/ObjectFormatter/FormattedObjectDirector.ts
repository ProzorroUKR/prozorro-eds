import { TypeChecker } from "@/utils/checker/TypeChecker";
import { EmptyChecker } from "@/utils/checker/EmptyChecker";
import { EdsError } from "@/services/Error/EdsError";
import { errorMessages } from "@/config/errorMessages";
import { FormattedObjectBuilder } from "@/services/ObjectFormatter/FormattedObjectBuilder";

export interface IFormattedObjectDirector {
  build(data: Record<string, any>): Record<string, any>;
}

export class FormattedObjectDirector implements IFormattedObjectDirector {
  private readonly typeChecker = new TypeChecker();
  private readonly emptyChecker = new EmptyChecker();
  private readonly builder = new FormattedObjectBuilder();

  constructor(private readonly ignoreFields?: string[]) {}

  build(data: Record<string, any>): Record<string, any> {
    if (this.typeChecker.isUndefined(data) || this.emptyChecker.isEmptyObject(data)) {
      throw new EdsError(errorMessages.objectEmpty);
    }

    this.builder.reset();
    this.builder.setData(data);

    if (this.typeChecker.isArray(this.ignoreFields)) {
      this.builder.removeUserIgnoredFields(this.ignoreFields as []);
    }

    this.builder.formatBuyersArray();
    this.builder.formatItemsArray();
    this.builder.formatDocumentsArrays();
    this.builder.formatLotArray();
    this.builder.deleteEnquiryPeriodFields();
    this.builder.deletePriceQuotationFields();
    this.builder.deleteProcuringEntityFields();
    this.builder.formatValue();

    return this.builder.getResult();
  }
}
