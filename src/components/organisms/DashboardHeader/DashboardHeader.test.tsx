import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardHeader from "./DashboardHeader";
import type { User } from "@auth/core/types";

// Mock child components
vi.mock("@/components/molecules/ModalToggle/ModeToggle", () => ({
  ModeToggle: () => <button data-testid="mode-toggle">Toggle Theme</button>,
}));

vi.mock("@/components/molecules/UserMenu", () => ({
  UserMenu: ({ user }: { user?: User }) => (
    <div data-testid="user-menu">{user ? <span>User: {user.name}</span> : <span>No user</span>}</div>
  ),
}));

describe("DashboardHeader", () => {
  const mockUser: User = {
    id: "user-123",
    name: "John Doe",
    email: "john.doe@example.com",
    image: "https://example.com/avatar.jpg",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render header element", () => {
      render(<DashboardHeader />);

      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();
    });

    it("should render Dashboard title", () => {
      render(<DashboardHeader />);

      const title = screen.getByRole("heading", { name: /dashboard/i });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent("Dashboard");
    });

    it("should render title as h1", () => {
      render(<DashboardHeader />);

      const title = screen.getByRole("heading", { name: /dashboard/i });
      expect(title.tagName).toBe("H1");
    });

    it("should render ModeToggle component", () => {
      render(<DashboardHeader />);

      expect(screen.getByTestId("mode-toggle")).toBeInTheDocument();
    });

    it("should render UserMenu component", () => {
      render(<DashboardHeader />);

      expect(screen.getByTestId("user-menu")).toBeInTheDocument();
    });
  });

  describe("User Prop", () => {
    it("should render without user", () => {
      render(<DashboardHeader />);

      expect(screen.getByText("No user")).toBeInTheDocument();
    });

    it("should render with user", () => {
      render(<DashboardHeader user={mockUser} />);

      expect(screen.getByText(`User: ${mockUser.name}`)).toBeInTheDocument();
    });

    it("should pass user prop to UserMenu", () => {
      render(<DashboardHeader user={mockUser} />);

      const userMenu = screen.getByTestId("user-menu");
      expect(userMenu).toBeInTheDocument();
      expect(screen.getByText(`User: ${mockUser.name}`)).toBeInTheDocument();
    });
  });

  describe("Layout Structure", () => {
    it("should have proper flex layout for content distribution", () => {
      render(<DashboardHeader />);

      const header = screen.getByRole("banner");
      const container = header.firstChild as HTMLElement;

      expect(container).toHaveClass("flex");
      expect(container).toHaveClass("items-center");
      expect(container).toHaveClass("justify-between");
    });

    it("should have left section with title", () => {
      render(<DashboardHeader />);

      const title = screen.getByRole("heading", { name: /dashboard/i });
      const leftSection = title.parentElement;

      expect(leftSection).toHaveClass("flex");
      expect(leftSection).toHaveClass("items-center");
      expect(leftSection).toHaveClass("space-x-4");
    });

    it("should have right section with controls", () => {
      render(<DashboardHeader />);

      const nav = screen.getByRole("navigation");
      expect(nav).toHaveClass("flex");
      expect(nav).toHaveClass("items-center");
      expect(nav).toHaveClass("space-x-4");
    });
  });

  describe("Styling", () => {
    it("should have background color classes", () => {
      render(<DashboardHeader />);

      const header = screen.getByRole("banner");
      expect(header).toHaveClass("bg-white");
      expect(header).toHaveClass("dark:bg-gray-800");
    });

    it("should have border classes", () => {
      render(<DashboardHeader />);

      const header = screen.getByRole("banner");
      expect(header).toHaveClass("border-b");
      expect(header).toHaveClass("border-gray-200");
      expect(header).toHaveClass("dark:border-gray-700");
    });

    it("should have shadow class", () => {
      render(<DashboardHeader />);

      const header = screen.getByRole("banner");
      expect(header).toHaveClass("shadow-sm");
    });

    it("should have padding classes", () => {
      render(<DashboardHeader />);

      const header = screen.getByRole("banner");
      expect(header).toHaveClass("px-6");
      expect(header).toHaveClass("py-4");
    });

    it("should have transition classes", () => {
      render(<DashboardHeader />);

      const header = screen.getByRole("banner");
      expect(header).toHaveClass("transition-colors");
      expect(header).toHaveClass("duration-300");
    });

    it("should have proper title styling", () => {
      render(<DashboardHeader />);

      const title = screen.getByRole("heading", { name: /dashboard/i });
      expect(title).toHaveClass("text-2xl");
      expect(title).toHaveClass("font-semibold");
      expect(title).toHaveClass("text-gray-800");
      expect(title).toHaveClass("dark:text-white");
    });
  });

  describe("Accessibility", () => {
    it("should use semantic header element", () => {
      render(<DashboardHeader />);

      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("should have navigation with aria-label", () => {
      render(<DashboardHeader />);

      const nav = screen.getByRole("navigation", { name: /herramientas del dashboard/i });
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute("aria-label", "Herramientas del dashboard");
    });

    it("should have proper heading hierarchy", () => {
      render(<DashboardHeader />);

      const headings = screen.getAllByRole("heading");
      expect(headings[0].tagName).toBe("H1");
    });

    it("should contain ModeToggle within navigation", () => {
      render(<DashboardHeader />);

      const nav = screen.getByRole("navigation");
      const modeToggle = screen.getByTestId("mode-toggle");

      expect(nav).toContainElement(modeToggle);
    });

    it("should contain UserMenu within navigation", () => {
      render(<DashboardHeader />);

      const nav = screen.getByRole("navigation");
      const userMenu = screen.getByTestId("user-menu");

      expect(nav).toContainElement(userMenu);
    });
  });

  describe("Component Integration", () => {
    it("should render both ModeToggle and UserMenu together", () => {
      render(<DashboardHeader user={mockUser} />);

      expect(screen.getByTestId("mode-toggle")).toBeInTheDocument();
      expect(screen.getByTestId("user-menu")).toBeInTheDocument();
    });

    it("should maintain component order (ModeToggle before UserMenu)", () => {
      render(<DashboardHeader />);

      const nav = screen.getByRole("navigation");
      const modeToggle = screen.getByTestId("mode-toggle");
      const userMenu = screen.getByTestId("user-menu");

      // Check both elements are in the nav
      expect(nav).toContainElement(modeToggle);
      expect(nav).toContainElement(userMenu);

      // Verify order by checking if ModeToggle appears before UserMenu in DOM
      const navElements = Array.from(nav.querySelectorAll("[data-testid]"));
      const modeToggleIndex = navElements.indexOf(modeToggle);
      const userMenuIndex = navElements.indexOf(userMenu);

      expect(modeToggleIndex).toBeGreaterThanOrEqual(0);
      expect(userMenuIndex).toBeGreaterThanOrEqual(0);
      expect(modeToggleIndex).toBeLessThan(userMenuIndex);
    });
  });

  describe("Responsive Behavior", () => {
    it("should have responsive padding", () => {
      render(<DashboardHeader />);

      const header = screen.getByRole("banner");
      expect(header).toHaveClass("px-6");
      expect(header).toHaveClass("py-4");
    });

    it("should use flexbox for responsive layout", () => {
      render(<DashboardHeader />);

      const header = screen.getByRole("banner");
      const container = header.firstChild as HTMLElement;

      expect(container).toHaveClass("flex");
      expect(container).toHaveClass("justify-between");
    });
  });

  describe("Dark Mode Support", () => {
    it("should have dark mode classes for background", () => {
      render(<DashboardHeader />);

      const header = screen.getByRole("banner");
      expect(header).toHaveClass("dark:bg-gray-800");
    });

    it("should have dark mode classes for border", () => {
      render(<DashboardHeader />);

      const header = screen.getByRole("banner");
      expect(header).toHaveClass("dark:border-gray-700");
    });

    it("should have dark mode classes for title text", () => {
      render(<DashboardHeader />);

      const title = screen.getByRole("heading", { name: /dashboard/i });
      expect(title).toHaveClass("dark:text-white");
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined user gracefully", () => {
      render(<DashboardHeader user={undefined} />);

      expect(screen.getByTestId("user-menu")).toBeInTheDocument();
      expect(screen.getByText("No user")).toBeInTheDocument();
    });

    it("should handle user with minimal data", () => {
      const minimalUser: User = {
        id: "123",
        name: "Test User",
        email: "test@example.com",
      };

      render(<DashboardHeader user={minimalUser} />);

      expect(screen.getByText(`User: ${minimalUser.name}`)).toBeInTheDocument();
    });

    it("should render consistently across multiple renders", () => {
      const { rerender } = render(<DashboardHeader user={mockUser} />);

      expect(screen.getByText(`User: ${mockUser.name}`)).toBeInTheDocument();

      rerender(<DashboardHeader user={mockUser} />);

      expect(screen.getByText(`User: ${mockUser.name}`)).toBeInTheDocument();
    });
  });
});
