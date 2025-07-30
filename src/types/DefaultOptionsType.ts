import type { CertificateType } from "@/types/IIT/Widget/CertificateType";

export type DefaultOptionsType = {
  ignoreFields: string[];
  debug: boolean;
  callbackAfterAuth: (certificates: CertificateType[]) => void;
};
