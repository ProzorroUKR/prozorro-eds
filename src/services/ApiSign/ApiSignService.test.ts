import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EdsError } from "@/services/Error/EdsError";
import { ApiSignService } from "@/services/ApiSign/ApiSignService";
import type { EnvironmentType } from "@/types/EnvironmentType";

vi.mock("axios", () => ({
  default: { post: vi.fn() },
  AxiosError: class AxiosError extends Error {},
}));

const envVars: EnvironmentType = {
  widgetUrl: "https://widget.test/",
  apiSign: {
    login: "login",
    pass: "pass",
    url: "https://api.test/",
  },
};

const AUTH = { auth: { username: "login", password: "pass" } };
const RESPONSE = { data: { data: { content: "CONTENT", signers: [] } } };

const post = axios.post as unknown as ReturnType<typeof vi.fn>;
const service = new ApiSignService(envVars);

const expectCode = async (rejection: any, code: string): Promise<void> => {
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

  post.mockRejectedValueOnce(rejection);

  try {
    await service.decrypt({ sign: "SIGN" });
    throw new Error(`Expected EdsError with code ${code}, but nothing was thrown`);
  } catch (e: any) {
    expect(e).toBeInstanceOf(EdsError);
    expect(e.code).toBe(code);
  } finally {
    consoleError.mockRestore();
  }
};

describe("ApiSignService", () => {
  beforeEach(() => {
    post.mockReset();
    post.mockResolvedValue(RESPONSE);
  });

  describe("endpoint selection", () => {
    it("posts { sign } to verify_data_internal", async () => {
      await service.decrypt({ sign: "SIGN" });

      expect(post).toHaveBeenCalledWith("https://api.test/verify_data_internal", { sign: "SIGN" }, AUTH);
    });

    it("posts { sign_url } to verify_data_internal", async () => {
      await service.decrypt({ sign_url: "https://host.test/sign.p7s" });

      expect(post).toHaveBeenCalledWith(
        "https://api.test/verify_data_internal",
        { sign_url: "https://host.test/sign.p7s" },
        AUTH
      );
    });

    it("posts { data, sign } to verify_data", async () => {
      await service.decrypt({ data: "DATA", sign: "SIGN" });

      expect(post).toHaveBeenCalledWith("https://api.test/verify_data", { data: "DATA", sign: "SIGN" }, AUTH);
    });

    it("posts { data_url, sign_url } to verify_data", async () => {
      await service.decrypt({ data_url: "https://host.test/file.pdf", sign_url: "https://host.test/sign.p7s" });

      expect(post).toHaveBeenCalledWith(
        "https://api.test/verify_data",
        { data_url: "https://host.test/file.pdf", sign_url: "https://host.test/sign.p7s" },
        AUTH
      );
    });

    it("returns the response body", async () => {
      await expect(service.decrypt({ sign: "SIGN" })).resolves.toEqual(RESPONSE.data);
    });
  });

  describe("error mapping", () => {
    it("maps 422 to incorrectSignFile (015)", async () => {
      await expectCode({ status: 422 }, "015");
    });

    it("maps a service error payload to apiSignError (004)", async () => {
      await expectCode({ response: { data: { errors: [{ description: "broken" }] } } }, "004");
    });

    it("maps an unknown failure to apiSignRequest (003)", async () => {
      await expectCode(new Error("Network down"), "003");
    });
  });
});
