import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import UsersStats from "./UsersStats";
import { UserRole } from "@/shared/utils/enums/role";
import { useUsersByRole } from "@/shared/hooks/useUsersByRole";

vi.mock("@/shared/hooks/useUsersByRole");

const mockUseUsersByRole = useUsersByRole as ReturnType<typeof vi.fn>;

describe("UsersStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render loading skeleton when loading is true", () => {
      mockUseUsersByRole.mockReturnValue({ users: [], loading: true });

      const { container } = render(
        <UsersStats chapterId="1" userType={UserRole.TUTOR} label="Tutors" iconColor="green" />
      );

      const skeleton = container.querySelector('[role="status"]');
      expect(skeleton).toBeInTheDocument();
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should render StatCard when data is loaded", () => {
      mockUseUsersByRole.mockReturnValue({
        users: [{ id: "1" }, { id: "2" }, { id: "3" }],
        loading: false,
      });

      render(<UsersStats chapterId="1" userType={UserRole.TUTOR} label="Active Tutors" iconColor="green" />);

      expect(screen.getByText("Active Tutors")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("should render with zero users", () => {
      mockUseUsersByRole.mockReturnValue({ users: [], loading: false });

      render(<UsersStats chapterId="1" userType={UserRole.TUTEE} label="Tutees" iconColor="blue" />);

      expect(screen.getByText("Tutees")).toBeInTheDocument();
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("should render with correct chapter and user type", () => {
      mockUseUsersByRole.mockReturnValue({ users: [{ id: "1" }], loading: false });

      render(<UsersStats chapterId="chapter-123" userType={UserRole.TUTOR} label="Tutors" iconColor="green" />);

      expect(mockUseUsersByRole).toHaveBeenCalledWith({
        chapterId: "chapter-123",
        userType: UserRole.TUTOR,
      });
    });
  });

  describe("Color Variants", () => {
    it("should render with green color variant", () => {
      mockUseUsersByRole.mockReturnValue({ users: [{ id: "1" }], loading: false });

      const { container } = render(
        <UsersStats chapterId="1" userType={UserRole.TUTOR} label="Tutors" iconColor="green" />
      );

      const iconWrapper = container.querySelector(".bg-green-500\\/10");
      expect(iconWrapper).toBeInTheDocument();
    });

    it("should render with blue color variant", () => {
      mockUseUsersByRole.mockReturnValue({ users: [{ id: "1" }], loading: false });

      const { container } = render(
        <UsersStats chapterId="1" userType={UserRole.TUTEE} label="Tutees" iconColor="blue" />
      );

      const iconWrapper = container.querySelector(".bg-blue-500\\/10");
      expect(iconWrapper).toBeInTheDocument();
    });

    it("should render with yellow color variant", () => {
      mockUseUsersByRole.mockReturnValue({ users: [{ id: "1" }], loading: false });

      const { container } = render(
        <UsersStats chapterId="1" userType={UserRole.TUTOR} label="Pending" iconColor="yellow" />
      );

      const iconWrapper = container.querySelector(".bg-yellow-500\\/10");
      expect(iconWrapper).toBeInTheDocument();
    });
  });

  describe("User Count", () => {
    it("should display correct count for single user", () => {
      mockUseUsersByRole.mockReturnValue({ users: [{ id: "1" }], loading: false });

      render(<UsersStats chapterId="1" userType={UserRole.TUTOR} label="Tutors" iconColor="green" />);

      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("should display correct count for multiple users", () => {
      mockUseUsersByRole.mockReturnValue({
        users: [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }],
        loading: false,
      });

      render(<UsersStats chapterId="1" userType={UserRole.TUTEE} label="Tutees" iconColor="blue" />);

      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("should display correct count for large numbers", () => {
      const users = Array.from({ length: 150 }, (_, i) => ({ id: `${i}` }));
      mockUseUsersByRole.mockReturnValue({ users, loading: false });

      render(<UsersStats chapterId="1" userType={UserRole.TUTOR} label="Tutors" iconColor="green" />);

      expect(screen.getByText("150")).toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("should show loading skeleton with proper structure", () => {
      mockUseUsersByRole.mockReturnValue({ users: [], loading: true });

      const { container } = render(
        <UsersStats chapterId="1" userType={UserRole.TUTOR} label="Tutors" iconColor="green" />
      );

      const skeleton = container.querySelector(".animate-pulse");
      expect(skeleton).toBeInTheDocument();
    });

    it("should have aria-busy attribute when loading", () => {
      mockUseUsersByRole.mockReturnValue({ users: [], loading: true });

      const { container } = render(
        <UsersStats chapterId="1" userType={UserRole.TUTOR} label="Tutors" iconColor="green" />
      );

      const section = container.querySelector("section");
      expect(section).toHaveAttribute("aria-busy", "true");
    });

    it("should show sr-only loading text", () => {
      mockUseUsersByRole.mockReturnValue({ users: [], loading: true });

      render(<UsersStats chapterId="1" userType={UserRole.TUTOR} label="Tutors" iconColor="green" />);

      const loadingText = screen.getByText("Loading...");
      expect(loadingText).toHaveClass("sr-only");
    });
  });

  describe("Accessibility", () => {
    it("should use semantic section element", () => {
      mockUseUsersByRole.mockReturnValue({ users: [{ id: "1" }], loading: false });

      const { container } = render(
        <UsersStats chapterId="1" userType={UserRole.TUTOR} label="Active Tutors" iconColor="green" />
      );

      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
    });

    it("should have proper aria-label for statistics section", () => {
      mockUseUsersByRole.mockReturnValue({ users: [{ id: "1" }], loading: false });

      const { container } = render(
        <UsersStats chapterId="1" userType={UserRole.TUTOR} label="Active Tutors" iconColor="green" />
      );

      const section = container.querySelector("section");
      expect(section).toHaveAttribute("aria-label", "Active Tutors statistics");
    });

    it("should have aria-hidden on decorative skeleton elements", () => {
      mockUseUsersByRole.mockReturnValue({ users: [], loading: true });

      const { container } = render(
        <UsersStats chapterId="1" userType={UserRole.TUTOR} label="Tutors" iconColor="green" />
      );

      const decorativeElements = container.querySelectorAll('[aria-hidden="true"]');
      expect(decorativeElements.length).toBeGreaterThan(0);
    });

    it("should have role='status' on loading skeleton", () => {
      mockUseUsersByRole.mockReturnValue({ users: [], loading: true });

      const { container } = render(
        <UsersStats chapterId="1" userType={UserRole.TUTOR} label="Tutors" iconColor="green" />
      );

      const status = container.querySelector('[role="status"]');
      expect(status).toBeInTheDocument();
    });

    it("should have aria-hidden on icon", () => {
      mockUseUsersByRole.mockReturnValue({ users: [{ id: "1" }], loading: false });

      const { container } = render(
        <UsersStats chapterId="1" userType={UserRole.TUTOR} label="Tutors" iconColor="green" />
      );

      const icon = container.querySelector('svg[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should memoize color classes", () => {
      mockUseUsersByRole.mockReturnValue({ users: [{ id: "1" }], loading: false });

      const { rerender, container } = render(
        <UsersStats chapterId="1" userType={UserRole.TUTOR} label="Tutors" iconColor="green" />
      );

      const iconWrapper1 = container.querySelector(".bg-green-500\\/10");
      const classes1 = iconWrapper1?.className;

      // Rerender with same props
      rerender(<UsersStats chapterId="1" userType={UserRole.TUTOR} label="Tutors" iconColor="green" />);

      const iconWrapper2 = container.querySelector(".bg-green-500\\/10");
      const classes2 = iconWrapper2?.className;

      expect(classes1).toBe(classes2);
    });

    it("should update when iconColor changes", () => {
      mockUseUsersByRole.mockReturnValue({ users: [{ id: "1" }], loading: false });

      const { rerender, container } = render(
        <UsersStats chapterId="1" userType={UserRole.TUTOR} label="Tutors" iconColor="green" />
      );

      expect(container.querySelector(".bg-green-500\\/10")).toBeInTheDocument();

      rerender(<UsersStats chapterId="1" userType={UserRole.TUTOR} label="Tutors" iconColor="blue" />);

      expect(container.querySelector(".bg-blue-500\\/10")).toBeInTheDocument();
      expect(container.querySelector(".bg-green-500\\/10")).not.toBeInTheDocument();
    });

    it("should memoize activeUsers calculation", () => {
      const users = [{ id: "1" }, { id: "2" }, { id: "3" }];
      mockUseUsersByRole.mockReturnValue({ users, loading: false });

      const { rerender } = render(
        <UsersStats chapterId="1" userType={UserRole.TUTOR} label="Tutors" iconColor="green" />
      );

      expect(screen.getByText("3")).toBeInTheDocument();

      // Rerender with same users array
      rerender(<UsersStats chapterId="1" userType={UserRole.TUTOR} label="Tutors" iconColor="green" />);

      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle transition from loading to loaded", () => {
      mockUseUsersByRole.mockReturnValue({ users: [], loading: true });

      const { rerender } = render(
        <UsersStats chapterId="1" userType={UserRole.TUTOR} label="Tutors" iconColor="green" />
      );

      expect(screen.getByText("Loading...")).toBeInTheDocument();

      mockUseUsersByRole.mockReturnValue({ users: [{ id: "1" }, { id: "2" }], loading: false });

      rerender(<UsersStats chapterId="1" userType={UserRole.TUTOR} label="Tutors" iconColor="green" />);

      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("should handle empty chapter ID", () => {
      mockUseUsersByRole.mockReturnValue({ users: [], loading: false });

      render(<UsersStats chapterId="" userType={UserRole.TUTOR} label="Tutors" iconColor="green" />);

      expect(mockUseUsersByRole).toHaveBeenCalledWith({
        chapterId: "",
        userType: UserRole.TUTOR,
      });
    });

    it("should handle special characters in label", () => {
      mockUseUsersByRole.mockReturnValue({ users: [{ id: "1" }], loading: false });

      render(
        <UsersStats chapterId="1" userType={UserRole.TUTOR} label="Tutors & Mentors (Active)" iconColor="green" />
      );

      expect(screen.getByText("Tutors & Mentors (Active)")).toBeInTheDocument();
    });

    it("should handle re-mounting without errors", () => {
      mockUseUsersByRole.mockReturnValue({ users: [{ id: "1" }], loading: false });

      const { unmount } = render(
        <UsersStats chapterId="1" userType={UserRole.TUTOR} label="Tutors" iconColor="green" />
      );

      expect(screen.getByText("Tutors")).toBeInTheDocument();

      unmount();

      // Re-mount by rendering again (not using rerender after unmount)
      render(<UsersStats chapterId="1" userType={UserRole.TUTOR} label="Tutors" iconColor="green" />);

      expect(screen.getByText("Tutors")).toBeInTheDocument();
    });
  });

  describe("Layout", () => {
    it("should use grid layout", () => {
      mockUseUsersByRole.mockReturnValue({ users: [{ id: "1" }], loading: false });

      const { container } = render(
        <UsersStats chapterId="1" userType={UserRole.TUTOR} label="Tutors" iconColor="green" />
      );

      const grid = container.querySelector(".grid");
      expect(grid).toBeInTheDocument();
    });

    it("should have responsive grid columns", () => {
      mockUseUsersByRole.mockReturnValue({ users: [{ id: "1" }], loading: false });

      const { container } = render(
        <UsersStats chapterId="1" userType={UserRole.TUTOR} label="Tutors" iconColor="green" />
      );

      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("grid-cols-1");
      expect(grid).toHaveClass("md:grid-cols-3");
    });

    it("should have proper spacing", () => {
      mockUseUsersByRole.mockReturnValue({ users: [{ id: "1" }], loading: false });

      const { container } = render(
        <UsersStats chapterId="1" userType={UserRole.TUTOR} label="Tutors" iconColor="green" />
      );

      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("gap-4");
      expect(grid).toHaveClass("mb-6");
    });
  });
});
