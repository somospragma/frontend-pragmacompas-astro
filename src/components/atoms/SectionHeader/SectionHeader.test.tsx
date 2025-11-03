import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SectionHeader from "./SectionHeader";

describe("SectionHeader", () => {
  describe("Rendering", () => {
    it("should render with description text", () => {
      render(<SectionHeader description="Test Description" />);

      expect(screen.getByText("Test Description")).toBeInTheDocument();
    });

    it("should render as header element with semantic HTML", () => {
      const { container } = render(<SectionHeader description="Test" />);

      const header = container.querySelector("header");
      expect(header).toBeInTheDocument();
    });

    it("should render paragraph with correct text", () => {
      render(<SectionHeader description="Sample text for section" />);

      const paragraph = screen.getByText("Sample text for section");
      expect(paragraph.tagName).toBe("P");
    });
  });

  describe("Styling", () => {
    it("should apply default className", () => {
      const { container } = render(<SectionHeader description="Test" />);

      const header = container.querySelector("header");
      expect(header).toHaveClass("-mb-8");
    });

    it("should apply custom className when provided", () => {
      const { container } = render(<SectionHeader description="Test" className="custom-class" />);

      const header = container.querySelector("header");
      expect(header).toHaveClass("-mb-8");
      expect(header).toHaveClass("custom-class");
    });

    it("should combine default and custom classNames", () => {
      const { container } = render(<SectionHeader description="Test" className="extra-spacing" />);

      const header = container.querySelector("header");
      expect(header?.className).toContain("-mb-8");
      expect(header?.className).toContain("extra-spacing");
    });

    it("should apply text-muted-foreground to paragraph", () => {
      render(<SectionHeader description="Test" />);

      const paragraph = screen.getByText("Test");
      expect(paragraph).toHaveClass("text-muted-foreground");
    });

    it("should handle empty className prop", () => {
      const { container } = render(<SectionHeader description="Test" className="" />);

      const header = container.querySelector("header");
      expect(header).toHaveClass("-mb-8");
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA role", () => {
      const { container } = render(<SectionHeader description="Accessible Header" />);

      const header = container.querySelector("header");
      expect(header).toHaveAttribute("role", "heading");
    });

    it("should have correct ARIA level", () => {
      const { container } = render(<SectionHeader description="Level 2 Header" />);

      const header = container.querySelector("header");
      expect(header).toHaveAttribute("aria-level", "2");
    });

    it("should be accessible by screen readers", () => {
      render(<SectionHeader description="Screen reader text" />);

      const text = screen.getByText("Screen reader text");
      expect(text).toBeVisible();
    });
  });

  describe("Content Display", () => {
    it("should display short descriptions", () => {
      render(<SectionHeader description="Short" />);

      expect(screen.getByText("Short")).toBeInTheDocument();
    });

    it("should display long descriptions", () => {
      const longText = "This is a very long description that spans multiple words and provides detailed information";
      render(<SectionHeader description={longText} />);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("should handle special characters in description", () => {
      const specialText = "Description with special chars: @#$%^&*()";
      render(<SectionHeader description={specialText} />);

      expect(screen.getByText(specialText)).toBeInTheDocument();
    });

    it("should handle descriptions with numbers", () => {
      render(<SectionHeader description="Section 123: Overview" />);

      expect(screen.getByText("Section 123: Overview")).toBeInTheDocument();
    });

    it("should handle descriptions with emojis", () => {
      render(<SectionHeader description="Welcome 👋 to our platform" />);

      expect(screen.getByText("Welcome 👋 to our platform")).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should memoize className calculation", () => {
      const { rerender, container } = render(<SectionHeader description="Test" className="test-class" />);

      const header1 = container.querySelector("header");
      const className1 = header1?.className;

      // Rerender with same props
      rerender(<SectionHeader description="Test" className="test-class" />);

      const header2 = container.querySelector("header");
      const className2 = header2?.className;

      // ClassName should remain the same (memoized)
      expect(className1).toBe(className2);
    });

    it("should update className when prop changes", () => {
      const { rerender, container } = render(<SectionHeader description="Test" className="class-1" />);

      const header1 = container.querySelector("header");
      expect(header1).toHaveClass("class-1");

      // Rerender with different className
      rerender(<SectionHeader description="Test" className="class-2" />);

      const header2 = container.querySelector("header");
      expect(header2).toHaveClass("class-2");
      expect(header2).not.toHaveClass("class-1");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty description", () => {
      render(<SectionHeader description="" />);

      const paragraph = screen.queryByRole("paragraph");
      expect(paragraph).toBeInTheDocument();
    });

    it("should handle whitespace-only description", () => {
      const { container } = render(<SectionHeader description="   " />);

      const paragraph = container.querySelector("p");
      expect(paragraph).toBeInTheDocument();
      expect(paragraph?.textContent).toBe("   ");
    });

    it("should handle multiple spaces in className", () => {
      const { container } = render(<SectionHeader description="Test" className="class1  class2   class3" />);

      const header = container.querySelector("header");
      expect(header?.className).toContain("class1");
      expect(header?.className).toContain("class2");
      expect(header?.className).toContain("class3");
    });
  });
});
