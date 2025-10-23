import { cloneDeep } from "lodash";
import { ENV_CONFIG } from "@/config/env.config";
import type { DefaultOptionsType } from "@/types/DefaultOptionsType";

export const DEFAULT_APP_CONFIG: DefaultOptionsType = {
  debug: true,
  ignoreFields: [],
  callbackAfterAuth: () => {},
  environment: cloneDeep(ENV_CONFIG.development),
};
