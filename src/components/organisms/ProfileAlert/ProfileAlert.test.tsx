import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useStore } from "@nanostores/react";
import ProfileAlert from "./ProfileAlert";

vi.mock("@nanostores/react");

describe("ProfileAlert", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering Logic", () => {
    it("should not render when user is not logged in", () => {
      (useStore as Mock).mockReturnValue({
        isLoggedIn: false,
        chapterId: null,
        seniority: null,
      });

      const { container } = render(<ProfileAlert />);
      expect(container.firstChild).toBeNull();
    });

    it("should not render when user is logged in with complete profile", () => {
      (useStore as Mock).mockReturnValue({
        isLoggedIn: true,
        chapterId: "chapter-123",
        seniority: "Senior",
      });

      const { container } = render(<ProfileAlert />);
      expect(container.firstChild).toBeNull();
    });

    it("should render when user is logged in without chapterId", () => {
      (useStore as Mock).mockReturnValue({
        isLoggedIn: true,
        chapterId: null,
        seniority: "Senior",
      });

      render(<ProfileAlert />);
      expect(screen.getByText(/actualiza tus datos/i)).toBeInTheDocument();
    });

    it("should render when user is logged in without seniority", () => {
      (useStore as Mock).mockReturnValue({
        isLoggedIn: true,
        chapterId: "chapter-123",
        seniority: null,
      });

      render(<ProfileAlert />);
      expect(screen.getByText(/actualiza tus datos/i)).toBeInTheDocument();
    });

    it("should render when user is logged in without chapterId and seniority", () => {
      (useStore as Mock).mockReturnValue({
        isLoggedIn: true,
        chapterId: null,
        seniority: null,
      });

      render(<ProfileAlert />);
      expect(screen.getByText(/actualiza tus datos/i)).toBeInTheDocument();
    });

    it("should render when chapterId is empty string", () => {
      (useStore as Mock).mockReturnValue({
        isLoggedIn: true,
        chapterId: "",
        seniority: "Senior",
      });

      render(<ProfileAlert />);
      expect(screen.getByText(/actualiza tus datos/i)).toBeInTheDocument();
    });

    it("should render when seniority is empty string", () => {
      (useStore as Mock).mockReturnValue({
        isLoggedIn: true,
        chapterId: "chapter-123",
        seniority: "",
      });

      render(<ProfileAlert />);
      expect(screen.getByText(/actualiza tus datos/i)).toBeInTheDocument();
    });
  });

  describe("Alert Content", () => {
    beforeEach(() => {
      (useStore as Mock).mockReturnValue({
        isLoggedIn: true,
        chapterId: null,
        seniority: null,
      });
    });

    it("should display the correct alert message", () => {
      render(<ProfileAlert />);
      expect(screen.getByText("Actualiza tus datos para poder acceder a las funcionalidades")).toBeInTheDocument();
    });

    it("should render warning alert variant", () => {
      const { container } = render(<ProfileAlert />);
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toBeInTheDocument();
    });

    it("should have proper container structure", () => {
      const { container } = render(<ProfileAlert />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("w-full", "px-4", "pt-4", "h-14");
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined values for chapterId and seniority", () => {
      (useStore as Mock).mockReturnValue({
        isLoggedIn: true,
        chapterId: undefined,
        seniority: undefined,
      });

      render(<ProfileAlert />);
      expect(screen.getByText(/actualiza tus datos/i)).toBeInTheDocument();
    });

    it("should not render when isLoggedIn is false regardless of profile data", () => {
      (useStore as Mock).mockReturnValue({
        isLoggedIn: false,
        chapterId: null,
        seniority: null,
      });

      const { container } = render(<ProfileAlert />);
      expect(container.firstChild).toBeNull();
    });

    it("should handle when userStore returns minimal data", () => {
      (useStore as Mock).mockReturnValue({
        isLoggedIn: true,
      });

      render(<ProfileAlert />);
      expect(screen.getByText(/actualiza tus datos/i)).toBeInTheDocument();
    });
  });
});
