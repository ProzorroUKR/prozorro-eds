import { errorMessages } from "@/config/errorMessages";
import { ENCODING } from "@/constants/encoding";
import type { ILogger } from "@/utils/Logger";
import { EdsError } from "@/services/Error/EdsError";
import type { IBase64 } from "@/utils/Base64";

export interface IObjectDecoder {
  decode(data: string): Record<any, any>;
}

export class ObjectDecoder implements IObjectDecoder {
  constructor(
    private readonly base64: IBase64,
    private readonly logger: ILogger
  ) {}

  decode(data: string): Record<any, any> {
    let dataDecoded = this.base64.decode(data, ENCODING.UTF_8);
    this.logDecodeAttempt(ENCODING.UTF_8);

    try {
      return JSON.parse(dataDecoded);
    } catch {
      dataDecoded = this.base64.decode(data, ENCODING.UTF_16LE);
      this.logDecodeAttempt(ENCODING.UTF_16LE);
    }

    try {
      return JSON.parse(dataDecoded);
    } catch {
      dataDecoded = this.base64.decode(data, ENCODING.UTF_16);
      this.logDecodeAttempt(ENCODING.UTF_16);
    }

    try {
      return JSON.parse(dataDecoded);
    } catch {
      throw new EdsError(errorMessages.objectParse);
    }
  }

  private logDecodeAttempt(encoding: string): void {
    this.logger.log(`Trying to decode by ${encoding}`);
  }
}
