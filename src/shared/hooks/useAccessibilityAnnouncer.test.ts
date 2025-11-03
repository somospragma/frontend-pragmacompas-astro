import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAccessibilityAnnouncer } from "@/shared/hooks/useAccessibilityAnnouncer";

describe("useAccessibilityAnnouncer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should initialize with empty message", () => {
    const { result } = renderHook(() => useAccessibilityAnnouncer());

    expect(result.current.message).toBe("");
  });

  it("should announce a message", () => {
    const { result } = renderHook(() => useAccessibilityAnnouncer());

    act(() => {
      result.current.announce("Test announcement");
    });

    expect(result.current.message).toBe("Test announcement");
  });

  it("should clear message manually", () => {
    const { result } = renderHook(() => useAccessibilityAnnouncer());

    act(() => {
      result.current.announce("Test announcement");
    });

    expect(result.current.message).toBe("Test announcement");

    act(() => {
      result.current.clear();
    });

    expect(result.current.message).toBe("");
  });

  it("should auto-clear message after delay", () => {
    const { result } = renderHook(() => useAccessibilityAnnouncer(1000));

    act(() => {
      result.current.announce("Test announcement");
    });

    expect(result.current.message).toBe("Test announcement");

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.message).toBe("");
  });

  it("should not auto-clear when clearDelay is 0", async () => {
    const { result } = renderHook(() => useAccessibilityAnnouncer(0));

    act(() => {
      result.current.announce("Test announcement");
    });

    expect(result.current.message).toBe("Test announcement");

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.message).toBe("Test announcement");
  });

  it("should update message when announce is called multiple times", () => {
    const { result } = renderHook(() => useAccessibilityAnnouncer());

    act(() => {
      result.current.announce("First message");
    });

    expect(result.current.message).toBe("First message");

    act(() => {
      result.current.announce("Second message");
    });

    expect(result.current.message).toBe("Second message");
  });

  it("should reset timer when new message is announced", () => {
    const { result } = renderHook(() => useAccessibilityAnnouncer(1000));

    act(() => {
      result.current.announce("First message");
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    act(() => {
      result.current.announce("Second message");
    });

    expect(result.current.message).toBe("Second message");

    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Should still have the message because timer was reset
    expect(result.current.message).toBe("Second message");

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.message).toBe("");
  });
});
