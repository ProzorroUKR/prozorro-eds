import { AxiosError } from "axios";
import type { AxiosResponse, AxiosStatic } from "axios";
import { errorMessages } from "~/config/errorMessages.ts";
import { STRING } from "~/constants/string";
import { EdsError } from "~/services/Error/EdsError";
import type { ApiSignDecryptResponseType } from "~/types/http/ApiSignDecryptResponseType";
import { API_SIGN_METHODS } from "~/constants/apiSignMethods";

export interface IApiSignService {
  decrypt(sign: string): Promise<ApiSignDecryptResponseType>;
}

export class ApiSignService implements IApiSignService {
  constructor(private readonly axios: AxiosStatic) {}

  async decrypt(sign: string): Promise<ApiSignDecryptResponseType> {
    const apiUrl = `${import.meta.env.VITE_PATH_API_SIGN || ""}${API_SIGN_METHODS.DECRYPT}`;
    let response: AxiosResponse<ApiSignDecryptResponseType>;

    try {
      response = await this.axios.post(
        apiUrl,
        { sign },
        {
          auth: {
            username: import.meta.env.VITE_API_SIGN_LOGIN as string,
            password: import.meta.env.VITE_API_SIGN_PASSWORD as string,
          },
        }
      );
    } catch (e: any) {
      const error: AxiosError<ApiSignDecryptResponseType> = e;

      if (error.response !== undefined && error.response.data.errors !== undefined) {
        const errors = error.response.data.errors.map(error => `Decrypt error: ${error.description}`);
        throw new EdsError(errorMessages.apiSignError, errors.join(STRING.DELIMITER.DOT));
      }

      throw new EdsError(errorMessages.apiSignRequest, e);
    }

    return response.data;
  }
}
