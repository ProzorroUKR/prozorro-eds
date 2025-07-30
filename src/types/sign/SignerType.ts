import type { TimeType } from "@/types/sign/TimeType";

export type SignerType = {
  isFilled: boolean;
  isTimeAvail: boolean;
  isTimeStamp: boolean;
  issuer: string;
  issuerCN: string;
  serial: string;
  subject: string;
  subjectCN: string;
  subjectOrg: string;
  subjectOrgUnit: string;
  subjectTitle: string;
  subjectState: string;
  subjectLocality: string;
  subjectFullName: string;
  subjectAddress: string;
  subjectPhone: string;
  subjectEMail: string;
  subjectDNS: string;
  subjectEDRPOUCode: string;
  subjectDRFOCode: string;
  time: TimeType;
};
