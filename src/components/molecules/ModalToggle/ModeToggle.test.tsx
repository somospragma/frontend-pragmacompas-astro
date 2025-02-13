import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { ModeToggle } from "../ModeToggle";

// Mock the lucide-react components
vi.mock("lucide-react", () => ({
  Moon: () => <div data-testid="moon-icon">Moon</div>,
  Sun: () => <div data-testid="sun-icon">Sun</div>,
}));

describe("ModeToggle", () => {
  beforeEach(() => {
    // Clear DOM between tests
    document.documentElement.classList.remove("dark");

    // Reset matchMedia mock before each test
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("renders correctly with initial light theme", () => {
    render(<ModeToggle />);

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
    expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
    expect(screen.getByText("Toggle theme")).toBeInTheDocument();
  });

  it("opens dropdown menu when clicked", async () => {
    render(<ModeToggle />);

    const button = screen.getByRole("button");
    await userEvent.click(button);

    expect(screen.getByText("Light")).toBeInTheDocument();
    expect(screen.getByText("Dark")).toBeInTheDocument();
    expect(screen.getByText("System")).toBeInTheDocument();
  });

  it("switches to dark theme when dark option is selected", async () => {
    render(<ModeToggle />);

    const button = screen.getByRole("button");
    await userEvent.click(button);

    const darkOption = screen.getByText("Dark");
    await userEvent.click(darkOption);

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("switches to light theme when light option is selected", async () => {
    // Start with dark theme
    document.documentElement.classList.add("dark");
    render(<ModeToggle />);

    const button = screen.getByRole("button");
    await userEvent.click(button);

    const lightOption = screen.getByText("Light");
    await userEvent.click(lightOption);

    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("responds to system preference when system option is selected", async () => {
    // Mock system dark mode preference
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(<ModeToggle />);

    const button = screen.getByRole("button");
    await userEvent.click(button);

    const systemOption = screen.getByText("System");
    await userEvent.click(systemOption);

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("initializes theme based on document class on mount", () => {
    document.documentElement.classList.add("dark");
    render(<ModeToggle />);

    // Initial effect should detect dark theme
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
