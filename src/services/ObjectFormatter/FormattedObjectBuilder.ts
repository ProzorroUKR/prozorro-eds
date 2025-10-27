import { get } from "lodash";
import { STRING } from "@/constants/string";
import { TypeChecker } from "@/utils/checker/TypeChecker";
import { DOCUMENT_FIELDS, DOCUMENTS_TO_SKIP, FIELDS_TO_COMPARE, SIGN_DOC_DELETE_STATUSES } from "@/config/compareSign";
import { deepClone } from "@/utils/helpers";
import type { FileType } from "@/types/FileType";
import { REGEX } from "@/constants/regex";

const EMPTY_ARRAY = 0;
const FIRST_INDEX = 0;
const PRICE_QUOTATION = "priceQuotation";

export interface IFormattedObjectBuilder {
  reset(): void;
  setData(data: Record<string, any>): void;
  getResult(): Record<string, any>;
  removeUserIgnoredFields(ignoreFields: string[]): void;
  formatItemsArray(): void;
  formatLotArray(): void;
  formatBuyersArray(): void;
  formatDocumentsArrays(): void;
  deletePriceQuotationFields(): void;
  deleteEnquiryPeriodFields(): void;
  deleteProcuringEntityFields(): void;
  formatValue(): void;
}

export class FormattedObjectBuilder implements IFormattedObjectBuilder {
  private readonly fieldsToCompare = FIELDS_TO_COMPARE;
  private readonly typeChecker = new TypeChecker();
  private result: Record<string, any> = {};

  reset(): void {
    this.result = {};
  }

  setData(data: Record<string, any>): void {
    this.fieldsToCompare.forEach((fieldName: string) => {
      const field = data[fieldName];

      if (!this.typeChecker.isUndefined(field)) {
        this.result[fieldName] = deepClone(field); // don't mutate object
      }
    });
  }

  getResult(): Record<string, any> {
    return this.result;
  }

  removeUserIgnoredFields(ignoreFields: string[]): void {
    const COUNT_DELETE_ELEMENTS = 1;

    ignoreFields.forEach((filed: string) => {
      const index = this.fieldsToCompare.indexOf(filed);

      if (index >= FIRST_INDEX) {
        this.fieldsToCompare.splice(index, COUNT_DELETE_ELEMENTS);
      }
    });
  }

  formatItemsArray(): void {
    if (this.result.items) {
      this.result.items.forEach((item: Record<string, any>) => {
        delete item.region_id;

        if (get(item, "deliveryDate") && !get(item, "deliveryDate.startDate")) {
          delete item.deliveryDate.startDate;
        }
      });
    }
  }

  formatBuyersArray(): void {
    if (this.result.buyers) {
      this.result.buyers.forEach((item: Record<string, any>) => {
        delete item.identifier;
        delete item.name;
        delete item.id;
      });
    }
  }

  /**
   * remove fields from documents section
   */
  formatDocumentsArrays(): void {
    DOCUMENT_FIELDS.forEach(documentsField => {
      const documents = this.result[documentsField];

      if (this.typeChecker.isArray(documents)) {
        this.result[documentsField] = documents
          .filter((document: FileType) => !this.isDocumentMustBeSkipped(document))
          .map((document: FileType) => {
            delete document.url;
            delete document.Confidentiality;
            delete document.Language;

            return this.trimMilliseconds(document);
          });

        this.deleteEmptyArray(documentsField);
      }
    });
  }

  formatLotArray(): void {
    if (this.result.lots) {
      this.result.lots.forEach((lot: Record<string, any>) => {
        delete lot.auctionPeriod;
        delete lot.auctionUrl;
        delete lot.date;

        if (SIGN_DOC_DELETE_STATUSES.includes(lot.status)) {
          delete lot.status;
        }
      });
    }
  }

  deletePriceQuotationFields(): void {
    if (this.result.procurementMethodType === PRICE_QUOTATION) {
      delete this.result.items;
      delete this.result.tenderPeriod;
    }
  }

  deleteEnquiryPeriodFields(): void {
    if (this.result.enquiryPeriod) {
      delete this.result.enquiryPeriod.clarificationsUntil;
      delete this.result.enquiryPeriod.invalidationDate;
    }
  }

  deleteProcuringEntityFields(): void {
    if (!get(this.result, "procuringEntity")) {
      return;
    }

    if (get(this.result, "procuringEntity.contactPoint")) {
      delete this.result.procuringEntity.contactPoint.Language;
    }

    delete this.result.procuringEntity.id;
  }

  /**
   * fix amount like 142613.33000000002 in CDB
   */
  formatValue(): void {
    const HUNDRED = 100;

    if (get(this.result, "value.amount")) {
      this.result.value.amount = Math.round(this.result.value.amount * HUNDRED) / HUNDRED;
    }
  }

  private trimMilliseconds(document: FileType): FileType {
    const idDatePublished = document.datePublished !== undefined ? document.datePublished.indexOf(STRING.DOT) : -1;
    const idDateModified = document.dateModified !== undefined ? document.dateModified.indexOf(STRING.DOT) : -1;

    if (idDatePublished !== -1) {
      document.datePublished = document.datePublished.substr(FIRST_INDEX, idDatePublished);
    }

    if (idDateModified !== -1) {
      document.dateModified = document.dateModified.substr(FIRST_INDEX, idDateModified);
    }

    return document;
  }

  private deleteEmptyArray(fieldName: string): void {
    if (this.result[fieldName].length === EMPTY_ARRAY) {
      delete this.result[fieldName];
    }
  }

  private isDocumentMustBeSkipped(document: FileType): boolean {
    return (
      REGEX.FILE.TYPE.AUDIT.test(document.title) ||
      DOCUMENTS_TO_SKIP.some((documentExample: FileType) =>
        Object.keys(documentExample).every(key => documentExample[key] === document[key])
      )
    );
  }
}
