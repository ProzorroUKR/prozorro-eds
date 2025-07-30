/// <reference types="vite/client" />

declare interface Window {
  eds: import("@/services/Eds").EdsInterface;
  EndUser: import("@/types/IIT/Widget/LibraryInterface").EndUser.Instance;
  edsDebug: boolean;
}
