import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Modal from "./Modal";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  motion: {
    div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
}));

describe("Modal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("should not render when isOpen is false", () => {
      render(<Modal isOpen={false}>Modal Content</Modal>);

      expect(screen.queryByText("Modal Content")).not.toBeInTheDocument();
    });

    it("should render when isOpen is true", () => {
      render(<Modal isOpen={true}>Modal Content</Modal>);

      expect(screen.getByText("Modal Content")).toBeInTheDocument();
    });

    it("should render children content", () => {
      render(
        <Modal isOpen={true}>
          <div>
            <h2>Modal Title</h2>
            <p>Modal Description</p>
            <button>Action Button</button>
          </div>
        </Modal>
      );

      expect(screen.getByText("Modal Title")).toBeInTheDocument();
      expect(screen.getByText("Modal Description")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Action Button" })).toBeInTheDocument();
    });

    it("should handle undefined children gracefully", () => {
      render(<Modal isOpen={true} />);

      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      render(<Modal isOpen={true}>Accessible Modal</Modal>);

      const modal = screen.getByRole("dialog");
      expect(modal).toHaveAttribute("role", "dialog");
      expect(modal).toHaveAttribute("aria-modal", "true");
      expect(modal).toHaveAttribute("aria-labelledby", "modal-title");
    });

    it("should have proper dialog role", () => {
      render(<Modal isOpen={true}>Dialog Content</Modal>);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("should be properly labeled for screen readers", () => {
      render(
        <Modal isOpen={true}>
          <h2 id="modal-title">Accessible Modal Title</h2>
          <p>Modal content for screen readers</p>
        </Modal>
      );

      const modal = screen.getByRole("dialog");
      expect(modal).toHaveAttribute("aria-labelledby", "modal-title");
    });
  });

  describe("Responsive Design", () => {
    it("should have responsive layout classes", () => {
      render(<Modal isOpen={true}>Responsive Modal</Modal>);

      // The modal container with responsive classes
      const modal = screen.getByRole("dialog");
      const modalContent = modal.querySelector(".relative.transform.overflow-hidden");
      expect(modalContent).toHaveClass("sm:my-8", "sm:w-full", "sm:max-w-lg");
    });

    it("should have responsive padding classes", () => {
      render(<Modal isOpen={true}>Padded Modal</Modal>);

      const contentContainer = screen.getByText("Padded Modal").closest("div");
      expect(contentContainer).toHaveClass("px-4", "pt-5", "pb-4", "sm:p-6", "sm:pb-4");
    });

    it("should have mobile-first item positioning", () => {
      render(<Modal isOpen={true}>Positioned Modal</Modal>);

      // Find the wrapper div with positioning classes
      const wrapper = document.querySelector(".flex.min-h-full");
      expect(wrapper).toHaveClass("items-end", "sm:items-center");
      expect(wrapper).toHaveClass("p-4", "sm:p-0");
    });
  });

  describe("Styling and Layout", () => {
    it("should have proper modal container styling", () => {
      render(<Modal isOpen={true}>Styled Modal</Modal>);

      const modal = screen.getByRole("dialog");
      expect(modal).toHaveClass("relative", "z-10");
    });

    it("should have backdrop overlay with proper styling", () => {
      render(<Modal isOpen={true}>Modal with Backdrop</Modal>);

      const backdrop = document.querySelector(".fixed.inset-0.bg-gray-500\\/75");
      expect(backdrop).toBeInTheDocument();
    });

    it("should have proper modal content styling", () => {
      render(<Modal isOpen={true}>Content Styled Modal</Modal>);

      const modal = screen.getByRole("dialog");
      const modalContent = modal.querySelector(".relative.transform.overflow-hidden");
      expect(modalContent).toHaveClass(
        "relative",
        "transform",
        "overflow-hidden",
        "rounded-lg",
        "bg-neutral-900",
        "text-left",
        "shadow-xl",
        "transition-all"
      );
    });
  });

  describe("State Management", () => {
    it("should toggle visibility based on isOpen prop", () => {
      const { rerender } = render(<Modal isOpen={false}>Toggle Modal</Modal>);

      expect(screen.queryByText("Toggle Modal")).not.toBeInTheDocument();

      rerender(<Modal isOpen={true}>Toggle Modal</Modal>);

      expect(screen.getByText("Toggle Modal")).toBeInTheDocument();

      rerender(<Modal isOpen={false}>Toggle Modal</Modal>);

      expect(screen.queryByText("Toggle Modal")).not.toBeInTheDocument();
    });

    it("should maintain content across re-renders when open", () => {
      const { rerender } = render(
        <Modal isOpen={true}>
          <span data-testid="content">Original Content</span>
        </Modal>
      );

      expect(screen.getByTestId("content")).toHaveTextContent("Original Content");

      rerender(
        <Modal isOpen={true}>
          <span data-testid="content">Updated Content</span>
        </Modal>
      );

      expect(screen.getByTestId("content")).toHaveTextContent("Updated Content");
    });
  });

  describe("Layout Structure", () => {
    it("should have proper nested div structure", () => {
      render(<Modal isOpen={true}>Structured Modal</Modal>);

      // Verify the nested structure exists
      const outerContainer = document.querySelector(".fixed.inset-0.z-10.w-screen");
      expect(outerContainer).toBeInTheDocument();

      const flexContainer = outerContainer?.querySelector(".flex.min-h-full");
      expect(flexContainer).toBeInTheDocument();

      const modalContent = flexContainer?.querySelector(".relative.transform");
      expect(modalContent).toBeInTheDocument();
    });

    it("should have proper overflow handling", () => {
      render(<Modal isOpen={true}>Overflow Modal</Modal>);

      const container = document.querySelector(".fixed.inset-0.z-10.w-screen");
      expect(container).toHaveClass("overflow-y-auto");

      const modal = screen.getByRole("dialog");
      const modalContent = modal.querySelector(".relative.transform.overflow-hidden");
      expect(modalContent).toHaveClass("overflow-hidden");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty children", () => {
      render(<Modal isOpen={true}>{""}</Modal>);

      const modal = screen.getByRole("dialog");
      expect(modal).toBeInTheDocument();
    });

    it("should handle null children", () => {
      render(<Modal isOpen={true}>{null}</Modal>);

      const modal = screen.getByRole("dialog");
      expect(modal).toBeInTheDocument();
    });

    it("should handle complex nested children", () => {
      render(
        <Modal isOpen={true}>
          <div>
            <header>
              <h1>Complex Modal</h1>
            </header>
            <main>
              <section>
                <p>Section content</p>
                <ul>
                  <li>Item 1</li>
                  <li>Item 2</li>
                </ul>
              </section>
            </main>
            <footer>
              <button>Close</button>
            </footer>
          </div>
        </Modal>
      );

      expect(screen.getByText("Complex Modal")).toBeInTheDocument();
      expect(screen.getByText("Section content")).toBeInTheDocument();
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should not render DOM elements when closed", () => {
      render(<Modal isOpen={false}>Performance Modal</Modal>);

      // Should not have any modal-related elements in DOM
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(document.querySelector(".fixed.inset-0")).not.toBeInTheDocument();
    });

    it("should efficiently handle rapid open/close cycles", () => {
      const { rerender } = render(<Modal isOpen={false}>Cycle Modal</Modal>);

      // Rapid open/close cycles
      for (let i = 0; i < 5; i++) {
        rerender(<Modal isOpen={true}>Cycle Modal</Modal>);
        expect(screen.getByText("Cycle Modal")).toBeInTheDocument();

        rerender(<Modal isOpen={false}>Cycle Modal</Modal>);
        expect(screen.queryByText("Cycle Modal")).not.toBeInTheDocument();
      }
    });
  });

  describe("Component Interface", () => {
    it("should accept required props correctly", () => {
      // Test minimum required props
      expect(() => render(<Modal isOpen={true} />)).not.toThrow();
      expect(() => render(<Modal isOpen={false} />)).not.toThrow();
    });

    it("should handle optional children prop", () => {
      expect(() => render(<Modal isOpen={true} children="Optional children" />)).not.toThrow();
      expect(() => render(<Modal isOpen={true} />)).not.toThrow(); // No children
    });
  });
});
