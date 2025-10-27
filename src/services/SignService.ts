import { errorMessages } from "@/config/errorMessages";
import { ENCODING } from "@/constants/encoding";
import { EdsError } from "@/services/Error/EdsError";
import type { SignType } from "@/types/sign/SignType";
import type { UserSignOptionsType } from "@/types/UserSignOptionsType";
import { Assert } from "@/utils/Assert";
import { Base64 } from "@/utils/Base64";
import type { IStore } from "@/store";
import { ApiSignAdapter } from "@/services/ApiSign/ApiSignAdapter";
import { ApiSignService, type IApiSignService } from "@/services/ApiSign/ApiSignService";
import { SIGN_TYPE, SIGN_ALGO } from "@/vendors/eusign";

export interface ISignService {
  sign(data: Uint8Array | string, options?: UserSignOptionsType): Promise<Uint8Array | string>;
  verify(sign: string, encoding?: ENCODING): Promise<SignType>;
}

export class SignService implements ISignService {
  private readonly base64 = new Base64();
  private readonly apiSignService: IApiSignService;
  private readonly apiSignAdapter = new ApiSignAdapter();

  constructor(private readonly store: IStore) {
    this.apiSignService = new ApiSignService(store.userOptions.envVars);
  }

  async sign(data: Uint8Array | string, userOptions: UserSignOptionsType = {}): Promise<Uint8Array | string> {
    Assert.isDefined(this.store.widget.endUser, errorMessages.widgetInit);

    try {
      const options = {
        external: Boolean(userOptions.external),
        asBase64String: Boolean(userOptions.asBase64String),
        signAlgorithm: SIGN_ALGO.DSTU4145WithGOST34311,
        previousSign: userOptions.previousSign || null,
        signType: SIGN_TYPE.CAdES_X_Long,
      };

      return (await this.store.widget.endUser.SignData(
        data,
        options.external,
        options.asBase64String,
        options.signAlgorithm,
        options.previousSign,
        options.signType
      )) as Uint8Array | string;
    } catch (e: any) {
      throw new EdsError(e.message || e);
    }
  }

  async verify(sign: string, encoding?: ENCODING): Promise<SignType> {
    const decryptResponse = await this.apiSignService.decrypt(sign);
    const { data, signers } = this.apiSignAdapter.prepareDecryptResponse(decryptResponse);

    if (encoding === undefined) {
      return { data, signers };
    }

    return {
      data: this.base64.decode(data, encoding),
      signers,
    };
  }
}
