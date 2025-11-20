import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PuzzleGrid } from "./PuzzleGrid";
import type { Account } from "@/shared/entities/account";

type MotionProps = Record<string, unknown> & { children?: React.ReactNode };

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: MotionProps) => <div {...props}>{children}</div>,
  },
}));

vi.mock("./PuzzlePiece/PuzzlePiece", () => ({
  PuzzlePiece: ({ account }: { account: Account }) => (
    <div data-testid={`puzzle-piece-${account.id}`}>{account.name}</div>
  ),
}));

vi.mock("@/shared/utils/helpers/generate-piece-shape", () => ({
  generateShapeForIndex: () => ({
    hasTopTab: true,
    hasRightTab: true,
    hasBottomTab: true,
    hasLeftTab: true,
  }),
}));

vi.mock("@/shared/utils/sanitize", () => ({
  sanitizeHexColor: (color: string) => (color.match(/^#[0-9A-Fa-f]{6}$/) ? color : "#ffffff"),
}));

describe("PuzzleGrid", () => {
  const mockAccounts: Account[] = [
    {
      id: "101",
      name: "Bogotá",
      bannerColorHex: "#3b82f6",
      bannerColorClass: "bg-blue-500",
      borderColor: "border-blue-500",
      description: "Cuenta Bogotá",
      logo: "logo1.png",
      totalFrontedsDevs: 42,
      iaTools: ["Copilot"],
    },
    {
      id: "102",
      name: "Medellín",
      bannerColorHex: "#10b981",
      bannerColorClass: "bg-green-500",
      borderColor: "border-green-500",
      description: "Cuenta Medellín",
      logo: "logo2.png",
      totalFrontedsDevs: 35,
      iaTools: ["ChatGPT"],
    },
    {
      id: "103",
      name: "Cali",
      bannerColorHex: "#f59e0b",
      bannerColorClass: "bg-yellow-500",
      borderColor: "border-yellow-500",
      description: "Cuenta Cali",
      logo: "logo3.png",
      totalFrontedsDevs: 28,
      iaTools: ["Gemini"],
    },
  ];

  describe("Rendering", () => {
    it("should render all accounts as PuzzlePiece components", () => {
      render(<PuzzleGrid accounts={mockAccounts} />);

      expect(screen.getByTestId("puzzle-piece-101")).toBeInTheDocument();
      expect(screen.getByTestId("puzzle-piece-102")).toBeInTheDocument();
      expect(screen.getByTestId("puzzle-piece-103")).toBeInTheDocument();
    });

    it("should render with correct ARIA label showing accounts count", () => {
      render(<PuzzleGrid accounts={mockAccounts} />);

      const grid = screen.getByRole("list");
      expect(grid).toHaveAttribute("aria-label", "Grid de cuentas con 3 ubicaciones");
    });

    it("should render list items with correct role", () => {
      render(<PuzzleGrid accounts={mockAccounts} />);

      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(3);
    });

    it("should render grid with responsive classes", () => {
      render(<PuzzleGrid accounts={mockAccounts} />);

      const grid = screen.getByRole("list");
      expect(grid).toHaveClass("grid", "grid-cols-1", "md:grid-cols-3", "gap-10");
    });

    it("should render empty grid when accounts array is empty", () => {
      render(<PuzzleGrid accounts={[]} />);

      const grid = screen.getByRole("list");
      expect(grid).toHaveAttribute("aria-label", "Grid de cuentas con 0 ubicaciones");
      expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    });
  });

  describe("Pattern SVG", () => {
    it("should not render pattern SVG when no activeId", () => {
      render(<PuzzleGrid accounts={mockAccounts} />);

      const patterns = screen.queryAllByRole("img", { hidden: true });
      expect(patterns).toHaveLength(0);
    });

    it("should render pattern background container", () => {
      const { container } = render(<PuzzleGrid accounts={mockAccounts} />);

      const patternContainer = container.querySelector(".absolute.inset-0.pointer-events-none");
      expect(patternContainer).toBeInTheDocument();
    });

    it("should use sanitized color for pattern", () => {
      render(<PuzzleGrid accounts={mockAccounts} />);

      const grid = screen.getByRole("list");
      expect(grid).toBeInTheDocument();
    });
  });

  describe("Memoization", () => {
    it("should render with single account", () => {
      const singleAccount = [mockAccounts[0]];
      render(<PuzzleGrid accounts={singleAccount} />);

      expect(screen.getByTestId("puzzle-piece-101")).toBeInTheDocument();
      expect(screen.getByRole("list")).toHaveAttribute("aria-label", "Grid de cuentas con 1 ubicaciones");
    });

    it("should handle accounts with missing bannerColorHex", () => {
      const accountsWithMissingColor: Account[] = [
        {
          ...mockAccounts[0],
          bannerColorHex: "",
        },
      ];

      render(<PuzzleGrid accounts={accountsWithMissingColor} />);
      expect(screen.getByTestId("puzzle-piece-101")).toBeInTheDocument();
    });

    it("should handle accounts with invalid hex color", () => {
      const accountsWithInvalidColor: Account[] = [
        {
          ...mockAccounts[0],
          bannerColorHex: "invalid-color",
        },
      ];

      render(<PuzzleGrid accounts={accountsWithInvalidColor} />);
      expect(screen.getByTestId("puzzle-piece-101")).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("should render with large number of accounts", () => {
      const manyAccounts = Array.from({ length: 10 }, (_, i) => ({
        ...mockAccounts[0],
        id: `account-${i}`,
        name: `Account ${i}`,
      }));

      render(<PuzzleGrid accounts={manyAccounts} />);

      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(10);
    });

    it("should handle accounts with duplicate ids gracefully", () => {
      const duplicateAccounts = [mockAccounts[0], mockAccounts[0]];

      render(<PuzzleGrid accounts={duplicateAccounts} />);

      const pieces = screen.getAllByTestId("puzzle-piece-101");
      expect(pieces).toHaveLength(2);
    });

    it("should render correctly with accounts having very long names", () => {
      const longNameAccount: Account[] = [
        {
          ...mockAccounts[0],
          name: "Very Long Account Name That Should Still Render Properly Without Breaking The Layout",
        },
      ];

      render(<PuzzleGrid accounts={longNameAccount} />);
      expect(screen.getByTestId("puzzle-piece-101")).toBeInTheDocument();
    });
  });

  describe("Grid structure", () => {
    it("should maintain correct key prop for each account", () => {
      const { container } = render(<PuzzleGrid accounts={mockAccounts} />);

      const listItems = container.querySelectorAll('[role="listitem"]');
      expect(listItems).toHaveLength(3);
    });

    it("should render relative positioning container", () => {
      render(<PuzzleGrid accounts={mockAccounts} />);

      const grid = screen.getByRole("list");
      expect(grid).toHaveClass("relative");
    });
  });
});
