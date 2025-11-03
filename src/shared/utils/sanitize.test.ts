import { describe, it, expect } from "vitest";
import { sanitizeInput, sanitizeUrl, isValidInput } from "@/shared/utils/sanitize";

describe("sanitizeInput", () => {
  it("should remove HTML tags", () => {
    const input = "Hello <script>alert('xss')</script> World";
    const result = sanitizeInput(input);
    expect(result).toBe("Hello scriptalert('xss')/script World");
  });

  it("should remove javascript: protocol", () => {
    const input = "javascript:alert('xss')";
    const result = sanitizeInput(input);
    expect(result).toBe("alert('xss')");
  });

  it("should remove event handlers", () => {
    const input = "text onclick=alert('xss')";
    const result = sanitizeInput(input);
    expect(result).toBe("text alert('xss')");
  });

  it("should trim whitespace", () => {
    const input = "  Hello World  ";
    const result = sanitizeInput(input);
    expect(result).toBe("Hello World");
  });

  it("should limit string length to 5000 characters", () => {
    const input = "a".repeat(6000);
    const result = sanitizeInput(input);
    expect(result.length).toBe(5000);
  });

  it("should return empty string for empty input", () => {
    const result = sanitizeInput("");
    expect(result).toBe("");
  });
});

describe("sanitizeUrl", () => {
  it("should allow valid HTTPS URLs", () => {
    const input = "https://example.com/document.pdf";
    const result = sanitizeUrl(input);
    expect(result).toBe("https://example.com/document.pdf");
  });

  it("should allow valid HTTP URLs", () => {
    const input = "http://example.com/document.pdf";
    const result = sanitizeUrl(input);
    expect(result).toBe("http://example.com/document.pdf");
  });

  it("should reject javascript: protocol", () => {
    const input = "javascript:alert('xss')";
    const result = sanitizeUrl(input);
    expect(result).toBe("");
  });

  it("should reject data: protocol", () => {
    const input = "data:text/html,<script>alert('xss')</script>";
    const result = sanitizeUrl(input);
    expect(result).toBe("");
  });

  it("should reject URLs without protocol", () => {
    const input = "example.com/document.pdf";
    const result = sanitizeUrl(input);
    expect(result).toBe("");
  });

  it("should remove dangerous characters", () => {
    const input = "https://example.com/doc<>'\".pdf";
    const result = sanitizeUrl(input);
    expect(result).toBe("https://example.com/doc.pdf");
  });

  it("should limit URL length to 2000 characters", () => {
    const input = "https://example.com/" + "a".repeat(3000);
    const result = sanitizeUrl(input);
    expect(result.length).toBe(2000);
  });

  it("should return empty string for empty input", () => {
    const result = sanitizeUrl("");
    expect(result).toBe("");
  });
});

describe("isValidInput", () => {
  it("should return true for valid input", () => {
    const result = isValidInput("Valid input text");
    expect(result).toBe(true);
  });

  it("should return false for empty string", () => {
    const result = isValidInput("");
    expect(result).toBe(false);
  });

  it("should return false for whitespace only", () => {
    const result = isValidInput("   ");
    expect(result).toBe(false);
  });

  it("should return true for input with special characters", () => {
    const result = isValidInput("Valid input with @#$%");
    expect(result).toBe(true);
  });
});
