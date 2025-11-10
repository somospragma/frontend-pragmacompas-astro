import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Modal from "./Modal";

describe("Modal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: "Test Modal",
    children: <div>Modal content</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset body overflow style
    document.body.style.overflow = "unset";
  });

  describe("Rendering", () => {
    it("should render modal when isOpen is true", () => {
      render(<Modal {...defaultProps} />);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Test Modal")).toBeInTheDocument();
      expect(screen.getByText("Modal content")).toBeInTheDocument();
    });

    it("should not render modal when isOpen is false", () => {
      render(<Modal {...defaultProps} isOpen={false} />);

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("should render with correct title", () => {
      const customTitle = "Custom Modal Title";
      render(<Modal {...defaultProps} title={customTitle} />);

      expect(screen.getByText(customTitle)).toBeInTheDocument();
    });

    it("should render children content", () => {
      const customContent = <div data-testid="custom-content">Custom content</div>;
      render(<Modal {...defaultProps} children={customContent} />);

      expect(screen.getByTestId("custom-content")).toBeInTheDocument();
    });
  });

  describe("Size variants", () => {
    it("should apply default medium size class", () => {
      render(<Modal {...defaultProps} />);

      const modal = screen.getByRole("dialog");
      expect(modal).toHaveClass("max-w-lg");
    });

    it("should apply small size class", () => {
      render(<Modal {...defaultProps} size="sm" />);

      const modal = screen.getByRole("dialog");
      expect(modal).toHaveClass("max-w-md");
    });

    it("should apply large size class", () => {
      render(<Modal {...defaultProps} size="lg" />);

      const modal = screen.getByRole("dialog");
      expect(modal).toHaveClass("max-w-2xl");
    });

    it("should apply extra large size class", () => {
      render(<Modal {...defaultProps} size="xl" />);

      const modal = screen.getByRole("dialog");
      expect(modal).toHaveClass("max-w-4xl");
    });

    it("should have responsive classes for mobile-first design", () => {
      render(<Modal {...defaultProps} />);

      const modal = screen.getByRole("dialog");
      expect(modal).toHaveClass("w-full", "mx-4", "sm:mx-auto");
    });
  });

  describe("Interaction", () => {
    it("should call onClose when close button is clicked", () => {
      const onCloseMock = vi.fn();
      render(<Modal {...defaultProps} onClose={onCloseMock} />);

      const closeButton = screen.getByRole("button");
      fireEvent.click(closeButton);

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it("should call onClose when backdrop is clicked", () => {
      const onCloseMock = vi.fn();
      render(<Modal {...defaultProps} onClose={onCloseMock} />);

      // Click on backdrop (the overlay behind the modal)
      const backdrop = document.querySelector(".bg-black.bg-opacity-50");
      fireEvent.click(backdrop!);

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it("should call onClose when Escape key is pressed", () => {
      const onCloseMock = vi.fn();
      render(<Modal {...defaultProps} onClose={onCloseMock} />);

      fireEvent.keyDown(document, { key: "Escape" });

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it("should not call onClose when other keys are pressed", () => {
      const onCloseMock = vi.fn();
      render(<Modal {...defaultProps} onClose={onCloseMock} />);

      fireEvent.keyDown(document, { key: "Enter" });
      fireEvent.keyDown(document, { key: "Space" });

      expect(onCloseMock).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      render(<Modal {...defaultProps} />);

      const modal = screen.getByRole("dialog");
      expect(modal).toBeInTheDocument();
    });

    it("should prevent body scroll when modal is open", () => {
      render(<Modal {...defaultProps} isOpen={true} />);

      expect(document.body.style.overflow).toBe("hidden");
    });

    it("should restore body scroll when modal is closed", () => {
      const { rerender } = render(<Modal {...defaultProps} isOpen={true} />);

      // Modal is open, body should be hidden
      expect(document.body.style.overflow).toBe("hidden");

      // Close modal
      rerender(<Modal {...defaultProps} isOpen={false} />);

      expect(document.body.style.overflow).toBe("unset");
    });

    it("should have close button with proper accessibility", () => {
      render(<Modal {...defaultProps} />);

      const closeButton = screen.getByRole("button");
      expect(closeButton).toBeInTheDocument();

      // Check if SVG icon is present
      const svgIcon = closeButton.querySelector("svg");
      expect(svgIcon).toBeInTheDocument();
    });
  });

  describe("Event listeners cleanup", () => {
    it("should clean up event listeners when component unmounts", () => {
      const addEventListenerSpy = vi.spyOn(document, "addEventListener");
      const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");

      const { unmount } = render(<Modal {...defaultProps} />);

      expect(addEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });

    it("should clean up event listeners when modal is closed", () => {
      const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");

      const { rerender } = render(<Modal {...defaultProps} isOpen={true} />);

      // Close modal
      rerender(<Modal {...defaultProps} isOpen={false} />);

      expect(removeEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });
  });

  describe("Edge cases", () => {
    it("should handle undefined children gracefully", () => {
      render(<Modal {...defaultProps} children={undefined} />);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("should handle empty title", () => {
      render(<Modal {...defaultProps} title="" />);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("should handle multiple rapid open/close cycles", () => {
      const onCloseMock = vi.fn();
      const { rerender } = render(<Modal {...defaultProps} onClose={onCloseMock} isOpen={false} />);

      // Rapidly toggle modal
      rerender(<Modal {...defaultProps} onClose={onCloseMock} isOpen={true} />);
      rerender(<Modal {...defaultProps} onClose={onCloseMock} isOpen={false} />);
      rerender(<Modal {...defaultProps} onClose={onCloseMock} isOpen={true} />);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });
});
