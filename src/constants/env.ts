export const MODE = import.meta.env.MODE;
export const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
export const SENTRY_TRACES_SAMPLE_RATE = Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE);
export const PATH_SIGN_WIDGET = import.meta.env.VITE_PATH_SIGN_WIDGET || "";
export const PATH_API_SIGN = import.meta.env.VITE_PATH_API_SIGN || "";
export const API_SIGN_LOGIN = import.meta.env.VITE_API_SIGN_LOGIN;
export const API_SIGN_PASSWORD = import.meta.env.VITE_API_SIGN_PASSWORD;
