import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import HistoryTables from "@/components/organisms/HistoryTables/HistoryTables";
import { UserRole } from "@/shared/utils/enums/role";
import type { MentorshipData } from "@/shared/config/historyTableConfig";

// Mock dependencies
vi.mock("@/shared/hooks/useHistoryTables", () => ({
  useHistoryTables: vi.fn(() => ({
    data: [],
    isLoading: false,
    refetch: vi.fn(),
  })),
}));

vi.mock("@/store/userStore", () => ({
  userStore: {
    get: vi.fn(() => ({
      userId: "user-123",
      email: "test@test.com",
      name: "Test User",
    })),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock("@/shared/utils/logger", () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
    debug: vi.fn(),
  },
}));

describe("HistoryTables Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      render(<HistoryTables />);
      expect(screen.getByRole("region", { name: /historial de mentorías/i })).toBeInTheDocument();
    });

    it("should render AccessibilityAnnouncer", () => {
      render(<HistoryTables />);
      const announcer = screen.getByRole("status");
      expect(announcer).toBeInTheDocument();
      expect(announcer).toHaveClass("sr-only");
    });

    it("should render with empty data", () => {
      render(<HistoryTables />);
      expect(screen.getByRole("region")).toBeInTheDocument();
    });
  });

  describe("Data Display", () => {
    it("should render component with mock data", async () => {
      const mockData: MentorshipData[] = [
        {
          id: "1",
          type: "MENTORSHIP",
          myRole: UserRole.TUTOR,
          tutee: {
            name: "John Doe",
            email: "john@test.com",
            role: UserRole.TUTEE,
            id: "tutee-1",
          },
          tutor: {
            name: "Jane Smith",
            email: "jane@test.com",
            role: UserRole.TUTOR,
            id: "tutor-1",
          },
          status: "Activa",
          startDate: "2024-01-01",
          chapter: "Chapter 1",
          skills: ["React", "TypeScript"],
          action: ["FEEDBACK", "CANCEL"],
        },
      ];

      const { useHistoryTables } = await import("@/shared/hooks/useHistoryTables");
      vi.mocked(useHistoryTables).mockReturnValue({
        data: mockData,
        isLoading: false,
        refetch: vi.fn(),
      });

      const { container } = render(<HistoryTables />);

      expect(container).toBeInTheDocument();
      expect(screen.getByRole("region")).toBeInTheDocument();
    });

    it("should show loading state", async () => {
      const { useHistoryTables } = await import("@/shared/hooks/useHistoryTables");
      vi.mocked(useHistoryTables).mockReturnValue({
        data: [],
        isLoading: true,
        refetch: vi.fn(),
      });

      render(<HistoryTables />);

      expect(screen.getByRole("region")).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("should have proper ARIA attributes", () => {
      render(<HistoryTables />);

      const region = screen.getByRole("region", { name: /historial de mentorías/i });
      expect(region).toBeInTheDocument();

      const announcer = screen.getByRole("status");
      expect(announcer).toHaveAttribute("aria-live", "polite");
      expect(announcer).toHaveAttribute("aria-atomic", "true");
    });

    it("should render with correct labels", () => {
      render(<HistoryTables />);

      expect(screen.getByRole("region", { name: /historial de mentorías/i })).toBeInTheDocument();
    });
  });
});
