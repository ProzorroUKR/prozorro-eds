import type { Certificate } from "@/types/IIT/Widget/InfoExInterface";

export type CertificateType = {
  data: Uint8Array;
  infoEx: Certificate.InfoExType;
};
