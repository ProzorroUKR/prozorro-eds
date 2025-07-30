import type { SignerType } from "@/types/sign/SignerType";

export type SignType = {
  data: string;
  signers: SignerType[];
};
