import { describe, expect, it, vi } from "vitest";
import { EdsError } from "@/services/Error/EdsError";
import { ApiSignAdapter } from "@/services/ApiSign/ApiSignAdapter";

const adapter = new ApiSignAdapter();

describe("ApiSignAdapter", () => {
  describe("prepareVerifyRequest", () => {
    it("maps camelCase options to the snake_case wire format", () => {
      const request = adapter.prepareVerifyRequest({
        data: "DATA",
        dataUrl: "https://host.test/file.pdf",
        sign: "SIGN",
        signUrl: "https://host.test/sign.p7s",
      });

      expect(request).toEqual({
        data: "DATA",
        data_url: "https://host.test/file.pdf",
        sign: "SIGN",
        sign_url: "https://host.test/sign.p7s",
      });
    });

    it("omits undefined fields", () => {
      const request = adapter.prepareVerifyRequest({
        data: "DATA",
        signUrl: "https://host.test/sign.p7s",
      });

      expect(request).toEqual({ data: "DATA", sign_url: "https://host.test/sign.p7s" });
    });

    it("returns an empty request for empty options", () => {
      expect(adapter.prepareVerifyRequest({})).toEqual({});
    });
  });

  describe("prepareDecryptResponse", () => {
    const signer = { pszSubjCN: "ІВАНОВ ІВАН", Time: { wYear: 2026 } } as any;

    it("renames wire keys of signers and nested time", () => {
      const result = adapter.prepareDecryptResponse({ data: { content: "CONTENT", signers: [signer] } } as any);

      expect(result).toEqual({
        data: "CONTENT",
        signers: [{ subjectCN: "ІВАНОВ ІВАН", time: { year: 2026 } }],
      });
    });

    it("falls back to the single signer field when signers is absent (verify_data)", () => {
      const result = adapter.prepareDecryptResponse({ data: { signer } } as any);

      expect(result).toEqual({
        data: "",
        signers: [{ subjectCN: "ІВАНОВ ІВАН", time: { year: 2026 } }],
      });
    });

    it("returns an empty signers list when neither signers nor signer is present", () => {
      const result = adapter.prepareDecryptResponse({ data: { content: "CONTENT" } } as any);

      expect(result).toEqual({ data: "CONTENT", signers: [] });
    });

    it("falls back to an empty string when content is absent (verify_data)", () => {
      const result = adapter.prepareDecryptResponse({ data: { signers: [signer] } } as any);

      expect(result.data).toBe("");
      expect(result.signers).toHaveLength(1);
    });

    it("throws objectEmpty (008) when data is undefined", () => {
      expect.assertions(2);

      try {
        adapter.prepareDecryptResponse({} as any);
      } catch (e: any) {
        expect(e).toBeInstanceOf(EdsError);
        expect(e.code).toBe("008");
      }
    });

    it("throws apiSignInvalidObject (005) on an unmapped signer key", () => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

      expect.assertions(2);

      try {
        adapter.prepareDecryptResponse({ data: { content: "C", signers: [{ pszUnknown: "x" }] } } as any);
      } catch (e: any) {
        expect(e).toBeInstanceOf(EdsError);
        expect(e.code).toBe("005");
      } finally {
        consoleError.mockRestore();
      }
    });
  });
});
