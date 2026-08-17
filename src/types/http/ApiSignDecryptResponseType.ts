import type { ApiSignDecryptErrorType } from "@/types/http/ApiSignDecryptErrorType";
import type { ApiSignSignerType } from "@/types/http/ApiSignSignerType";

export type ApiSignDecryptResponseType = {
  status?: "error";
  errors?: ApiSignDecryptErrorType[];
  data?: {
    /** Відсутнє у відповіді verify_data — дані передає сам клієнт */
    content?: string;
    /** Може бути відсутнім — тоді підписант приходить лише у полі signer */
    signers?: ApiSignSignerType[];
    info?: string;
    signer?: ApiSignSignerType;
  };
};
