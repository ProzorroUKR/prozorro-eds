import { SentryService } from "@/services/SentryService";
import type { ErrorMessageType } from "@/types/ErrorMessageType";

export abstract class AbstractError extends Error {
  private readonly sentryService = new SentryService();
  private readonly code: string = "";

  public constructor({ message, code }: ErrorMessageType = { message: "", code: "" }, extra?: string | Error) {
    super(message);

    this.name = this.constructor.name;
    this.message = message;
    this.code = code;

    this.sentryService.captureException(this);
    this.handleExtra(extra);

    // Old browsers may not contain captureStackTrace method
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  private handleExtra(extra: any): void {
    if (extra === undefined) {
      return;
    }

    if (extra instanceof Error) {
      this.sentryService.captureException(extra);
    }

    if (typeof extra === "string") {
      this.sentryService.captureMessage(extra);
    }

    console.error(extra, this.code);
  }
}
