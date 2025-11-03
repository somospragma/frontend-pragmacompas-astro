import { describe, it, expect, vi, beforeEach } from "vitest";
import { logger } from "@/shared/utils/logger";

describe("Logger Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("info", () => {
    it("should log info messages", () => {
      const consoleSpy = vi.spyOn(console, "log");
      logger.info("Test info message", { userId: "123" });

      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe("warning", () => {
    it("should log warning messages", () => {
      const consoleSpy = vi.spyOn(console, "warn");
      logger.warning("Test warning message", { component: "TestComponent" });

      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe("error", () => {
    it("should log error messages with error object", () => {
      const consoleSpy = vi.spyOn(console, "error");
      const testError = new Error("Test error");

      logger.error("Test error message", testError, { action: "testAction" });

      expect(consoleSpy).toHaveBeenCalled();
    });

    it("should log error messages without error object", () => {
      const consoleSpy = vi.spyOn(console, "error");

      logger.error("Test error message", undefined, { action: "testAction" });

      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe("debug", () => {
    it("should log debug messages in development", () => {
      const consoleSpy = vi.spyOn(console, "log");
      logger.debug("Test debug message", { debugInfo: "test" });

      // Debug logs only in development
      if (import.meta.env.DEV) {
        expect(consoleSpy).toHaveBeenCalled();
      }
    });
  });
});
