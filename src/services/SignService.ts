import { errorMessages } from "~/config/errorMessages.ts";
import { ENCODING } from "~/constants/encoding";
import { EdsError } from "~/services/Error/EdsError";
import type { SignType } from "~/types/sign/SignType";
import type { UserSignOptionsType } from "~/types/UserSignOptionsType";
import { Assert } from "~/utils/Assert";
import type { IBase64 } from "~/utils/Base64";
import type { IWidgetEndUser } from "~/store/modules/WidgetEndUser.ts";
import type { IApiSignAdapter } from "~/services/ApiSign/ApiSignAdapter.ts";
import type { IApiSignService } from "~/services/ApiSign/ApiSignService.ts";

export interface ISignService {
  sign(data: Uint8Array | string, options?: UserSignOptionsType): Promise<Uint8Array | string>;
  verify(sign: string, encoding?: ENCODING): Promise<SignType>;
}

export class SignService implements ISignService {
  constructor(
    private readonly widget: IWidgetEndUser,
    private readonly apiSignService: IApiSignService,
    private readonly apiSignAdapter: IApiSignAdapter,
    private readonly base64: IBase64
  ) {}

  async sign(data: Uint8Array | string, userOptions: UserSignOptionsType = {}): Promise<Uint8Array | string> {
    Assert.isDefined(this.widget.endUser, errorMessages.widgetInit);

    try {
      const options = {
        external: Boolean(userOptions.external),
        asBase64String: Boolean(userOptions.asBase64String),
        signAlgorithm: window.EndUser.SignAlgo.DSTU4145WithGOST34311,
        previousSign: userOptions.previousSign || null,
        signType: window.EndUser.SignType.CAdES_X_Long,
      };

      return (await this.widget.endUser.SignData(
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
