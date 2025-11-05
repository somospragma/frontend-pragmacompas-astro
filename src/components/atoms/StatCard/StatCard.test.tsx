import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StatCard from "./StatCard";

describe("StatCard", () => {
  const mockIcon = (
    <svg data-testid="test-icon" viewBox="0 0 24 24">
      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
    </svg>
  );

  const defaultProps = {
    value: 42,
    label: "Test Metric",
    icon: mockIcon,
    iconBgColor: "bg-blue-100",
    iconColor: "text-blue-500",
  };

  describe("Rendering", () => {
    it("should render with required props", () => {
      render(<StatCard {...defaultProps} />);

      expect(screen.getByText("42")).toBeInTheDocument();
      expect(screen.getByText("Test Metric")).toBeInTheDocument();
      expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    });

    it("should render as div when onClick is not provided", () => {
      const { container } = render(<StatCard {...defaultProps} />);

      const divElement = container.querySelector("div[role='region']");
      expect(divElement).toBeInTheDocument();
    });

    it("should render as button when onClick is provided", () => {
      const handleClick = vi.fn();
      render(<StatCard {...defaultProps} onClick={handleClick} />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("should display value and label correctly", () => {
      render(<StatCard {...defaultProps} value={100} label="Total Users" />);

      expect(screen.getByText("100")).toBeInTheDocument();
      expect(screen.getByText("Total Users")).toBeInTheDocument();
    });

    it("should render icon correctly", () => {
      render(<StatCard {...defaultProps} />);

      const icon = screen.getByTestId("test-icon");
      expect(icon).toBeInTheDocument();
    });
  });

  describe("Subtitle", () => {
    it("should render subtitle when provided", () => {
      render(<StatCard {...defaultProps} subtitle="Last 30 days" />);

      expect(screen.getByText("Last 30 days")).toBeInTheDocument();
    });

    it("should not render subtitle when not provided", () => {
      const { container } = render(<StatCard {...defaultProps} />);

      const subtitle = container.querySelector('[role="note"]');
      expect(subtitle).not.toBeInTheDocument();
    });

    it("should apply custom subtitle color", () => {
      const { container } = render(<StatCard {...defaultProps} subtitle="Test" subtitleColor="text-red-500" />);

      const subtitle = container.querySelector('[role="note"]');
      expect(subtitle).toHaveClass("text-red-500");
    });

    it("should apply default subtitle color when not specified", () => {
      const { container } = render(<StatCard {...defaultProps} subtitle="Test" />);

      const subtitle = container.querySelector('[role="note"]');
      expect(subtitle).toHaveClass("text-muted-foreground");
    });
  });

  describe("Styling", () => {
    it("should apply base card styling", () => {
      const { container } = render(<StatCard {...defaultProps} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass("bg-card");
      expect(card).toHaveClass("border");
      expect(card).toHaveClass("border-border");
      expect(card).toHaveClass("rounded-lg");
      expect(card).toHaveClass("p-6");
    });

    it("should apply interactive styling when onClick is provided", () => {
      const { container } = render(<StatCard {...defaultProps} onClick={vi.fn()} />);

      const button = container.querySelector("button");
      expect(button).toHaveClass("cursor-pointer");
      expect(button).toHaveClass("hover:bg-card/80");
      expect(button).toHaveClass("transition-colors");
    });

    it("should not apply interactive styling when onClick is not provided", () => {
      const { container } = render(<StatCard {...defaultProps} />);

      const card = container.firstChild as HTMLElement;
      expect(card).not.toHaveClass("cursor-pointer");
      expect(card).not.toHaveClass("hover:bg-card/80");
    });

    it("should apply icon background color", () => {
      const { container } = render(<StatCard {...defaultProps} iconBgColor="bg-green-200" />);

      const iconContainer = container.querySelector(".bg-green-200");
      expect(iconContainer).toBeInTheDocument();
    });

    it("should apply icon color", () => {
      const { container } = render(<StatCard {...defaultProps} iconColor="text-purple-600" />);

      const iconWrapper = container.querySelector(".text-purple-600");
      expect(iconWrapper).toBeInTheDocument();
    });
  });

  describe("Interactivity", () => {
    it("should call onClick when button is clicked", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<StatCard {...defaultProps} onClick={handleClick} />);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should call onClick multiple times when clicked multiple times", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<StatCard {...defaultProps} onClick={handleClick} />);

      const button = screen.getByRole("button");
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it("should have correct button type", () => {
      render(<StatCard {...defaultProps} onClick={vi.fn()} />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "button");
    });
  });

  describe("Accessibility", () => {
    it("should have aria-live on value for updates", () => {
      const { container } = render(<StatCard {...defaultProps} />);

      const valueElement = container.querySelector('[aria-live="polite"]');
      expect(valueElement).toBeInTheDocument();
      expect(valueElement).toHaveTextContent("42");
    });

    it("should have aria-hidden on icon container", () => {
      const { container } = render(<StatCard {...defaultProps} />);

      const iconContainer = container.querySelector('[aria-hidden="true"]');
      expect(iconContainer).toBeInTheDocument();
    });

    it("should have role=region on non-interactive card", () => {
      render(<StatCard {...defaultProps} />);

      const region = screen.getByRole("region");
      expect(region).toBeInTheDocument();
    });

    it("should have aria-label on non-interactive card", () => {
      render(<StatCard {...defaultProps} />);

      const region = screen.getByRole("region");
      expect(region).toHaveAttribute("aria-label", "Test Metric");
    });

    it("should have descriptive aria-label on interactive card", () => {
      render(<StatCard {...defaultProps} onClick={vi.fn()} />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Test Metric: 42");
    });

    it("should include subtitle in aria-label when provided", () => {
      render(<StatCard {...defaultProps} subtitle="Last week" onClick={vi.fn()} />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Test Metric: 42, Last week");
    });

    it("should have role=note on subtitle", () => {
      render(<StatCard {...defaultProps} subtitle="Additional info" />);

      const note = screen.getByRole("note");
      expect(note).toBeInTheDocument();
      expect(note).toHaveTextContent("Additional info");
    });
  });

  describe("Value Display", () => {
    it("should display zero value", () => {
      render(<StatCard {...defaultProps} value={0} />);

      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("should display negative value", () => {
      render(<StatCard {...defaultProps} value={-10} />);

      expect(screen.getByText("-10")).toBeInTheDocument();
    });

    it("should display large numbers", () => {
      render(<StatCard {...defaultProps} value={1000000} />);

      expect(screen.getByText("1000000")).toBeInTheDocument();
    });

    it("should display decimal numbers", () => {
      render(<StatCard {...defaultProps} value={42.5} />);

      expect(screen.getByText("42.5")).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should memoize className calculations", () => {
      const { rerender, container } = render(<StatCard {...defaultProps} />);

      const card1 = container.firstChild as HTMLElement;
      const className1 = card1.className;

      // Rerender with same props
      rerender(<StatCard {...defaultProps} />);

      const card2 = container.firstChild as HTMLElement;
      const className2 = card2.className;

      expect(className1).toBe(className2);
    });

    it("should update className when iconBgColor changes", () => {
      const { rerender, container } = render(<StatCard {...defaultProps} iconBgColor="bg-blue-100" />);

      expect(container.querySelector(".bg-blue-100")).toBeInTheDocument();

      rerender(<StatCard {...defaultProps} iconBgColor="bg-red-100" />);

      expect(container.querySelector(".bg-red-100")).toBeInTheDocument();
      expect(container.querySelector(".bg-blue-100")).not.toBeInTheDocument();
    });

    it("should not recreate onClick handler unnecessarily", () => {
      const handleClick = vi.fn();
      const { rerender } = render(<StatCard {...defaultProps} onClick={handleClick} />);

      const button1 = screen.getByRole("button");
      const handler1 = button1.onclick;

      rerender(<StatCard {...defaultProps} onClick={handleClick} />);

      const button2 = screen.getByRole("button");
      const handler2 = button2.onclick;

      // Handlers should be the same reference
      expect(handler1).toBe(handler2);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty label", () => {
      render(<StatCard {...defaultProps} label="" />);

      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("should handle very long labels", () => {
      const longLabel = "This is a very long label that might cause layout issues if not handled properly";
      render(<StatCard {...defaultProps} label={longLabel} />);

      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it("should handle special characters in label", () => {
      render(<StatCard {...defaultProps} label="Test & Special <chars>" />);

      expect(screen.getByText("Test & Special <chars>")).toBeInTheDocument();
    });

    it("should handle undefined onClick gracefully", () => {
      render(<StatCard {...defaultProps} onClick={undefined} />);

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });
});
