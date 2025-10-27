import type { SignerType } from "@/types/sign/SignerType";

export type VerifyObjectResponseType = {
  difference?: Record<any, any>;
  signers: SignerType[];
  data: {
    fromSign: Record<string, any>;
    fromDb: Record<string, any>;
  };
};
