import type { ApiSignTimeType } from "@/types/http/ApiSignTimeType";

export type ApiSignSignerType = {
  bFilled: boolean;
  bTimeAvail: boolean;
  bTimeStamp: boolean;
  pszIssuer: string;
  pszIssuerCN: string;
  pszSerial: string;
  pszSubject: string;
  pszSubjCN: string;
  pszSubjOrg: string;
  pszSubjOrgUnit: string;
  pszSubjTitle: string;
  pszSubjState: string;
  pszSubjLocality: string;
  pszSubjFullName: string;
  pszSubjAddress: string;
  pszSubjPhone: string;
  pszSubjEMail: string;
  pszSubjDNS: string;
  pszSubjEDRPOUCode: string;
  pszSubjDRFOCode: string;
  Time: ApiSignTimeType;
};
