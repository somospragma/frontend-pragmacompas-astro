/**
 * Sanitizes user input to prevent XSS attacks and remove potentially dangerous content
 * @param input - The user input string to sanitize
 * @returns Sanitized string safe for use
 */
export function sanitizeInput(input: string): string {
  if (!input) return "";

  return input
    .trim()
    .replaceAll(/[<>]/g, "") // Remove < and > to prevent HTML injection
    .replaceAll(/javascript:/gi, "") // Remove javascript: protocol
    .replaceAll(/on\w+\s*=/gi, "") // Remove event handlers like onclick=
    .slice(0, 5000); // Limit length to prevent DoS
}

/**
 * Validates and sanitizes a URL
 * @param url - The URL to validate and sanitize
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url) return "";

  const trimmedUrl = url.trim();

  // Only allow http, https protocols
  if (!trimmedUrl.match(/^https?:\/\//i)) {
    return "";
  }

  // Remove dangerous protocols and characters
  return trimmedUrl
    .replaceAll(/javascript:/gi, "")
    .replaceAll(/data:/gi, "")
    .replaceAll(/[<>'"]/g, "")
    .slice(0, 2000); // Limit URL length
}

/**
 * Validates that a string is not empty after sanitization
 * @param input - The input to validate
 * @returns true if the input is valid, false otherwise
 */
export function isValidInput(input: string): boolean {
  const sanitized = sanitizeInput(input);
  return sanitized.length > 0;
}
