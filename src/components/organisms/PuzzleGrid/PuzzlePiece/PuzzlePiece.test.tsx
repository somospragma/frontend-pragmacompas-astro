import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PuzzlePiece } from "./PuzzlePiece";
import type { Account } from "@/shared/entities/account";

type MotionProps = Record<string, unknown> & { children?: React.ReactNode };

vi.mock("framer-motion", () => ({
  motion: {
    path: ({ children, ...props }: MotionProps) => <path {...props}>{children}</path>,
    div: ({ children, ...props }: MotionProps) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: MotionProps) => <span {...props}>{children}</span>,
    ul: ({ children, ...props }: MotionProps) => <ul {...props}>{children}</ul>,
  },
}));

vi.mock("@/shared/utils/helpers/hextToRgba", () => ({
  hexToRgba: (color: string, opacity: number) => `rgba(${color}, ${opacity})`,
}));

vi.mock("@/shared/utils/sanitize", () => ({
  sanitizeHexColor: (color: string) => (color.match(/^#[0-9A-Fa-f]{6}$/) ? color : "#1a1a2e"),
  sanitizeInput: (input: string) => input.replace(/<[^>]*>/g, ""),
}));

describe("PuzzlePiece", () => {
  const mockAccount: Account = {
    id: "101",
    name: "Bogotá",
    bannerColorHex: "#3b82f6",
    bannerColorClass: "bg-blue-500",
    borderColor: "border-blue-500",
    description: "Cuenta de Bogotá",
    logo: "logo.png",
    totalFrontedsDevs: 42,
    iaTools: ["Copilot", "ChatGPT"],
  };

  const defaultShape = {
    hasTopTab: true,
    hasRightTab: true,
    hasBottomTab: true,
    hasLeftTab: true,
  };

  const defaultProps = {
    account: mockAccount,
    isActive: false,
    onHover: vi.fn(),
    onLeave: vi.fn(),
    shape: defaultShape,
  };

  describe("Rendering", () => {
    it("should render account name", () => {
      render(<PuzzlePiece {...defaultProps} />);
      expect(screen.getByText("Bogotá")).toBeInTheDocument();
    });

    it("should render total frontend developers count", () => {
      render(<PuzzlePiece {...defaultProps} />);
      expect(screen.getByText(/Fronteños: 42/i)).toBeInTheDocument();
    });

    it("should render IA tools list", () => {
      render(<PuzzlePiece {...defaultProps} />);
      expect(screen.getByText(/IA tools: Copilot, ChatGPT/i)).toBeInTheDocument();
    });

    it("should render SVG with role and aria-label", () => {
      render(<PuzzlePiece {...defaultProps} />);
      const svg = screen.getByRole("img", { name: /Pieza de puzzle para Bogotá/i });
      expect(svg).toBeInTheDocument();
    });

    it("should render link with correct href", () => {
      render(<PuzzlePiece {...defaultProps} />);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/mundo-pragma/cuenta/101");
    });

    it("should render link with aria-label", () => {
      render(<PuzzlePiece {...defaultProps} />);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("aria-label", "Ver detalles de Bogotá - 42 desarrolladores frontend");
    });
  });

  describe("State variations", () => {
    it("should apply active styles when isActive is true", () => {
      render(<PuzzlePiece {...defaultProps} isActive={true} />);
      const svg = screen.getByRole("img");
      expect(svg).toHaveStyle({ filter: "drop-shadow(0 0 8px #3b82f6)" });
    });

    it("should not apply active styles when isActive is false", () => {
      render(<PuzzlePiece {...defaultProps} isActive={false} />);
      const svg = screen.getByRole("img");
      expect(svg).toHaveStyle({ filter: "none" });
    });
  });

  describe("Shape variations", () => {
    it("should render with all tabs", () => {
      const shape = { hasTopTab: true, hasRightTab: true, hasBottomTab: true, hasLeftTab: true };
      const { container } = render(<PuzzlePiece {...defaultProps} shape={shape} />);
      const path = container.querySelector("path");
      expect(path?.getAttribute("d")).toContain("L 100,0 L 120,15");
    });

    it("should render without top tab", () => {
      const shape = { hasTopTab: false, hasRightTab: true, hasBottomTab: true, hasLeftTab: true };
      const { container } = render(<PuzzlePiece {...defaultProps} shape={shape} />);
      const path = container.querySelector("path");
      expect(path?.getAttribute("d")).toContain("L 100,0 L 100,15");
    });

    it("should render without any tabs", () => {
      const shape = { hasTopTab: false, hasRightTab: false, hasBottomTab: false, hasLeftTab: false };
      const { container } = render(<PuzzlePiece {...defaultProps} shape={shape} />);
      const path = container.querySelector("path");
      expect(path).toBeInTheDocument();
    });
  });

  describe("Sanitization", () => {
    it("should sanitize malicious hex color to fallback", () => {
      const maliciousAccount = {
        ...mockAccount,
        bannerColorHex: "javascript:alert('xss')",
      };
      render(<PuzzlePiece {...defaultProps} account={maliciousAccount} isActive={false} />);
      const svg = screen.getByRole("img");
      expect(svg).toHaveStyle({ filter: "none" });
    });

    it("should sanitize HTML in account name", () => {
      const maliciousAccount = {
        ...mockAccount,
        name: "<script>alert('xss')</script>Bogotá",
      };
      render(<PuzzlePiece {...defaultProps} account={maliciousAccount} />);
      expect(screen.getByText("alert('xss')Bogotá")).toBeInTheDocument();
      expect(screen.queryByText(/<script>/)).not.toBeInTheDocument();
    });

    it("should filter out empty IA tools after sanitization", () => {
      const accountWithEmptyTools = {
        ...mockAccount,
        iaTools: ["Copilot", "", "ChatGPT", ""],
      };
      render(<PuzzlePiece {...defaultProps} account={accountWithEmptyTools} />);
      expect(screen.getByText(/IA tools: Copilot, ChatGPT/i)).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("should handle account with single IA tool", () => {
      const singleToolAccount = { ...mockAccount, iaTools: ["Copilot"] };
      render(<PuzzlePiece {...defaultProps} account={singleToolAccount} />);
      expect(screen.getByText(/IA tools: Copilot/i)).toBeInTheDocument();
    });

    it("should handle account with no IA tools", () => {
      const noToolsAccount = { ...mockAccount, iaTools: [] };
      render(<PuzzlePiece {...defaultProps} account={noToolsAccount} />);
      expect(screen.getByText(/IA tools:/i)).toBeInTheDocument();
    });

    it("should handle account with zero frontend developers", () => {
      const zeroDevsAccount = { ...mockAccount, totalFrontedsDevs: 0 };
      render(<PuzzlePiece {...defaultProps} account={zeroDevsAccount} />);
      expect(screen.getByText(/Fronteños: 0/i)).toBeInTheDocument();
    });

    it("should render correctly with very long account name", () => {
      const longNameAccount = { ...mockAccount, name: "A".repeat(100) };
      render(<PuzzlePiece {...defaultProps} account={longNameAccount} />);
      expect(screen.getByText("A".repeat(100))).toBeInTheDocument();
    });
  });
});
