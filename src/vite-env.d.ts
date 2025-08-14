// / <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PATH_SIGN_WIDGET: string;
  readonly VITE_PATH_API_SIGN: string;
  readonly VITE_API_SIGN_LOGIN: string;
  readonly VITE_API_SIGN_PASSWORD: string;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_SENTRY_TRACES_SAMPLE_RATE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare interface Window {
  eds: import("@/services/Eds").EdsInterface;
  EndUser: import("@/types/IIT/Widget/LibraryInterface").EndUser.Instance;
  edsDebug: boolean;
}
