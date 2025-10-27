import { apiSignSignerKeys } from "@/config/apiSign/apiSignKeys";
import { keysSignerMap, keysTimeMap } from "@/config/apiSign/apiSignKeysMap";
import { errorMessages } from "@/config/errorMessages";
import { EdsError } from "@/services/Error/EdsError";
import type { ApiSignDecryptResponseType } from "@/types/http/ApiSignDecryptResponseType";
import type { ApiSignSignerType } from "@/types/http/ApiSignSignerType";
import type { ApiSignTimeType } from "@/types/http/ApiSignTimeType";
import type { SignType } from "@/types/sign/SignType";
import type { SignerType } from "@/types/sign/SignerType";
import { Assert } from "@/utils/Assert";

export interface IApiSignAdapter {
  prepareDecryptResponse(response: ApiSignDecryptResponseType): SignType;
}

export class ApiSignAdapter implements IApiSignAdapter {
  prepareDecryptResponse({ data }: ApiSignDecryptResponseType): SignType {
    if (data === undefined) {
      throw new EdsError(errorMessages.objectEmpty);
    }

    return {
      data: data.content,
      signers: this.prepareSigners(data.signers) as SignerType[],
    };
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
