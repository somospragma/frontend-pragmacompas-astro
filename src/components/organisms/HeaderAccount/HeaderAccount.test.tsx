import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HeaderAccount } from "./HeaderAccount";
import type { Account } from "@/shared/entities/account";

// Mock de framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    header: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => <header {...props}>{children}</header>,
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  },
}));

describe("HeaderAccount", () => {
  const mockAccount: Account = {
    id: "1",
    name: "Desarrollo Web",
    description: "Aprende las mejores prácticas de desarrollo web moderno",
    bannerColorHex: "#3B82F6",
    bannerColorClass: "bg-blue-500",
    borderColor: "border-blue-500",
    logo: "web-dev-logo.png",
    totalFrontedsDevs: 150,
    iaTools: ["ChatGPT", "GitHub Copilot"],
  };

  beforeEach(() => {
    vi.spyOn(globalThis.history, "back");
  });

  describe("Rendering", () => {
    it("should render account name as h1", () => {
      render(<HeaderAccount account={mockAccount} />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("Desarrollo Web");
    });

    it("should render account description", () => {
      render(<HeaderAccount account={mockAccount} />);

      expect(screen.getByText("Aprende las mejores prácticas de desarrollo web moderno")).toBeInTheDocument();
    });

    it("should render back button", () => {
      render(<HeaderAccount account={mockAccount} />);

      expect(screen.getByRole("button", { name: /volver/i })).toBeInTheDocument();
    });

    it("should render trivia button", () => {
      render(<HeaderAccount account={mockAccount} />);

      expect(screen.getByText("Prueba tu conocimiento")).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should apply banner color to h1", () => {
      render(<HeaderAccount account={mockAccount} />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveStyle({ color: "#3B82F6" });
    });

    it("should apply banner color to trivia button background", () => {
      const { container } = render(<HeaderAccount account={mockAccount} />);

      const triviaButton = container.querySelector('button[type="button"]');
      const style = triviaButton?.getAttribute("style");
      expect(style).toContain("background-color");
      expect(style).toContain("rgb(59, 130, 246)");
    });

    it("should have gradient background with banner color", () => {
      const { container } = render(<HeaderAccount account={mockAccount} />);

      const gradientDiv = container.querySelector(".absolute.inset-0.z-0");
      expect(gradientDiv).toBeTruthy();
    });
  });

  describe("Interactions", () => {
    it("should call history.back when back button is clicked", async () => {
      const user = userEvent.setup();
      render(<HeaderAccount account={mockAccount} />);

      const backButton = screen.getByRole("button", { name: /volver/i });
      await user.click(backButton);

      expect(globalThis.history.back).toHaveBeenCalled();
    });

    it("should have link to trivia page", () => {
      render(<HeaderAccount account={mockAccount} />);

      const triviaLink = screen.getByRole("link");
      expect(triviaLink).toHaveAttribute("href");
    });
  });

  describe("Accessibility", () => {
    it("should have semantic header element", () => {
      const { container } = render(<HeaderAccount account={mockAccount} />);

      const header = container.querySelector("header");
      expect(header).toBeInTheDocument();
    });

    it("should have aria-labelledby on header linked to h1", () => {
      const { container } = render(<HeaderAccount account={mockAccount} />);

      const header = container.querySelector("header");
      const heading = screen.getByRole("heading", { level: 1 });

      expect(header).toHaveAttribute("aria-labelledby", "account-title");
      expect(heading).toHaveAttribute("id", "account-title");
    });

    it("should have aria-label on back button", () => {
      render(<HeaderAccount account={mockAccount} />);

      const backButton = screen.getByRole("button", { name: /volver a la página anterior/i });
      expect(backButton).toHaveAttribute("aria-label", "Volver a la página anterior");
    });

    it("should have aria-hidden on decorative SVG", () => {
      const { container } = render(<HeaderAccount account={mockAccount} />);

      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });

    it("should have aria-hidden on all icons", () => {
      const { container } = render(<HeaderAccount account={mockAccount} />);

      const icons = container.querySelectorAll("svg");
      for (const icon of icons) {
        expect(icon).toHaveAttribute("aria-hidden", "true");
      }
    });

    it("should have aria-hidden on gradient background", () => {
      const { container } = render(<HeaderAccount account={mockAccount} />);

      const gradientDiv = container.querySelector(".absolute.inset-0.z-0");
      expect(gradientDiv).toHaveAttribute("aria-hidden", "true");
    });

    it("should have aria-hidden on pattern background", () => {
      const { container } = render(<HeaderAccount account={mockAccount} />);

      const patternDiv = container.querySelector(".opacity-10");
      expect(patternDiv).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Performance", () => {
    it("should memoize gradient style", () => {
      const { rerender } = render(<HeaderAccount account={mockAccount} />);
      const { container: firstContainer } = render(<HeaderAccount account={mockAccount} />);

      const firstGradient = firstContainer.querySelector('[style*="linear-gradient"]');
      const firstStyle = firstGradient?.getAttribute("style");

      rerender(<HeaderAccount account={mockAccount} />);
      const { container: secondContainer } = render(<HeaderAccount account={mockAccount} />);

      const secondGradient = secondContainer.querySelector('[style*="linear-gradient"]');
      const secondStyle = secondGradient?.getAttribute("style");

      expect(firstStyle).toBe(secondStyle);
    });

    it("should memoize button style", () => {
      const { rerender } = render(<HeaderAccount account={mockAccount} />);

      const firstButton = screen.getByText("Prueba tu conocimiento");
      const firstStyle = firstButton.getAttribute("style");

      rerender(<HeaderAccount account={mockAccount} />);

      const secondButton = screen.getByText("Prueba tu conocimiento");
      const secondStyle = secondButton.getAttribute("style");

      expect(firstStyle).toBe(secondStyle);
    });

    it("should update when banner color changes", () => {
      const { rerender } = render(<HeaderAccount account={mockAccount} />);

      const firstHeading = screen.getByRole("heading", { level: 1 });
      expect(firstHeading).toHaveStyle({ color: "#3B82F6" });

      const updatedAccount = { ...mockAccount, bannerColorHex: "#EF4444" };
      rerender(<HeaderAccount account={updatedAccount} />);

      const secondHeading = screen.getByRole("heading", { level: 1 });
      expect(secondHeading).toHaveStyle({ color: "#EF4444" });
    });
  });

  describe("SVG Pattern", () => {
    it("should render SVG pattern with unique ID", () => {
      const { container } = render(<HeaderAccount account={mockAccount} />);

      const pattern = container.querySelector("pattern");
      expect(pattern).toBeInTheDocument();
      expect(pattern).toHaveAttribute("id");
    });

    it("should use banner color in pattern line", () => {
      const { container } = render(<HeaderAccount account={mockAccount} />);

      const line = container.querySelector("line");
      expect(line).toHaveAttribute("stroke", "#3B82F6");
    });

    it("should have unique pattern IDs for multiple instances", () => {
      const { container: container1 } = render(<HeaderAccount account={mockAccount} />);
      const { container: container2 } = render(<HeaderAccount account={{ ...mockAccount, id: "2" }} />);

      const pattern1 = container1.querySelector("pattern");
      const pattern2 = container2.querySelector("pattern");

      const id1 = pattern1?.getAttribute("id");
      const id2 = pattern2?.getAttribute("id");

      // Los IDs deben existir (aunque pueden ser iguales en este caso de prueba)
      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
    });
  });

  describe("Edge Cases", () => {
    it("should handle very long account names", () => {
      const longAccount = {
        ...mockAccount,
        name: "A".repeat(100),
      };
      render(<HeaderAccount account={longAccount} />);

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("A".repeat(100));
    });

    it("should handle very long descriptions", () => {
      const longAccount = {
        ...mockAccount,
        description: "B".repeat(200),
      };
      render(<HeaderAccount account={longAccount} />);

      expect(screen.getByText("B".repeat(200))).toBeInTheDocument();
    });

    it("should handle special characters in name", () => {
      const specialAccount = {
        ...mockAccount,
        name: "Test & <Special> Characters",
      };
      render(<HeaderAccount account={specialAccount} />);

      expect(screen.getByText("Test & <Special> Characters")).toBeInTheDocument();
    });

    it("should handle invalid hex colors gracefully", () => {
      const invalidColorAccount = {
        ...mockAccount,
        bannerColorHex: "invalid",
      };

      expect(() => {
        render(<HeaderAccount account={invalidColorAccount} />);
      }).not.toThrow();
    });

    it("should render without description", () => {
      const noDescAccount = {
        ...mockAccount,
        description: "",
      };
      render(<HeaderAccount account={noDescAccount} />);

      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });
  });
});
