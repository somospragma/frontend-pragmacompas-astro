import { useState, useCallback, useEffect } from "react";

/**
 * Custom hook for managing accessibility announcements for screen readers
 * Uses ARIA live regions to announce messages without visual display
 *
 * @param clearDelay - Time in milliseconds before clearing the message (default: 3000ms)
 * @returns Object with announce function and current message
 *
 * @example
 * ```tsx
 * const { announce, message } = useAccessibilityAnnouncer();
 *
 * // Announce success
 * announce("Datos guardados exitosamente");
 *
 * // Announce error
 * announce("Error al guardar los datos");
 * ```
 */
export function useAccessibilityAnnouncer(clearDelay: number = 3000) {
  const [message, setMessage] = useState<string>("");

  /**
   * Announces a message to screen readers
   * @param text - The message to announce
   */
  const announce = useCallback((text: string) => {
    setMessage(text);
  }, []);

  /**
   * Clears the announcement message
   */
  const clear = useCallback(() => {
    setMessage("");
  }, []);

  // Auto-clear message after delay
  useEffect(() => {
    if (message && clearDelay > 0) {
      const timer = setTimeout(() => {
        setMessage("");
      }, clearDelay);

      return () => clearTimeout(timer);
    }
  }, [message, clearDelay]);

  return { announce, clear, message };
}
