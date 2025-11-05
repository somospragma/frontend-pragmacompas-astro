import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import TutoringPage from "./TutoringPage";
import { getTutoring } from "@/infrastructure/services/getTutorings";
import { toast } from "sonner";
import { logger } from "@/shared/utils/logger";
import { MentorshipStatus } from "@/shared/utils/enums/mentorshipStatus";
import type { Tutoring } from "@/infrastructure/models/Tutoring";

// Mock dependencies
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock("@/shared/utils/logger", () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock("@/infrastructure/services/getTutorings");

vi.mock("@/shared/hooks/useAccessibilityAnnouncer", () => ({
  useAccessibilityAnnouncer: () => ({
    announce: vi.fn(),
    message: "",
  }),
}));

vi.mock("@/store/userStore", () => ({
  userStore: {
    get: vi.fn(() => ({
      chapterId: "chapter-123",
      userId: "user-456",
    })),
    subscribe: vi.fn(),
  },
}));

vi.mock("@nanostores/react", () => ({
  useStore: vi.fn(() => ({
    chapterId: "chapter-123",
    userId: "user-456",
  })),
}));

vi.mock("@/components/organisms/TutoringTable", () => ({
  default: ({ title, data, refetch }: { title: string; data: Tutoring[]; refetch: () => void }) => (
    <div data-testid="tutoring-table">
      <h2>{title}</h2>
      <span data-testid="data-count">{data.length}</span>
      <button onClick={refetch} data-testid="refetch-button">
        Refetch
      </button>
    </div>
  ),
}));

vi.mock("@/components/atoms/StatCard", () => ({
  default: ({ value, label }: { value: number; label: string }) => (
    <div data-testid={`stat-card-${label.toLowerCase().replaceAll(/\s+/g, "-")}`}>
      <span data-testid="stat-value">{value}</span>
      <span data-testid="stat-label">{label}</span>
    </div>
  ),
}));

vi.mock("@/components/atoms/SectionHeader", () => ({
  default: ({ description }: { description: string }) => <h1>{description}</h1>,
}));

vi.mock("@/components/atoms/AccessibilityAnnouncer", () => ({
  AccessibilityAnnouncer: ({ message }: { message: string }) => (
    <div data-testid="accessibility-announcer">{message}</div>
  ),
}));

describe("TutoringPage", () => {
  const createMockResponse = (data: Tutoring[]) => ({
    message: "Success",
    data,
    timestamp: new Date().toISOString(),
  });

  const mockTutoringData: Array<Partial<Tutoring> & { id: string; status: MentorshipStatus }> = [
    {
      id: "1",
      status: MentorshipStatus.CANCELLING,
      skills: [{ id: "skill-1", name: "React" }],
    },
    {
      id: "2",
      status: MentorshipStatus.COMPLETED,
      skills: [{ id: "skill-2", name: "TypeScript" }],
    },
    {
      id: "3",
      status: MentorshipStatus.CANCELLED,
      skills: [{ id: "skill-3", name: "Node.js" }],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render section header with correct description", async () => {
      vi.mocked(getTutoring).mockResolvedValue(createMockResponse(mockTutoringData as Tutoring[]));

      render(<TutoringPage />);

      expect(screen.getByText("Historial y seguimiento de tutorías")).toBeInTheDocument();
    });

    it("should render loading state initially", () => {
      vi.mocked(getTutoring).mockResolvedValue(createMockResponse(mockTutoringData as Tutoring[]));

      render(<TutoringPage />);

      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByText("Cargando tutorías...")).toBeInTheDocument();
    });

    it("should render all three stat cards", async () => {
      vi.mocked(getTutoring).mockResolvedValue(createMockResponse(mockTutoringData as Tutoring[]));

      render(<TutoringPage />);

      await waitFor(() => {
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
      });

      expect(screen.getByTestId("stat-card-total-tutorías")).toBeInTheDocument();
      expect(screen.getByTestId("stat-card-completadas")).toBeInTheDocument();
      expect(screen.getByTestId("stat-card-canceladas")).toBeInTheDocument();
    });

    it("should render AccessibilityAnnouncer component", async () => {
      vi.mocked(getTutoring).mockResolvedValue(createMockResponse(mockTutoringData as Tutoring[]));

      render(<TutoringPage />);

      await waitFor(() => {
        expect(screen.getByTestId("accessibility-announcer")).toBeInTheDocument();
      });
    });
  });

  describe("Data Loading", () => {
    it("should load tutoring data successfully", async () => {
      vi.mocked(getTutoring).mockResolvedValue(createMockResponse(mockTutoringData as Tutoring[]));

      render(<TutoringPage />);

      await waitFor(() => {
        expect(getTutoring).toHaveBeenCalledWith({ chapterId: "chapter-123" });
      });

      await waitFor(() => {
        expect(screen.getByTestId("tutoring-table")).toBeInTheDocument();
      });
    });

    it("should pass tutoring data to TutoringTable", async () => {
      vi.mocked(getTutoring).mockResolvedValue(createMockResponse(mockTutoringData as Tutoring[]));

      render(<TutoringPage />);

      await waitFor(() => {
        const dataCount = screen.getByTestId("data-count");
        expect(dataCount).toHaveTextContent("3");
      });
    });
  });

  describe("Statistics Calculation", () => {
    it("should calculate total tutorings correctly", async () => {
      vi.mocked(getTutoring).mockResolvedValue(createMockResponse(mockTutoringData as Tutoring[]));

      render(<TutoringPage />);

      await waitFor(() => {
        const statCard = screen.getByTestId("stat-card-total-tutorías");
        const value = statCard.querySelector('[data-testid="stat-value"]');
        expect(value).toHaveTextContent("3");
      });
    });

    it("should calculate completed tutorings correctly", async () => {
      vi.mocked(getTutoring).mockResolvedValue(createMockResponse(mockTutoringData as Tutoring[]));

      render(<TutoringPage />);

      await waitFor(() => {
        const statCard = screen.getByTestId("stat-card-completadas");
        const value = statCard.querySelector('[data-testid="stat-value"]');
        expect(value).toHaveTextContent("1");
      });
    });

    it("should calculate cancelled tutorings correctly", async () => {
      vi.mocked(getTutoring).mockResolvedValue(createMockResponse(mockTutoringData as Tutoring[]));

      render(<TutoringPage />);

      await waitFor(() => {
        const statCard = screen.getByTestId("stat-card-canceladas");
        const value = statCard.querySelector('[data-testid="stat-value"]');
        expect(value).toHaveTextContent("1");
      });
    });

    it("should show zero when no tutorings exist", async () => {
      vi.mocked(getTutoring).mockResolvedValue(createMockResponse([]));

      render(<TutoringPage />);

      await waitFor(() => {
        const statCards = screen.getAllByTestId(/stat-card-/);
        for (const card of statCards) {
          const value = card.querySelector('[data-testid="stat-value"]');
          expect(value).toHaveTextContent("0");
        }
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle API errors gracefully", async () => {
      const mockError = new Error("Network error");
      vi.mocked(getTutoring).mockRejectedValue(mockError);

      render(<TutoringPage />);

      await waitFor(() => {
        expect(logger.error).toHaveBeenCalledWith(
          "Error loading tutoring data",
          mockError,
          expect.objectContaining({
            chapterId: "chapter-123",
            userId: "user-456",
          })
        );
      });
    });

    it("should show error toast on API failure", async () => {
      vi.mocked(getTutoring).mockRejectedValue(new Error("Network error"));

      render(<TutoringPage />);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Error al cargar tutorías",
          expect.objectContaining({
            description: expect.any(String),
          })
        );
      });
    });

    it("should set empty array on error", async () => {
      vi.mocked(getTutoring).mockRejectedValue(new Error("Network error"));

      render(<TutoringPage />);

      await waitFor(() => {
        const dataCount = screen.getByTestId("data-count");
        expect(dataCount).toHaveTextContent("0");
      });
    });

    it("should hide loading state after error", async () => {
      vi.mocked(getTutoring).mockRejectedValue(new Error("Network error"));

      render(<TutoringPage />);

      await waitFor(() => {
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes on loading state", () => {
      vi.mocked(getTutoring).mockResolvedValue(createMockResponse(mockTutoringData as Tutoring[]));

      render(<TutoringPage />);

      const loadingContainer = screen.getByRole("status");
      expect(loadingContainer).toHaveAttribute("aria-live", "polite");
    });

    it("should have screen reader text for loading spinner", () => {
      vi.mocked(getTutoring).mockResolvedValue(createMockResponse(mockTutoringData as Tutoring[]));

      render(<TutoringPage />);

      const srText = screen.getByText("Cargando tutorías...");
      expect(srText).toHaveClass("sr-only");
    });
  });

  describe("Refetch Functionality", () => {
    it("should allow refetching data", async () => {
      vi.mocked(getTutoring).mockResolvedValue(createMockResponse(mockTutoringData as Tutoring[]));

      render(<TutoringPage />);

      // Wait for initial load to complete
      await waitFor(() => {
        expect(screen.getByTestId("tutoring-table")).toBeInTheDocument();
      });

      // Get initial call count (may be 1 or 2 due to React StrictMode)
      const initialCallCount = vi.mocked(getTutoring).mock.calls.length;

      const refetchButton = screen.getByTestId("refetch-button");
      refetchButton.click();

      // Verify refetch increased call count
      await waitFor(() => {
        expect(getTutoring).toHaveBeenCalledTimes(initialCallCount + 1);
      });
    });
  });

  describe("Performance Optimization", () => {
    it("should memoize statistics calculation", async () => {
      vi.mocked(getTutoring).mockResolvedValue(createMockResponse(mockTutoringData as Tutoring[]));

      const { rerender } = render(<TutoringPage />);

      await waitFor(() => {
        expect(screen.getByTestId("tutoring-table")).toBeInTheDocument();
      });

      // Get initial stat values
      const initialTotal = screen
        .getByTestId("stat-card-total-tutorías")
        .querySelector('[data-testid="stat-value"]')?.textContent;

      // Rerender without data change
      rerender(<TutoringPage />);

      // Values should remain the same (memoized)
      const newTotal = screen
        .getByTestId("stat-card-total-tutorías")
        .querySelector('[data-testid="stat-value"]')?.textContent;

      expect(initialTotal).toBe(newTotal);
    });
  });
});
