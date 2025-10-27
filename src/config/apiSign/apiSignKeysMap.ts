import { apiSignSignerKeys, apiSignTimeKeys } from "@/config/apiSign/apiSignKeys";
import type { ApiSignSignerType } from "@/types/http/ApiSignSignerType";
import type { ApiSignTimeType } from "@/types/http/ApiSignTimeType";
import type { SignerType } from "@/types/sign/SignerType";
import type { TimeType } from "@/types/sign/TimeType";

export const keysSignerMap = new Map<keyof ApiSignSignerType, keyof SignerType>()
  .set(apiSignSignerKeys.isFilled, "isFilled")
  .set(apiSignSignerKeys.isTimeAvail, "isTimeAvail")
  .set(apiSignSignerKeys.isTimeStamp, "isTimeStamp")
  .set(apiSignSignerKeys.issuer, "issuer")
  .set(apiSignSignerKeys.issuerCN, "issuerCN")
  .set(apiSignSignerKeys.serial, "serial")
  .set(apiSignSignerKeys.subject, "subject")
  .set(apiSignSignerKeys.subjectCN, "subjectCN")
  .set(apiSignSignerKeys.subjectOrg, "subjectOrg")
  .set(apiSignSignerKeys.subjectOrgUnit, "subjectOrgUnit")
  .set(apiSignSignerKeys.subjectTitle, "subjectTitle")
  .set(apiSignSignerKeys.subjectState, "subjectState")
  .set(apiSignSignerKeys.subjectLocality, "subjectLocality")
  .set(apiSignSignerKeys.subjectFullName, "subjectFullName")
  .set(apiSignSignerKeys.subjectAddress, "subjectAddress")
  .set(apiSignSignerKeys.subjectPhone, "subjectPhone")
  .set(apiSignSignerKeys.subjectEMail, "subjectEMail")
  .set(apiSignSignerKeys.subjectDNS, "subjectDNS")
  .set(apiSignSignerKeys.subjectEDRPOUCode, "subjectEDRPOUCode")
  .set(apiSignSignerKeys.subjectDRFOCode, "subjectDRFOCode")
  .set(apiSignSignerKeys.time, "time");

export const keysTimeMap = new Map<keyof ApiSignTimeType, keyof TimeType>()
  .set(apiSignTimeKeys.year, "year")
  .set(apiSignTimeKeys.month, "month")
  .set(apiSignTimeKeys.dayOfWeek, "dayOfWeek")
  .set(apiSignTimeKeys.day, "day")
  .set(apiSignTimeKeys.hour, "hour")
  .set(apiSignTimeKeys.minute, "minute")
  .set(apiSignTimeKeys.second, "second")
  .set(apiSignTimeKeys.milliseconds, "milliseconds");
