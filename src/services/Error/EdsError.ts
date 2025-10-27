import type { ErrorMessageType } from "@/types/ErrorMessageType";

export class EdsError extends Error {
  private readonly code: string = "";

  public constructor({ message, code }: ErrorMessageType = { message: "", code: "" }, extra?: string | Error) {
    super(message);

    this.name = this.constructor.name;
    this.message = message;
    this.code = code;

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

    console.error(extra, this.code);
  }
}
