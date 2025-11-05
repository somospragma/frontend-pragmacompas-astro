import React from "react";

interface AccessibilityAnnouncerProps {
  /**
   * The message to announce to screen readers
   */
  message: string;
  /**
   * The politeness level for the announcement
   * - "polite": Waits for a pause in speech
   * - "assertive": Interrupts current speech
   * @default "polite"
   */
  politeness?: "polite" | "assertive";
  /**
   * Whether to read the entire region when it changes
   * @default true
   */
  atomic?: boolean;
}

/**
 * Accessible announcer component for screen readers
 * Renders a visually hidden live region that announces messages
 *
 * @example
 * ```tsx
 * const { message, announce } = useAccessibilityAnnouncer();
 *
 * return (
 *   <>
 *     <AccessibilityAnnouncer message={message} />
 *     <button onClick={() => announce("Action completed")}>
 *       Submit
 *     </button>
 *   </>
 * );
 * ```
 */
export const AccessibilityAnnouncer: React.FC<AccessibilityAnnouncerProps> = ({
  message,
  politeness = "polite",
  atomic = true,
}) => {
  return (
    <div role="status" aria-live={politeness} aria-atomic={atomic} className="sr-only" aria-relevant="additions text">
      {message}
    </div>
  );
};
