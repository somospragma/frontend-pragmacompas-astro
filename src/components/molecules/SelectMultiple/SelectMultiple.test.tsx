import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SelectMultiple } from "./SelectMultiple";

// Mock shared utilities
vi.mock("@/shared/utils/inputValidation", () => ({
  sanitizeSearchQuery: (value: string) => value.replace(/[<>]/g, ""),
  isValidOption: (value: string, options: Array<{ value: string }>) => options.some((opt) => opt.value === value),
  combineAriaDescribedBy: (...args: Array<string | null | undefined>) => args.filter(Boolean).join(" ") || undefined,
}));

describe("SelectMultiple", () => {
  const defaultProps = {
    label: "Test MultiSelect",
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ],
    value: [],
    onChange: vi.fn(),
  };

  it("should render with label and placeholder", () => {
    render(<SelectMultiple {...defaultProps} placeholder="Choose multiple options" />);

    expect(screen.getByLabelText(/Test MultiSelect/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Choose multiple options")).toBeInTheDocument();
  });
  it("should open dropdown when input is clicked", () => {
    render(<SelectMultiple {...defaultProps} />);

    const input = screen.getByLabelText(/Test MultiSelect/);
    fireEvent.click(input);

    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  it("should select multiple options correctly", () => {
    const mockOnChange = vi.fn();
    render(<SelectMultiple {...defaultProps} onChange={mockOnChange} />);

    const input = screen.getByLabelText(/Test MultiSelect/);
    fireEvent.click(input);

    // Select first option
    fireEvent.click(screen.getByText("Option 1"));
    expect(mockOnChange).toHaveBeenCalledWith(["option1"]);

    // Select second option (should add to array)
    fireEvent.click(screen.getByText("Option 2"));
    expect(mockOnChange).toHaveBeenCalledWith(["option2"]);
  });

  it("should deselect option when clicked again", () => {
    const mockOnChange = vi.fn();
    render(<SelectMultiple {...defaultProps} value={["option1"]} onChange={mockOnChange} />);

    const input = screen.getByLabelText(/Test MultiSelect/);
    fireEvent.click(input);

    // Deselect option1
    fireEvent.click(screen.getByText("Option 1"));
    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  it("should filter options based on search", () => {
    render(<SelectMultiple {...defaultProps} />);

    const input = screen.getByLabelText(/Test MultiSelect/);
    fireEvent.click(input);

    // Search for "Option 1"
    fireEvent.change(input, { target: { value: "Option 1" } });

    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.queryByText("Option 2")).not.toBeInTheDocument();
    expect(screen.queryByText("Option 3")).not.toBeInTheDocument();
  });

  it("should show 'No results' when search has no matches", () => {
    render(<SelectMultiple {...defaultProps} />);

    const input = screen.getByLabelText(/Test MultiSelect/);
    fireEvent.click(input);
    fireEvent.change(input, { target: { value: "nonexistent" } });

    expect(screen.getByText("No results")).toBeInTheDocument();
  });

  it("should close dropdown when clicking outside", () => {
    render(<SelectMultiple {...defaultProps} />);

    const input = screen.getByLabelText(/Test MultiSelect/);
    fireEvent.click(input);

    // Dropdown should be open
    expect(screen.getByText("Option 1")).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(document.body);

    // Dropdown should be closed
    expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
  });

  it("should render required indicator when required prop is true", () => {
    render(<SelectMultiple {...defaultProps} required />);

    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("should display error message when error prop is provided", () => {
    render(<SelectMultiple {...defaultProps} error="This field is required" />);

    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("should be disabled when disabled prop is true", () => {
    render(<SelectMultiple {...defaultProps} disabled />);

    const input = screen.getByLabelText(/Test MultiSelect/);
    expect(input).toBeDisabled();
  });

  it("should sanitize search input", () => {
    render(<SelectMultiple {...defaultProps} />);

    const input = screen.getByLabelText(/Test MultiSelect/);
    fireEvent.click(input);
    fireEvent.change(input, { target: { value: "<script>alert('xss')</script>" } });

    // Should be sanitized (< and > removed)
    expect((input as HTMLInputElement).value).toBe("scriptalert('xss')/script");
  });

  it("should handle keyboard navigation - Enter to open/select", () => {
    const mockOnChange = vi.fn();
    render(<SelectMultiple {...defaultProps} onChange={mockOnChange} />);

    const input = screen.getByLabelText(/Test MultiSelect/);

    // Enter to open
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByText("Option 1")).toBeInTheDocument();

    // Arrow down to focus first option, then Enter to select
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockOnChange).toHaveBeenCalledWith(["option1"]);
  });

  it("should handle keyboard navigation - Escape to close", () => {
    render(<SelectMultiple {...defaultProps} />);

    const input = screen.getByLabelText(/Test MultiSelect/);
    fireEvent.click(input);

    // Dropdown should be open
    expect(screen.getByText("Option 1")).toBeInTheDocument();

    // Escape to close
    fireEvent.keyDown(input, { key: "Escape" });

    // Dropdown should be closed
    expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
  });

  it("should work with custom placeholder", () => {
    render(<SelectMultiple {...defaultProps} placeholder="Choose multiple options" />);

    expect(screen.getByPlaceholderText("Choose multiple options")).toBeInTheDocument();
  });
});
