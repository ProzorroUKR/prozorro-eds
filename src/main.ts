import { Eds } from "./services/Eds";

export * from "@/services/Eds";
export * from "@/constants/encoding";
export * from "@/types/DefaultOptionsType";
export * from "@/types/ErrorMessageType";
export * from "@/types/FileType";
export * from "@/types/UserSignOptionsType";
export * from "@/types/VerifyDocumentType";
export * from "@/types/VerifyObjectResponseType";
export * from "@/types/sign/SignerType";
export * from "@/types/sign/SignType";
export * from "@/types/sign/TimeType";

const ProzorroEds = new Eds();

if (typeof window !== "undefined") {
  (window as any).ProzorroEds = ProzorroEds;
}

export { ProzorroEds };
