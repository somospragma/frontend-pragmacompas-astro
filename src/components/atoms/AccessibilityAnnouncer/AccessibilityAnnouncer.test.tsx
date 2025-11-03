import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AccessibilityAnnouncer } from "@/components/atoms/AccessibilityAnnouncer/AccessibilityAnnouncer";

describe("AccessibilityAnnouncer", () => {
  it("should render with message", () => {
    render(<AccessibilityAnnouncer message="Test message" />);

    const announcer = screen.getByRole("status");
    expect(announcer).toBeInTheDocument();
    expect(announcer).toHaveTextContent("Test message");
  });

  it("should have correct ARIA attributes by default", () => {
    render(<AccessibilityAnnouncer message="Test message" />);

    const announcer = screen.getByRole("status");
    expect(announcer).toHaveAttribute("aria-live", "polite");
    expect(announcer).toHaveAttribute("aria-atomic", "true");
    expect(announcer).toHaveAttribute("aria-relevant", "additions text");
  });

  it("should support assertive politeness", () => {
    render(<AccessibilityAnnouncer message="Urgent message" politeness="assertive" />);

    const announcer = screen.getByRole("status");
    expect(announcer).toHaveAttribute("aria-live", "assertive");
  });

  it("should support polite politeness", () => {
    render(<AccessibilityAnnouncer message="Normal message" politeness="polite" />);

    const announcer = screen.getByRole("status");
    expect(announcer).toHaveAttribute("aria-live", "polite");
  });

  it("should support atomic false", () => {
    render(<AccessibilityAnnouncer message="Test message" atomic={false} />);

    const announcer = screen.getByRole("status");
    expect(announcer).toHaveAttribute("aria-atomic", "false");
  });

  it("should be visually hidden with sr-only class", () => {
    render(<AccessibilityAnnouncer message="Test message" />);

    const announcer = screen.getByRole("status");
    expect(announcer).toHaveClass("sr-only");
  });

  it("should render empty when no message", () => {
    render(<AccessibilityAnnouncer message="" />);

    const announcer = screen.getByRole("status");
    expect(announcer).toBeEmptyDOMElement();
  });

  it("should update message when props change", () => {
    const { rerender } = render(<AccessibilityAnnouncer message="First message" />);

    let announcer = screen.getByRole("status");
    expect(announcer).toHaveTextContent("First message");

    rerender(<AccessibilityAnnouncer message="Second message" />);

    announcer = screen.getByRole("status");
    expect(announcer).toHaveTextContent("Second message");
  });
});
