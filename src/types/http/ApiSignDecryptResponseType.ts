import type { ApiSignDecryptErrorType } from "@/types/http/ApiSignDecryptErrorType";
import type { ApiSignSignerType } from "@/types/http/ApiSignSignerType";

export type ApiSignDecryptResponseType = {
  status?: "error";
  errors?: ApiSignDecryptErrorType[];
  data?: {
    content: string;
    signers: ApiSignSignerType[];

    /**
     * data.content decoded by UTF-16
     * @deprecated
     */
    info: string;

    /**
     * First element from data.signers
     * @deprecated
     */
    signer: ApiSignSignerType;
  };
};
