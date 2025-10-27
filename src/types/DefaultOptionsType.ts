import type { EnvironmentType } from "@/types/EnvironmentType";
import type { CertificateType } from "@/types/IIT/Widget/CertificateType";

export type DefaultOptionsType = {
  debug: boolean;
  ignoreFields: string[];
  environment: EnvironmentType;
  callbackAfterAuth: (certificates: CertificateType[]) => void;
};
