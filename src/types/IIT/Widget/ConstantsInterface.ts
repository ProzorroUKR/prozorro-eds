import type { ASiCSignType } from "@/types/IIT/Widget/config/ASiCSignType.ts";
import type { ASiCType } from "@/types/IIT/Widget/config/ASiCType.ts";
import type { CCSType } from "@/types/IIT/Widget/config/CCSType.ts";
import type { CertHashType } from "@/types/IIT/Widget/config/CertHashType.ts";
import type { EventType } from "@/types/IIT/Widget/config/EventType.ts";
import type { FormType } from "@/types/IIT/Widget/config/FormType.ts";
import type { KeyUsage } from "@/types/IIT/Widget/config/KeyUsage.ts";
import type { PAdESSignLevel } from "@/types/IIT/Widget/config/PAdESSignLevel.ts";
import type { PublicKeyType } from "@/types/IIT/Widget/config/PublicKeyType.ts";
import type { RevocationReason } from "@/types/IIT/Widget/config/RevocationReason.ts";
import type { SignAlgo } from "@/types/IIT/Widget/config/SignAlgo.ts";
import type { SignType } from "@/types/IIT/Widget/config/SignType.ts";
import type { XAdESSignLevel } from "@/types/IIT/Widget/config/XAdESSignLevel.ts";
import type { XAdESType } from "@/types/IIT/Widget/config/XAdESType.ts";

/**
 * Типи форм для відображення в SignWidget. Змінено на EndUser.FormType.
 */
export interface ConstantsInterface {
  FORM_TYPE_READ_PKEY: number;
  FORM_TYPE_MAKE_NEW_CERTIFICATE: number;
  FORM_TYPE_SIGN_FILE: number;

  FormType: FormType;
  EventType: EventType;
  SignAlgo: SignAlgo;
  SignType: SignType;
  PAdESSignLevel: PAdESSignLevel;
  XAdESType: XAdESType;
  XAdESSignLevel: XAdESSignLevel;
  ASiCType: ASiCType;
  ASiCSignType: ASiCSignType;
  KeyUsage: KeyUsage;
  PublicKeyType: PublicKeyType;
  CertHashType: CertHashType;
  CCSType: CCSType;
  RevocationReason: RevocationReason;
}
