/**
 * Shared input validation and sanitization utilities
 * Following Pragma frontend transversal rules for security and data integrity
 */

/**
 * Sanitizes text input to prevent XSS attacks
 */
export const sanitizeText = (input: string | null | undefined, maxLength = 100): string => {
  if (!input || typeof input !== "string") return "";

  return input
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/[<>]/g, "") // Remove remaining angle brackets
    .trim()
    .slice(0, maxLength);
};

/**
 * Sanitizes and validates email addresses
 */
export const sanitizeEmail = (email: string | null | undefined): string | undefined => {
  if (!email || typeof email !== "string") return undefined;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmedEmail = email.trim();

  if (emailRegex.test(trimmedEmail) && trimmedEmail.length <= 100) {
    return trimmedEmail;
  }

  return undefined;
};

/**
 * Validates and sanitizes numeric input
 */
export const sanitizeNumber = (input: number | string | null | undefined): number => {
  const num = Number(input);
  return Number.isFinite(num) && num >= 0 ? Math.floor(num) : 0;
};

/**
 * Validates internal navigation paths to prevent open redirects
 */
export const isValidInternalPath = (path: string): boolean => {
  return (
    path.startsWith("/") &&
    !path.startsWith("//") && // Prevent protocol-relative URLs
    !path.includes("..") && // Prevent path traversal
    !/^\/\/|^https?:\/\/|^ftp:\/\/|^javascript:/i.test(path) // Prevent external protocols
  );
};

/**
 * Sanitizes search queries to prevent injection attacks
 */
export const sanitizeSearchQuery = (query: string): string => {
  return query.replace(/[<>]/g, "").trim();
};

/**
 * Validates option values against allowed options list
 */
export const isValidOption = <T extends { value: string }>(value: string, options: T[]): boolean => {
  return options.some((opt) => opt.value === value);
};

/**
 * Generates secure aria-describedby IDs
 */
export const combineAriaDescribedBy = (...ids: (string | null | undefined)[]): string | undefined => {
  const validIds = ids.filter(Boolean);
  return validIds.length > 0 ? validIds.join(" ") : undefined;
};

/**
 * Sanitizes class names to prevent CSS injection
 */
export const sanitizeClassName = (className: string): string => {
  return className.replace(/[<>]/g, "").trim();
};
