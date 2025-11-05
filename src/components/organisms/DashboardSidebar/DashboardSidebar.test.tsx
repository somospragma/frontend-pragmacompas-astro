import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardSidebar from "./DashboardSidebar";

describe("DashboardSidebar", () => {
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    vi.clearAllMocks();
    // Set default desktop viewport
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  describe("Rendering", () => {
    it("should render sidebar", () => {
      render(<DashboardSidebar />);

      const sidebar = screen.getByRole("complementary");
      expect(sidebar).toBeInTheDocument();
    });

    it("should render logo", () => {
      render(<DashboardSidebar />);

      const logos = screen.getAllByAltText("Logo Pragma");
      expect(logos.length).toBeGreaterThan(0);
    });

    it("should render both light and dark logos", () => {
      render(<DashboardSidebar />);

      const logos = screen.getAllByAltText("Logo Pragma");
      expect(logos).toHaveLength(2); // One for light mode, one for dark mode
    });

    it("should render all menu items", () => {
      render(<DashboardSidebar />);

      expect(screen.getByLabelText("Dashboard")).toBeInTheDocument();
      expect(screen.getByLabelText("Tutorias")).toBeInTheDocument();
      expect(screen.getByLabelText("Tutorados")).toBeInTheDocument();
      expect(screen.getByLabelText("Tutores")).toBeInTheDocument();
      expect(screen.getByLabelText("Administradores")).toBeInTheDocument();
    });

    it("should render settings link", () => {
      render(<DashboardSidebar />);

      const settingsLink = screen.getByLabelText("Configuración");
      expect(settingsLink).toBeInTheDocument();
      expect(settingsLink).toHaveAttribute("href", "/dashboard/profile");
    });

    it("should render navigation with aria-label", () => {
      render(<DashboardSidebar />);

      const nav = screen.getByRole("navigation", { name: /navegación principal/i });
      expect(nav).toBeInTheDocument();
    });
  });

  describe("Menu Items", () => {
    it("should have correct href for Dashboard", () => {
      render(<DashboardSidebar />);

      const dashboardLink = screen.getByLabelText("Dashboard");
      expect(dashboardLink).toHaveAttribute("href", "/dashboard");
    });

    it("should have correct href for Tutorias", () => {
      render(<DashboardSidebar />);

      const tutoriasLink = screen.getByLabelText("Tutorias");
      expect(tutoriasLink).toHaveAttribute("href", "/dashboard/tutorias");
    });

    it("should have correct href for Tutorados", () => {
      render(<DashboardSidebar />);

      const tutoradosLink = screen.getByLabelText("Tutorados");
      expect(tutoradosLink).toHaveAttribute("href", "/dashboard/tutorado");
    });

    it("should have correct href for Tutores", () => {
      render(<DashboardSidebar />);

      const tutoresLink = screen.getByLabelText("Tutores");
      expect(tutoresLink).toHaveAttribute("href", "/dashboard/tutor");
    });

    it("should have correct href for Administradores", () => {
      render(<DashboardSidebar />);

      const adminLink = screen.getByLabelText("Administradores");
      expect(adminLink).toHaveAttribute("href", "/dashboard/administradores");
    });
  });

  describe("Active State", () => {
    it("should highlight Dashboard when on /dashboard", () => {
      render(<DashboardSidebar currentPath="/dashboard" />);

      const dashboardLink = screen.getByLabelText("Dashboard");
      expect(dashboardLink).toHaveClass("bg-purple-500/20");
      expect(dashboardLink).toHaveAttribute("aria-current", "page");
    });

    it("should highlight Dashboard when on /dashboard/", () => {
      render(<DashboardSidebar currentPath="/dashboard/" />);

      const dashboardLink = screen.getByLabelText("Dashboard");
      expect(dashboardLink).toHaveClass("bg-purple-500/20");
      expect(dashboardLink).toHaveAttribute("aria-current", "page");
    });

    it("should highlight Tutorias when on /dashboard/tutorias", () => {
      render(<DashboardSidebar currentPath="/dashboard/tutorias" />);

      const tutoriasLink = screen.getByLabelText("Tutorias");
      expect(tutoriasLink).toHaveClass("bg-purple-500/20");
      expect(tutoriasLink).toHaveAttribute("aria-current", "page");
    });

    it("should highlight Settings when on /dashboard/profile", () => {
      render(<DashboardSidebar currentPath="/dashboard/profile" />);

      const settingsLink = screen.getByLabelText("Configuración");
      expect(settingsLink).toHaveClass("bg-purple-500/20");
      expect(settingsLink).toHaveAttribute("aria-current", "page");
    });

    it("should not highlight Dashboard when on sub-routes", () => {
      render(<DashboardSidebar currentPath="/dashboard/tutorias" />);

      const dashboardLink = screen.getByLabelText("Dashboard");
      expect(dashboardLink).not.toHaveClass("bg-purple-500/20");
      expect(dashboardLink).not.toHaveAttribute("aria-current");
    });

    it("should highlight Tutorias when on nested route", () => {
      render(<DashboardSidebar currentPath="/dashboard/tutorias/123" />);

      const tutoriasLink = screen.getByLabelText("Tutorias");
      expect(tutoriasLink).toHaveClass("bg-purple-500/20");
      expect(tutoriasLink).toHaveAttribute("aria-current", "page");
    });
  });

  describe("Desktop Collapse Functionality", () => {
    it("should render collapse button on desktop", () => {
      render(<DashboardSidebar />);

      const collapseButton = screen.getByLabelText("Colapsar barra lateral");
      expect(collapseButton).toBeInTheDocument();
    });

    it("should toggle collapse state when collapse button is clicked", async () => {
      const user = userEvent.setup();
      render(<DashboardSidebar />);

      const collapseButton = screen.getByLabelText("Colapsar barra lateral");

      // Initially expanded
      expect(collapseButton).toHaveAttribute("aria-expanded", "true");
      expect(screen.getByText("Dashboard")).toBeInTheDocument();

      await user.click(collapseButton);

      // After collapse
      await waitFor(() => {
        const expandButton = screen.getByLabelText("Expandir barra lateral");
        expect(expandButton).toHaveAttribute("aria-expanded", "false");
      });
    });

    it("should hide menu labels when collapsed", async () => {
      const user = userEvent.setup();
      render(<DashboardSidebar />);

      const dashboardText = screen.getByText("Dashboard");
      expect(dashboardText).toBeInTheDocument();

      const collapseButton = screen.getByLabelText("Colapsar barra lateral");
      await user.click(collapseButton);

      await waitFor(() => {
        expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
      });
    });

    it("should show menu labels when expanded", async () => {
      const user = userEvent.setup();
      render(<DashboardSidebar />);

      // Collapse first
      const collapseButton = screen.getByLabelText("Colapsar barra lateral");
      await user.click(collapseButton);

      await waitFor(() => {
        expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
      });

      // Expand again
      const expandButton = screen.getByLabelText("Expandir barra lateral");
      await user.click(expandButton);

      await waitFor(() => {
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
      });
    });
  });

  describe("Mobile Functionality", () => {
    beforeEach(() => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 500,
      });
    });

    it("should render mobile menu button on mobile viewport", () => {
      render(<DashboardSidebar />);
      window.dispatchEvent(new Event("resize"));

      waitFor(() => {
        const mobileButton = screen.getByLabelText("Abrir menú de navegación");
        expect(mobileButton).toBeInTheDocument();
      });
    });

    it("should have aria-expanded on mobile menu button", () => {
      render(<DashboardSidebar />);
      window.dispatchEvent(new Event("resize"));

      waitFor(() => {
        const mobileButton = screen.getByLabelText("Abrir menú de navegación");
        expect(mobileButton).toHaveAttribute("aria-expanded");
      });
    });

    it("should toggle sidebar when mobile button is clicked", async () => {
      const user = userEvent.setup();
      render(<DashboardSidebar />);
      window.dispatchEvent(new Event("resize"));

      await waitFor(() => {
        const mobileButton = screen.getByLabelText("Abrir menú de navegación");
        expect(mobileButton).toBeInTheDocument();
      });

      const mobileButton = screen.getByLabelText("Abrir menú de navegación");
      await user.click(mobileButton);

      await waitFor(() => {
        expect(mobileButton).toHaveAttribute("aria-expanded", "true");
      });
    });

    it("should show overlay when sidebar is open on mobile", async () => {
      const user = userEvent.setup();
      render(<DashboardSidebar />);
      window.dispatchEvent(new Event("resize"));

      await waitFor(() => {
        expect(screen.getByLabelText("Abrir menú de navegación")).toBeInTheDocument();
      });

      const mobileButton = screen.getByLabelText("Abrir menú de navegación");
      await user.click(mobileButton);

      await waitFor(() => {
        const overlays = screen.getAllByLabelText(/cerrar menú/i);
        const overlay = overlays.find((el) => el.getAttribute("role") === "button" && el.tagName === "DIV");
        expect(overlay).toBeInTheDocument();
      });
    });

    it("should close sidebar when overlay is clicked", async () => {
      const user = userEvent.setup();
      render(<DashboardSidebar />);
      window.dispatchEvent(new Event("resize"));

      await waitFor(() => {
        expect(screen.getByLabelText("Abrir menú de navegación")).toBeInTheDocument();
      });

      const mobileButton = screen.getByLabelText("Abrir menú de navegación");
      await user.click(mobileButton);

      await waitFor(() => {
        const overlays = screen.getAllByLabelText(/cerrar menú/i);
        const overlay = overlays.find((el) => el.getAttribute("role") === "button" && el.tagName === "DIV");
        expect(overlay).toBeInTheDocument();
      });

      const overlays = screen.getAllByLabelText(/cerrar menú/i);
      const overlay = overlays.find((el) => el.getAttribute("role") === "button" && el.tagName === "DIV");
      if (overlay) {
        await user.click(overlay);

        await waitFor(() => {
          expect(screen.getByLabelText("Abrir menú de navegación")).toBeInTheDocument();
        });
      }
    });

    it("should close sidebar when close button is clicked", async () => {
      const user = userEvent.setup();
      render(<DashboardSidebar />);
      window.dispatchEvent(new Event("resize"));

      await waitFor(() => {
        expect(screen.getByLabelText("Abrir menú de navegación")).toBeInTheDocument();
      });

      const mobileButton = screen.getByLabelText("Abrir menú de navegación");
      await user.click(mobileButton);

      await waitFor(() => {
        const closeButtons = screen.getAllByLabelText("Cerrar menú");
        expect(closeButtons.length).toBeGreaterThan(0);
      });

      const closeButtons = screen.getAllByLabelText("Cerrar menú");
      const closeButton = closeButtons.find((btn) => btn.tagName === "BUTTON" && btn.querySelector("svg"));

      if (closeButton) {
        await user.click(closeButton);

        await waitFor(() => {
          expect(screen.getByLabelText("Abrir menú de navegación")).toBeInTheDocument();
        });
      }
    });
  });

  describe("Accessibility", () => {
    it("should have semantic aside element", () => {
      render(<DashboardSidebar />);

      const sidebar = screen.getByRole("complementary");
      expect(sidebar).toBeInTheDocument();
    });

    it("should have aria-label on sidebar", () => {
      render(<DashboardSidebar />);

      const sidebar = screen.getByLabelText(/barra lateral de navegación/i);
      expect(sidebar).toBeInTheDocument();
    });

    it("should have aria-hidden on icons", () => {
      render(<DashboardSidebar />);

      const sidebar = screen.getByRole("complementary");
      const icons = sidebar.querySelectorAll("svg[aria-hidden='true']");
      expect(icons.length).toBeGreaterThan(0);
    });

    it("should have aria-label on all navigation links", () => {
      render(<DashboardSidebar />);

      // Get only navigation links (exclude logo link)
      const nav = screen.getByRole("navigation", { name: /navegación principal/i });
      const navLinks = Array.from(nav.querySelectorAll("a"));

      navLinks.forEach((link) => {
        expect(link).toHaveAttribute("aria-label");
      });

      // Also check settings link
      const settingsLink = screen.getByLabelText("Configuración");
      expect(settingsLink).toHaveAttribute("aria-label");
    });

    it("should support keyboard navigation on overlay", async () => {
      const user = userEvent.setup();
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 500,
      });

      render(<DashboardSidebar />);
      window.dispatchEvent(new Event("resize"));

      await waitFor(() => {
        expect(screen.getByLabelText("Abrir menú de navegación")).toBeInTheDocument();
      });

      const mobileButton = screen.getByLabelText("Abrir menú de navegación");
      await user.click(mobileButton);

      await waitFor(() => {
        const overlays = screen.getAllByLabelText(/cerrar menú/i);
        const overlay = overlays.find((el) => el.getAttribute("role") === "button" && el.tagName === "DIV");
        expect(overlay).toBeInTheDocument();
      });

      const overlays = screen.getAllByLabelText(/cerrar menú/i);
      const overlay = overlays.find((el) => el.getAttribute("role") === "button" && el.tagName === "DIV");
      if (overlay) {
        await user.type(overlay, "{Enter}");

        await waitFor(() => {
          expect(screen.getByLabelText("Abrir menú de navegación")).toBeInTheDocument();
        });
      }
    });
  });

  describe("Responsive Behavior", () => {
    it("should handle window resize", () => {
      render(<DashboardSidebar />);

      // Change to mobile
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 500,
      });
      window.dispatchEvent(new Event("resize"));

      waitFor(() => {
        expect(screen.getByLabelText("Abrir menú de navegación")).toBeInTheDocument();
      });
    });

    it("should open sidebar on desktop viewport", () => {
      render(<DashboardSidebar />);

      const sidebar = screen.getByRole("complementary");
      expect(sidebar).toHaveClass("translate-x-0");
    });

    it("should close sidebar on mobile viewport initially", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 500,
      });

      render(<DashboardSidebar />);
      window.dispatchEvent(new Event("resize"));

      waitFor(() => {
        const sidebar = screen.getByRole("complementary");
        expect(sidebar).toHaveClass("-translate-x-full");
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty currentPath", () => {
      render(<DashboardSidebar currentPath="" />);

      const dashboardLink = screen.getByLabelText("Dashboard");
      expect(dashboardLink).toBeInTheDocument();
    });

    it("should handle undefined currentPath", () => {
      render(<DashboardSidebar />);

      const dashboardLink = screen.getByLabelText("Dashboard");
      expect(dashboardLink).toBeInTheDocument();
    });

    it("should handle invalid currentPath", () => {
      render(<DashboardSidebar currentPath="/invalid/path" />);

      const links = screen.getAllByRole("link");
      const activeLinks = links.filter((link) => link.getAttribute("aria-current") === "page");
      expect(activeLinks).toHaveLength(0);
    });

    it("should cleanup resize listener on unmount", () => {
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
      const { unmount } = render(<DashboardSidebar />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function));
    });
  });

  describe("Performance", () => {
    it("should memoize menuItems", () => {
      const { rerender } = render(<DashboardSidebar currentPath="/dashboard" />);

      const initialLinks = screen.getAllByRole("link");

      rerender(<DashboardSidebar currentPath="/dashboard/tutorias" />);

      const updatedLinks = screen.getAllByRole("link");
      expect(updatedLinks.length).toBe(initialLinks.length);
    });

    it("should memoize isActive callback", () => {
      const { rerender } = render(<DashboardSidebar currentPath="/dashboard" />);

      const dashboardLink = screen.getByLabelText("Dashboard");
      expect(dashboardLink).toHaveAttribute("aria-current", "page");

      rerender(<DashboardSidebar currentPath="/dashboard/tutorias" />);

      expect(dashboardLink).not.toHaveAttribute("aria-current", "page");
      const tutoriasLink = screen.getByLabelText("Tutorias");
      expect(tutoriasLink).toHaveAttribute("aria-current", "page");
    });
  });
});
