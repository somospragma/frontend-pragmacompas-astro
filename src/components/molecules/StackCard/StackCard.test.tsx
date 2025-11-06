import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StackCard from "./StackCard";

describe("StackCard Component", () => {
  const defaultProps = {
    title: "React Developers",
    count: 25,
    icon: "⚛️",
    color: "bg-blue-100",
  };

  it("should render with required props", () => {
    render(<StackCard {...defaultProps} />);

    expect(screen.getByText("React Developers")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("⚛️")).toBeInTheDocument();
    expect(screen.getByText("desarrolladores")).toBeInTheDocument();
  });

  it("should display title correctly", () => {
    render(<StackCard {...defaultProps} title="Vue.js Developers" />);

    const title = screen.getByText("Vue.js Developers");
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass("text-muted-foreground", "text-sm", "font-medium", "mb-2");
  });

  it("should display count with proper styling", () => {
    render(<StackCard {...defaultProps} count={100} />);

    const count = screen.getByText("100");
    expect(count).toBeInTheDocument();
    expect(count).toHaveClass("text-3xl", "font-bold", "text-foreground");
  });

  it("should display icon with applied color", () => {
    render(<StackCard {...defaultProps} icon="🔥" color="bg-red-200" />);

    const icon = screen.getByText("🔥");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("text-2xl");

    const iconContainer = icon.closest("div");
    expect(iconContainer).toHaveClass("bg-red-200");
  });
});
