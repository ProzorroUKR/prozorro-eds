import { documentSign } from "@/config/documents/documentSign";
import { documentSignV2 } from "@/config/documents/documentSignV2";
import type { FileType } from "@/types/FileType";

export const DOCUMENTS_TO_SKIP: FileType[] = [documentSign, documentSignV2];

export const DOCUMENTS_SIGN: FileType[] = [documentSign, documentSignV2];

export const DOCUMENT_FIELDS: string[] = [
  "documents",
  "eligibilityDocuments",
  "financialDocuments",
  "qualificationDocuments",
];

export const FIELDS_TO_COMPARE: string[] = [
  "cause",
  "causeDescription",
  "description",
  "description_en",
  "description_ru",
  "documents",
  "enquiryPeriod",
  "features",
  "guarantee",
  "id",
  "items",
  "lots",
  "minimalStep",
  "procurementMethod",
  "procurementMethodType",
  "procuringEntity",
  "tenderID",
  "tenderPeriod",
  "title",
  "title_en",
  "title_ru",
  "value",

  // for plan
  "additionalClassifications",
  "budget",
  "buyers",
  "classification",
  "planID",
  "tender",

  // for awards
  "bid_id",
  "eligible",
  "lotID",
  "qualified",
  "suppliers",

  // for contracts
  "awardID",
  "contractID",
  "dateSigned",
];

export const SIGN_DOC_DELETE_STATUSES: string[] = ["active", "complete", "unsuccessful"];
