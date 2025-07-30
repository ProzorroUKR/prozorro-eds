import { PREFIX } from "@/constants/prefixes";

export interface ILogger {
  log(message: any): void;
  warn(message: any): void;
  error(error: Error | string): void;
  success(message: any): void;
}

export class Logger implements ILogger {
  constructor(private readonly isDebug: boolean = false) {}

  log(message: any): void {
    if (!this.isDebug) {
      return;
    }

    console.log(PREFIX.EDS, message);
  }

  warn(message: any): void {
    if (!this.isDebug) {
      return;
    }

    console.warn(PREFIX.EDS, message);
  }

  error(error: Error | string): void {
    if (!this.isDebug) {
      return;
    }

    console.error(PREFIX.EDS, error);
  }

  success(message: any): void {
    if (!this.isDebug) {
      return;
    }

    console.log(`%c ${PREFIX.EDS} ${message} `, "color: green; font-weight: bold; background: white;");
  }
}
