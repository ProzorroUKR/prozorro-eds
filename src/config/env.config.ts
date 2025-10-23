import type { EnvironmentType } from "@/types/EnvironmentType";
import type { EnvironmentModeType } from "@/types/EdsInitializationConfigType.ts";

export const ENV_CONFIG: Record<EnvironmentModeType, EnvironmentType> = {
  production: {
    widgetUrl: import.meta.env.VITE_PROD_PATH_SIGN_WIDGET,
    apiSign: {
      login: import.meta.env.VITE_PROD_API_SIGN_LOGIN,
      pass: import.meta.env.VITE_PROD_API_SIGN_PASSWORD,
      url: import.meta.env.VITE_PROD_PATH_API_SIGN,
    },
  },
  development: {
    widgetUrl: import.meta.env.VITE_DEV_PATH_SIGN_WIDGET,
    apiSign: {
      login: import.meta.env.VITE_DEV_API_SIGN_LOGIN,
      pass: import.meta.env.VITE_DEV_API_SIGN_PASSWORD,
      url: import.meta.env.VITE_DEV_PATH_API_SIGN,
    },
  },
};
