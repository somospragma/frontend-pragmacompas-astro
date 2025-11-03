import { describe, it, expect } from "vitest";
import { isApiError, getErrorMessage, type ApiError } from "@/shared/types/error.types";

describe("Error Types", () => {
  describe("isApiError", () => {
    it("should return true for valid ApiError", () => {
      const error: ApiError = {
        message: "Test error",
        name: "ApiError",
        response: {
          status: 400,
          data: {
            message: "Bad request",
          },
        },
      };

      expect(isApiError(error)).toBe(true);
    });

    it("should return true for error with message property", () => {
      const error = {
        message: "Simple error",
        name: "Error",
      };

      expect(isApiError(error)).toBe(true);
    });

    it("should return false for null", () => {
      expect(isApiError(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isApiError(undefined)).toBe(false);
    });

    it("should return false for string", () => {
      expect(isApiError("error string")).toBe(false);
    });

    it("should return false for number", () => {
      expect(isApiError(123)).toBe(false);
    });

    it("should return false for object without message", () => {
      expect(isApiError({ status: 400 })).toBe(false);
    });
  });

  describe("getErrorMessage", () => {
    it("should extract message from ApiError with response data", () => {
      const error: ApiError = {
        message: "Generic error",
        name: "ApiError",
        response: {
          status: 400,
          data: {
            message: "Specific error from API",
          },
        },
      };

      expect(getErrorMessage(error)).toBe("Specific error from API");
    });

    it("should use error.message if no response data", () => {
      const error: ApiError = {
        message: "Direct error message",
        name: "ApiError",
      };

      expect(getErrorMessage(error)).toBe("Direct error message");
    });

    it("should return default message for non-ApiError", () => {
      expect(getErrorMessage(null)).toBe("Ha ocurrido un error inesperado");
      expect(getErrorMessage(undefined)).toBe("Ha ocurrido un error inesperado");
      expect(getErrorMessage("string error")).toBe("Ha ocurrido un error inesperado");
      expect(getErrorMessage(123)).toBe("Ha ocurrido un error inesperado");
    });

    it("should return default message for empty ApiError", () => {
      const error: ApiError = {
        message: "",
        name: "ApiError",
      };

      expect(getErrorMessage(error)).toBe("Ha ocurrido un error inesperado");
    });

    it("should prioritize response.data.message over error.message", () => {
      const error: ApiError = {
        message: "Generic message",
        name: "ApiError",
        response: {
          status: 500,
          data: {
            message: "Specific API message",
          },
        },
      };

      expect(getErrorMessage(error)).toBe("Specific API message");
    });
  });
});
