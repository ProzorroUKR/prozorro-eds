import type { CertificateType } from "@/types/IIT/Widget/CertificateType";

export type UserOptionsType = {
  ignoreFields?: string[];
  callbackAfterAuth?: (certificates: CertificateType[]) => void;
  debug?: boolean;
};
