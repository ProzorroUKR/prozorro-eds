import { init, captureException, captureMessage } from "@sentry/browser";
import { Integrations } from "@sentry/tracing";
import packageJson from "../../package.json";

export interface ISentryService {
  captureException(exception: any, captureContext?: any): string;
  captureMessage(message: string, captureContext?: any): string;
}

export class SentryService implements ISentryService {
  constructor() {
    init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      release: packageJson.version,
      environment: import.meta.env.MODE,
      integrations: [new Integrations.BrowserTracing() as unknown as any],
      tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE),
    });
  }

  captureException(exception: any, captureContext?: any): string {
    return captureException(exception, captureContext);
  }

  captureMessage(message: string, captureContext?: any): string {
    return captureMessage(message, captureContext);
  }
}
