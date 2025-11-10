import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Select } from "./Select";

describe("Select", () => {
  const defaultProps = {
    label: "Test Label",
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ],
    value: "",
    onChange: vi.fn(),
  };

  it("should render with label and options", () => {
    render(<Select {...defaultProps} />);

    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Option 1" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Option 2" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Option 3" })).toBeInTheDocument();
  });

  it("should render placeholder when provided", () => {
    render(<Select {...defaultProps} placeholder="Choose an option" />);

    expect(screen.getByRole("option", { name: "Choose an option" })).toBeInTheDocument();
  });

  it("should display selected value correctly", () => {
    render(<Select {...defaultProps} value="option2" />);

    expect(screen.getByDisplayValue("Option 2")).toBeInTheDocument();
  });

  it("should call onChange with sanitized value when option is selected", () => {
    const mockOnChange = vi.fn();
    render(<Select {...defaultProps} onChange={mockOnChange} />);

    const select = screen.getByLabelText("Test Label");
    fireEvent.change(select, { target: { value: "option1" } });

    expect(mockOnChange).toHaveBeenCalledWith("option1");
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("should sanitize values with dangerous characters", () => {
    const mockOnChange = vi.fn();
    const maliciousOptions = [
      { value: "safe", label: "Safe Option" },
      { value: "<script>alert('xss')</script>", label: "Malicious Option" },
    ];

    render(<Select {...defaultProps} options={maliciousOptions} onChange={mockOnChange} />);

    const select = screen.getByLabelText("Test Label");
    fireEvent.change(select, { target: { value: "<script>alert('xss')</script>" } });

    expect(mockOnChange).toHaveBeenCalledWith("scriptalert('xss')/script");
  });

  it("should render required indicator when required prop is true", () => {
    render(<Select {...defaultProps} required />);

    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("should display error message when error prop is provided", () => {
    render(<Select {...defaultProps} error="This field is required" />);

    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Select {...defaultProps} disabled />);

    const select = screen.getByLabelText("Test Label");
    expect(select).toBeDisabled();
  });

  it("should handle empty options array", () => {
    render(<Select {...defaultProps} options={[]} />);

    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
  });

  it("should work without optional props", () => {
    const minimalProps = {
      label: "Minimal Select",
      options: [{ value: "test", label: "Test" }],
      value: "",
      onChange: vi.fn(),
    };

    render(<Select {...minimalProps} />);

    expect(screen.getByLabelText("Minimal Select")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Test" })).toBeInTheDocument();
  });

  it("should handle value changes correctly", () => {
    const mockOnChange = vi.fn();
    const { rerender } = render(<Select {...defaultProps} value="option1" onChange={mockOnChange} />);

    // Initially option1 selected
    expect(screen.getByDisplayValue("Option 1")).toBeInTheDocument();

    // Change value via rerender (simulating parent state update)
    rerender(<Select {...defaultProps} value="option2" onChange={mockOnChange} />);
    expect(screen.getByDisplayValue("Option 2")).toBeInTheDocument();
  });
});
