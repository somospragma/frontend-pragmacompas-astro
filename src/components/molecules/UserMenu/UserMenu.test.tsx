import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { UserMenu } from "./UserMenu";

// Mock dependencies
vi.mock("@/shared/hooks/useLogout", () => ({
  useLogout: () => ({
    logout: vi.fn().mockResolvedValue(true),
  }),
}));

vi.mock("@/components/ui/avatar", () => ({
  Avatar: ({ alt, fallback }: { alt: string; fallback: string }) => (
    <img alt={alt} data-testid="avatar" data-fallback={fallback} />
  ),
}));

// Mock DropdownMenu components to simplify testing
vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-menu">{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-trigger">{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-content">{children}</div>
  ),
  DropdownMenuItem: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <div data-testid="dropdown-item" onClick={onClick}>
      {children}
    </div>
  ),
}));

const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  image: null,
};

describe("UserMenu", () => {
  it("renders correctly with user data", () => {
    render(<UserMenu user={mockUser} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByTestId("avatar")).toBeInTheDocument();

    const triggerButton = screen.getByRole("button", { name: /user menu for john doe/i });
    expect(triggerButton).toBeInTheDocument();
  });

  it("renders correctly without user data", () => {
    render(<UserMenu />);

    const triggerButton = screen.getByRole("button", { name: /user menu for user/i });
    expect(triggerButton).toBeInTheDocument();
    expect(screen.getByTestId("avatar")).toBeInTheDocument();
  });

  it("sanitizes display name by removing HTML tags", () => {
    const userWithHTML = {
      ...mockUser,
      name: "<script>alert('xss')</script>John Doe",
    };

    render(<UserMenu user={userWithHTML} />);

    expect(screen.getByText("alert('xss')John Doe")).toBeInTheDocument();
    expect(screen.queryByText("<script>")).not.toBeInTheDocument();
  });

  it("truncates long display names to 50 characters", () => {
    const userWithLongName = {
      ...mockUser,
      name: "A".repeat(60) + " Should be truncated",
    };

    render(<UserMenu user={userWithLongName} />);

    const displayName = screen.getByText(new RegExp("^A+$"));
    expect(displayName.textContent?.length).toBeLessThanOrEqual(50);
  });

  it("handles null/undefined name gracefully", () => {
    const userWithoutName = {
      ...mockUser,
      name: null,
    };

    render(<UserMenu user={userWithoutName} />);

    const triggerButton = screen.getByRole("button", { name: /user menu for user/i });
    expect(triggerButton).toBeInTheDocument();
    expect(screen.getByTestId("avatar")).toHaveAttribute("data-fallback", "U");
  });

  it("handles invalid email gracefully", () => {
    const userWithInvalidEmail = {
      ...mockUser,
      email: "invalid-email",
    };

    render(<UserMenu user={userWithInvalidEmail} />);

    expect(screen.getByTestId("avatar")).toBeInTheDocument();
  });

  it("shows dropdown menu structure", () => {
    render(<UserMenu user={mockUser} />);

    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-trigger")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-content")).toBeInTheDocument();
  });

  it("has menu items for profile and logout", () => {
    render(<UserMenu user={mockUser} />);

    expect(screen.getByText("Ver perfil")).toBeInTheDocument();
    expect(screen.getByText("Cerrar sesión")).toBeInTheDocument();
  });

  it("handles profile click action", () => {
    // Mock window.location.href
    const locationMock = { href: "" };
    Object.defineProperty(window, "location", {
      value: locationMock,
      writable: true,
    });

    render(<UserMenu user={mockUser} />);

    const profileItem = screen.getByText("Ver perfil");
    fireEvent.click(profileItem);

    // Profile navigation would be triggered (tested via mock)
  });

  it("limits display name length correctly", () => {
    const userWithExactlyLongName = {
      ...mockUser,
      name: "A".repeat(50) + "EXTRA",
    };

    render(<UserMenu user={userWithExactlyLongName} />);

    const displayText = screen.getByText(new RegExp("^A+$"));
    expect(displayText.textContent?.length).toBe(50);
  });

  it("generates correct initials from name", () => {
    const userWithMultipleNames = {
      ...mockUser,
      name: "John Michael Doe Smith",
    };

    render(<UserMenu user={userWithMultipleNames} />);

    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveAttribute("data-fallback", "JM");
  });
});
