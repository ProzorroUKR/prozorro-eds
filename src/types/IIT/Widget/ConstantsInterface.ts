import type { CCSType } from "@/types/IIT/Widget/config/CCSType.ts";
import type { EventType } from "@/types/IIT/Widget/config/EventType.ts";
import type { FormType } from "@/types/IIT/Widget/config/FormType.ts";
import type { KeyUsage } from "@/types/IIT/Widget/config/KeyUsage.ts";
import type { PublicKeyType } from "@/types/IIT/Widget/config/PublicKeyType.ts";
import type { RevocationReason } from "@/types/IIT/Widget/config/RevocationReason.ts";
import type { SignAlgo } from "@/types/IIT/Widget/config/SignAlgo.ts";
import type { SignType } from "@/types/IIT/Widget/config/SignType.ts";

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
  KeyUsage: KeyUsage;
  PublicKeyType: PublicKeyType;
  CCSType: CCSType;
  RevocationReason: RevocationReason;
}
