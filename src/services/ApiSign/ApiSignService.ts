import axios, { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import { errorMessages } from "@/config/errorMessages";
import { STRING } from "@/constants/string";
import { EdsError } from "@/services/Error/EdsError";
import type { ApiSignDecryptResponseType } from "@/types/http/ApiSignDecryptResponseType";
import { API_SIGN_METHODS } from "@/constants/apiSignMethods";
import type { EnvironmentType } from "@/types/EnvironmentType.ts";

export interface IApiSignService {
  decrypt(sign: string): Promise<ApiSignDecryptResponseType>;
}

export class ApiSignService implements IApiSignService {
  constructor(private readonly envVars: EnvironmentType) {}

  async decrypt(sign: string): Promise<ApiSignDecryptResponseType> {
    const apiUrl = `${this.envVars.apiSign.url}${API_SIGN_METHODS.DECRYPT}`;
    let response: AxiosResponse<ApiSignDecryptResponseType>;

    try {
      response = await axios.post(
        apiUrl,
        { sign },
        {
          auth: {
            username: this.envVars.apiSign.login,
            password: this.envVars.apiSign.pass,
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
