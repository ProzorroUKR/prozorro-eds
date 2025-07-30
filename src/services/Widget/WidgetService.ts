import { errorMessages } from "@/config/errorMessages";
import { EdsError } from "@/services/Error/EdsError";
import type { CertificateType } from "@/types/IIT/Widget/CertificateType";
import type { IWidgetUserService } from "@/services/Widget/WidgetUserService";
import type { EndUser } from "@/types/IIT/Widget/LibraryInterface";

export interface IWidgetService extends IWidgetUserService {
  addReadKeyListener(): void;
}

export class WidgetService implements IWidgetService {
  constructor(
    private readonly widget: EndUser.Instance,
    private readonly callbackAfterAuth: (certs: CertificateType[]) => void
  ) {}

  public addReadKeyListener(): void {
    void (async () => {
      try {
        const certificates = await this.widget.ReadPrivateKey();
        this.callbackAfterAuth(certificates);
      } catch (e: any) {
        throw new EdsError(errorMessages.keyRead, e.message || e);
      }
    })();
  }

  public async resetKey(): Promise<void> {
    try {
      await this.widget.ResetPrivateKey();
    } catch (e: any) {
      throw new EdsError(e.message || e);
    }
  }
}
