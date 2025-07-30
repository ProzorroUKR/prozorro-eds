import { init, captureException, captureMessage } from "@sentry/browser";
import { Integrations } from "@sentry/tracing";
import packageJson from "@@/package.json";
import { MODE, SENTRY_DSN, SENTRY_TRACES_SAMPLE_RATE } from "@/constants/env";

export interface ISentryService {
  captureException(exception: any, captureContext?: any): string;
  captureMessage(message: string, captureContext?: any): string;
}

export class SentryService implements ISentryService {
  constructor() {
    init({
      dsn: SENTRY_DSN,
      environment: MODE,
      release: packageJson.version,
      integrations: [new Integrations.BrowserTracing() as unknown as any],
      tracesSampleRate: SENTRY_TRACES_SAMPLE_RATE,
    });
  }

  captureException(exception: any, captureContext?: any): string {
    return captureException(exception, captureContext);
  }

  captureMessage(message: string, captureContext?: any): string {
    return captureMessage(message, captureContext);
  }
}
