import { apiSignSignerKeys } from "@/config/apiSign/apiSignKeys";
import { keysSignerMap, keysTimeMap } from "@/config/apiSign/apiSignKeysMap";
import { errorMessages } from "@/config/errorMessages";
import { STRING } from "@/constants/string";
import { EdsError } from "@/services/Error/EdsError";
import type { ApiSignDecryptResponseType } from "@/types/http/ApiSignDecryptResponseType";
import type { ApiSignSignerType } from "@/types/http/ApiSignSignerType";
import type { ApiSignTimeType } from "@/types/http/ApiSignTimeType";
import type { ApiSignVerifyRequestType } from "@/types/http/ApiSignVerifyRequestType";
import type { SignType } from "@/types/sign/SignType";
import type { SignerType } from "@/types/sign/SignerType";
import type { VerifyOptionsType } from "@/types/sign/VerifyOptionsType";
import { Assert } from "@/utils/Assert";

export interface IApiSignAdapter {
  prepareVerifyRequest(options: VerifyOptionsType): ApiSignVerifyRequestType;
  prepareDecryptResponse(response: ApiSignDecryptResponseType): SignType;
}

export class ApiSignAdapter implements IApiSignAdapter {
  prepareVerifyRequest({ data, dataUrl, sign, signUrl }: VerifyOptionsType): ApiSignVerifyRequestType {
    const request: ApiSignVerifyRequestType = {};

    if (data !== undefined) {
      request.data = data;
    }

    if (dataUrl !== undefined) {
      request.data_url = dataUrl;
    }

    if (sign !== undefined) {
      request.sign = sign;
    }

    if (signUrl !== undefined) {
      request.sign_url = signUrl;
    }

    return request;
  }

  prepareDecryptResponse({ data }: ApiSignDecryptResponseType): SignType {
    if (data === undefined) {
      throw new EdsError(errorMessages.objectEmpty);
    }

    return {
      data: data.content ?? STRING.EMPTY,
      signers: this.prepareSigners(this.resolveSigners(data)) as SignerType[],
    };
  }

  /**
   * verify_data повертає підписанта лише у полі signer, без масиву signers.
   */
  private resolveSigners({ signers, signer }: NonNullable<ApiSignDecryptResponseType["data"]>): ApiSignSignerType[] {
    if (signers !== undefined) {
      return signers;
    }

    return signer === undefined ? [] : [signer];
  }

  private prepareSigners(signers: ApiSignSignerType[]): SignerType[] | unknown {
    return signers.map((signer: ApiSignSignerType) =>
      Object.fromEntries(
        Object.entries(signer).map(field => {
          const [k, v] = field;
          const key = k as keyof ApiSignSignerType;
          const keyReplaced = keysSignerMap.get(key);
          let value = v;

          Assert.isDefined(keyReplaced, errorMessages.apiSignInvalidObject, `Key ${key} is not defined`);

          if (apiSignSignerKeys.time === key) {
            value = Object.fromEntries(
              Object.entries(value).map(timeField => {
                const [key, value] = timeField;
                const keyReplaced = keysTimeMap.get(key as keyof ApiSignTimeType);

                Assert.isDefined(keyReplaced, errorMessages.apiSignInvalidObject, `Key ${key} is not defined`);

                return [keyReplaced, value];
              })
            ) as ApiSignTimeType;
          }

          return [keyReplaced, value];
        })
      )
    ) as SignerType[] | unknown;
  }
}
