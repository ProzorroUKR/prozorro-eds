import axios, { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import { errorMessages } from "@/config/errorMessages";
import { STRING } from "@/constants/string";
import { EdsError } from "@/services/Error/EdsError";
import type { ApiSignDecryptResponseType } from "@/types/http/ApiSignDecryptResponseType";
import type { ApiSignVerifyRequestType } from "@/types/http/ApiSignVerifyRequestType";
import { API_SIGN_METHODS } from "@/constants/apiSignMethods";
import type { EnvironmentType } from "@/types/EnvironmentType.ts";
import { HTTP } from "@/constants/http.ts";

export interface IApiSignService {
  decrypt(request: ApiSignVerifyRequestType): Promise<ApiSignDecryptResponseType>;
}

export class ApiSignService implements IApiSignService {
  constructor(private readonly envVars: EnvironmentType) {}

  async decrypt(request: ApiSignVerifyRequestType): Promise<ApiSignDecryptResponseType> {
    return this.post(this.resolveMethod(request), request);
  }

  private resolveMethod(request: ApiSignVerifyRequestType): string {
    const hasData = request.data || request.data_url;
    return hasData ? API_SIGN_METHODS.VERIFY_DATA_BODY : API_SIGN_METHODS.DECRYPT;
  }

  private async post(method: string, body: ApiSignVerifyRequestType): Promise<ApiSignDecryptResponseType> {
    const apiUrl = `${this.envVars.apiSign.url}${method}`;
    let response: AxiosResponse<ApiSignDecryptResponseType>;

    try {
      response = await axios.post(apiUrl, body, {
        auth: {
          username: this.envVars.apiSign.login,
          password: this.envVars.apiSign.pass,
        },
      });
    } catch (e: any) {
      const error: AxiosError<ApiSignDecryptResponseType> = e;
      const errors = (error?.response?.data?.errors || []).map(error => `Decrypt error: ${error.description}`);

      if (error.status === HTTP.STATUS.BAD_REQUEST) {
        throw new EdsError(errorMessages.incorrectSignFile, errors.join(STRING.DELIMITER.DOT));
      }

      if (error?.response?.data?.errors !== undefined) {
        throw new EdsError(errorMessages.apiSignError, errors.join(STRING.DELIMITER.DOT));
      }

      throw new EdsError(errorMessages.apiSignRequest, e);
    }

    return response.data;
  }
}
