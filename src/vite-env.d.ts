// / <reference types="vite/client" />

declare interface Window {
  edsDebug: boolean;
  ProzorroEds: import("@/services/Eds").EdsInterface;
}
