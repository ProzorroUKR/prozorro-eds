import { STRING } from "@/constants/string";
import { EdsError } from "@/services/Error/EdsError";

export interface IBase64 {
  encode(data: Uint8Array): string;
  decode(string: string, encoding: string): string;
}

export class Base64 implements IBase64 {
  encode(data: Uint8Array): string {
    try {
      return btoa(String.fromCharCode.apply(null, Array.from(data)));
    } catch (e) {
      throw new EdsError(e as any);
    }
  }

  decode(string: string, encoding: string): string {
    try {
      const bytesArray = new Uint8Array(
        atob(string)
          .split(STRING.EMPTY)
          .map(c => c.charCodeAt(0))
      );
      return new TextDecoder(encoding).decode(bytesArray);
    } catch (e) {
      throw new EdsError(e as any);
    }
  }
}
