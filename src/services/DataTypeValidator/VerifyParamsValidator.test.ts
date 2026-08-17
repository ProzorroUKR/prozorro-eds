import { describe, expect, it, vi } from "vitest";
import { EdsError } from "@/services/Error/EdsError";
import { VerifyParamsValidator } from "@/services/DataTypeValidator/VerifyParamsValidator";

const SIGN = "BASE64_SIGN";
const DATA = "BASE64_DATA";
const SIGN_URL = "https://host.test/sign.p7s";
const DATA_URL = "https://host.test/file.pdf";

const validator = new VerifyParamsValidator();

const expectCode = (params: any, code: string): void => {
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

  try {
    validator.validate(params);
    throw new Error(`Expected EdsError with code ${code}, but nothing was thrown`);
  } catch (e: any) {
    expect(e).toBeInstanceOf(EdsError);
    expect(e.code).toBe(code);
  } finally {
    consoleError.mockRestore();
  }
};

describe("VerifyParamsValidator", () => {
  describe("valid combinations", () => {
    it("passes a plain base64 string through without checks", () => {
      expect(() => validator.validate(SIGN)).not.toThrow();
    });

    it("accepts sign only", () => {
      expect(() => validator.validate({ sign: SIGN })).not.toThrow();
    });

    it("accepts signUrl only", () => {
      expect(() => validator.validate({ signUrl: SIGN_URL })).not.toThrow();
    });

    it("accepts data + sign", () => {
      expect(() => validator.validate({ data: DATA, sign: SIGN })).not.toThrow();
    });

    it("accepts dataUrl + sign", () => {
      expect(() => validator.validate({ dataUrl: DATA_URL, sign: SIGN })).not.toThrow();
    });

    it("accepts data + signUrl", () => {
      expect(() => validator.validate({ data: DATA, signUrl: SIGN_URL })).not.toThrow();
    });

    it("accepts dataUrl + signUrl", () => {
      expect(() => validator.validate({ dataUrl: DATA_URL, signUrl: SIGN_URL })).not.toThrow();
    });
  });

  describe("invalid combinations", () => {
    it("rejects both sign and signUrl with code 017", () => {
      expectCode({ sign: SIGN, signUrl: SIGN_URL }, "017");
    });

    it("rejects both data and dataUrl with code 018", () => {
      expectCode({ data: DATA, dataUrl: DATA_URL, sign: SIGN }, "018");
    });

    it("rejects a missing sign with code 016", () => {
      expectCode({ data: DATA }, "016");
    });

    it("treats empty strings as absent and rejects with code 016", () => {
      expectCode({ sign: "", signUrl: "" }, "016");
    });
  });

  describe("url format", () => {
    it("rejects a relative signUrl with code 019", () => {
      expectCode({ signUrl: "/test-data/sign.p7s" }, "019");
    });

    it("rejects a non-http dataUrl with code 019", () => {
      expectCode({ dataUrl: "ftp://host.test/file.pdf", sign: SIGN }, "019");
    });

    it("accepts an http url", () => {
      expect(() => validator.validate({ signUrl: "http://host.test/sign.p7s" })).not.toThrow();
    });
  });
});
