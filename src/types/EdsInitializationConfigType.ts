import type { CertificateType } from "@/types/IIT/Widget/CertificateType";

export type EnvironmentModeType = "production" | "development";

export type EdsInitializationConfigType = {
  debug?: boolean;
  ignoreFields?: string[];
  environment?: EnvironmentModeType;
  callbackAfterAuth?: (certificates: CertificateType[]) => void;
};
