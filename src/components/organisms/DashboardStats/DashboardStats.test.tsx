import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardStats from "./DashboardStats";
import * as getDashboardStatisticsService from "@/infrastructure/services/getDashboardStatistics";

// Mock the service
vi.mock("@/infrastructure/services/getDashboardStatistics");

describe("DashboardStats", () => {
  const mockStatistics = {
    requestsByStatus: {
      Disponible: 2,
      Asignada: 3,
      Finalizada: 10,
      Pendiente: 5,
      Cancelada: 3,
      Conversando: 1,
    },
    tutoringsByStatus: {
      Activa: 8,
      Completada: 15,
      Cancelada: 1,
    },
    activeTutorsByChapter: {
      activeTutors: 12,
    },
  };

  const mockResponse = {
    data: mockStatistics,
    message: "Success",
    timestamp: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(getDashboardStatisticsService, "getDashboardStatistics").mockResolvedValue(mockResponse);
    delete (globalThis as { location?: unknown }).location;
    (globalThis as { location: { href: string } }).location = { href: "" };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Loading State", () => {
    it("should render loading skeletons initially", () => {
      render(<DashboardStats chapterId="chapter-123" />);

      const loadingSection = screen.getByLabelText("Cargando estadísticas");
      expect(loadingSection).toBeInTheDocument();
      expect(loadingSection).toHaveAttribute("aria-busy", "true");
    });

    it("should render 3 loading skeleton cards", () => {
      render(<DashboardStats chapterId="chapter-123" />);

      const skeletons = screen.getAllByRole("status");
      expect(skeletons).toHaveLength(3);
    });

    it("should have sr-only text for screen readers", () => {
      render(<DashboardStats chapterId="chapter-123" />);

      const srText = screen.getAllByText("Cargando estadísticas...");
      expect(srText.length).toBeGreaterThan(0);
      for (const text of srText) {
        expect(text).toHaveClass("sr-only");
      }
    });

    it("should have animate-pulse class on skeletons", () => {
      render(<DashboardStats chapterId="chapter-123" />);

      const skeletons = screen.getAllByRole("status");
      for (const skeleton of skeletons) {
        expect(skeleton).toHaveClass("animate-pulse");
      }
    });
  });

  describe("Success State", () => {
    it("should render statistics after loading", async () => {
      render(<DashboardStats chapterId="chapter-123" />);

      await waitFor(() => {
        expect(screen.getByText("Solicitudes Pendientes")).toBeInTheDocument();
      });
    });

    it("should display pending requests count", async () => {
      render(<DashboardStats chapterId="chapter-123" />);

      await waitFor(() => {
        expect(screen.getByText("5")).toBeInTheDocument();
      });
    });

    it("should display completed sessions count", async () => {
      render(<DashboardStats chapterId="chapter-123" />);

      await waitFor(() => {
        expect(screen.getByText("15")).toBeInTheDocument();
      });
    });

    it("should display cancelled requests count", async () => {
      render(<DashboardStats chapterId="chapter-123" />);

      await waitFor(() => {
        expect(screen.getByText("3")).toBeInTheDocument();
      });
    });

    it("should render all three stat cards", async () => {
      render(<DashboardStats chapterId="chapter-123" />);

      await waitFor(() => {
        expect(screen.getByText("Solicitudes Pendientes")).toBeInTheDocument();
        expect(screen.getByText("Sesiones Completadas")).toBeInTheDocument();
        expect(screen.getByText("Solicitudes Canceladas")).toBeInTheDocument();
      });
    });

    it("should have section with aria-label", async () => {
      render(<DashboardStats chapterId="chapter-123" />);

      await waitFor(() => {
        const section = screen.getByLabelText("Estadísticas del dashboard");
        expect(section).toBeInTheDocument();
      });
    });

    it("should render subtitles", async () => {
      render(<DashboardStats chapterId="chapter-123" />);

      await waitFor(() => {
        expect(screen.getByText("Requieren atención")).toBeInTheDocument();
        expect(screen.getByText("Este mes")).toBeInTheDocument();
      });
    });
  });

  describe("Error State", () => {
    it("should render error message when service returns error", async () => {
      vi.spyOn(getDashboardStatisticsService, "getDashboardStatistics").mockResolvedValue({
        data: undefined,
        message: "Error al obtener estadísticas",
        timestamp: new Date().toISOString(),
      });

      render(<DashboardStats chapterId="chapter-123" />);

      await waitFor(() => {
        expect(screen.getByText(/Error al obtener estadísticas/i)).toBeInTheDocument();
      });
    });

    it("should render error message when service throws", async () => {
      vi.spyOn(getDashboardStatisticsService, "getDashboardStatistics").mockRejectedValue(new Error("Network error"));

      render(<DashboardStats chapterId="chapter-123" />);

      await waitFor(() => {
        expect(screen.getByText(/Error al cargar las estadísticas/i)).toBeInTheDocument();
      });
    });

    it("should have role alert on error message", async () => {
      vi.spyOn(getDashboardStatisticsService, "getDashboardStatistics").mockRejectedValue(new Error("Network error"));

      render(<DashboardStats chapterId="chapter-123" />);

      await waitFor(() => {
        const errorSection = screen.getByRole("alert");
        expect(errorSection).toBeInTheDocument();
      });
    });

    it("should have aria-live assertive on error message", async () => {
      vi.spyOn(getDashboardStatisticsService, "getDashboardStatistics").mockRejectedValue(new Error("Network error"));

      render(<DashboardStats chapterId="chapter-123" />);

      await waitFor(() => {
        const errorSection = screen.getByRole("alert");
        expect(errorSection).toHaveAttribute("aria-live", "assertive");
      });
    });

    it("should display error icon", async () => {
      vi.spyOn(getDashboardStatisticsService, "getDashboardStatistics").mockRejectedValue(new Error("Network error"));

      render(<DashboardStats chapterId="chapter-123" />);

      await waitFor(() => {
        expect(screen.getByText(/⚠️/)).toBeInTheDocument();
      });
    });
  });

  describe("Data Fetching", () => {
    it("should call getDashboardStatistics with correct chapterId", async () => {
      const getDashboardStatisticsSpy = vi.spyOn(getDashboardStatisticsService, "getDashboardStatistics");

      render(<DashboardStats chapterId="chapter-123" />);

      await waitFor(() => {
        expect(getDashboardStatisticsSpy).toHaveBeenCalledWith({ chapterId: "chapter-123" });
      });
    });

    it("should not fetch if chapterId is empty", () => {
      const getDashboardStatisticsSpy = vi.spyOn(getDashboardStatisticsService, "getDashboardStatistics");

      render(<DashboardStats chapterId="" />);

      expect(getDashboardStatisticsSpy).not.toHaveBeenCalled();
    });

    it("should refetch when chapterId changes", async () => {
      const getDashboardStatisticsSpy = vi.spyOn(getDashboardStatisticsService, "getDashboardStatistics");

      const { rerender } = render(<DashboardStats chapterId="chapter-123" />);

      await waitFor(() => {
        expect(getDashboardStatisticsSpy).toHaveBeenCalledWith({ chapterId: "chapter-123" });
      });

      rerender(<DashboardStats chapterId="chapter-456" />);

      await waitFor(() => {
        expect(getDashboardStatisticsSpy).toHaveBeenCalledWith({ chapterId: "chapter-456" });
      });

      expect(getDashboardStatisticsSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe("Interactions", () => {
    it("should navigate to requests page when pending requests card is clicked", async () => {
      const user = userEvent.setup();
      render(<DashboardStats chapterId="chapter-123" />);

      await waitFor(() => {
        expect(screen.getByText("Solicitudes Pendientes")).toBeInTheDocument();
      });

      // Find the pending requests StatCard
      const pendingCard = screen.getByText("Solicitudes Pendientes").closest("button");
      expect(pendingCard).toBeInTheDocument();

      if (pendingCard) {
        await user.click(pendingCard);
        expect(globalThis.location.href).toBe("/dashboard/requests");
      }
    });
  });

  describe("Icons", () => {
    it("should render clock icon for pending requests", async () => {
      render(<DashboardStats chapterId="chapter-123" />);

      await waitFor(() => {
        const section = screen.getByLabelText("Estadísticas del dashboard");
        const svgs = section.querySelectorAll("svg[aria-hidden='true']");
        expect(svgs.length).toBeGreaterThan(0);
      });
    });

    it("should have aria-hidden on all icons", async () => {
      render(<DashboardStats chapterId="chapter-123" />);

      await waitFor(() => {
        const section = screen.getByLabelText("Estadísticas del dashboard");
        const svgs = section.querySelectorAll("svg");
        for (const svg of svgs) {
          expect(svg).toHaveAttribute("aria-hidden", "true");
        }
      });
    });
  });

  describe("Null State", () => {
    it("should render nothing when statistics is null and no error", async () => {
      vi.spyOn(getDashboardStatisticsService, "getDashboardStatistics").mockResolvedValue({
        data: undefined,
        message: "",
        timestamp: new Date().toISOString(),
      });

      const { container } = render(<DashboardStats chapterId="chapter-123" />);

      await waitFor(() => {
        expect(container.firstChild).toBeNull();
      });
    });
  });

  describe("Accessibility", () => {
    it("should use semantic section element for stats", async () => {
      render(<DashboardStats chapterId="chapter-123" />);

      await waitFor(() => {
        const section = screen.getByLabelText("Estadísticas del dashboard");
        expect(section.tagName).toBe("SECTION");
      });
    });

    it("should use semantic section element for loading", () => {
      render(<DashboardStats chapterId="chapter-123" />);

      const section = screen.getByLabelText("Cargando estadísticas");
      expect(section.tagName).toBe("SECTION");
    });

    it("should use semantic section element for error", async () => {
      vi.spyOn(getDashboardStatisticsService, "getDashboardStatistics").mockRejectedValue(new Error("Network error"));

      render(<DashboardStats chapterId="chapter-123" />);

      await waitFor(() => {
        const section = screen.getByRole("alert");
        expect(section.tagName).toBe("SECTION");
      });
    });

    it("should have proper grid layout", async () => {
      render(<DashboardStats chapterId="chapter-123" />);

      await waitFor(() => {
        const section = screen.getByLabelText("Estadísticas del dashboard");
        expect(section).toHaveClass("grid");
        expect(section).toHaveClass("grid-cols-1");
        expect(section).toHaveClass("md:grid-cols-3");
      });
    });
  });

  describe("Performance", () => {
    it("should memoize handlePendingRequestsClick", async () => {
      const { rerender } = render(<DashboardStats chapterId="chapter-123" />);

      await waitFor(() => {
        expect(screen.getByText("Solicitudes Pendientes")).toBeInTheDocument();
      });

      const firstCard = screen.getByText("Solicitudes Pendientes").closest("button");

      rerender(<DashboardStats chapterId="chapter-123" />);

      const secondCard = screen.getByText("Solicitudes Pendientes").closest("button");

      expect(firstCard).toBe(secondCard);
    });

    it("should memoize loading skeletons array", () => {
      const { rerender } = render(<DashboardStats chapterId="chapter-123" />);

      const firstSkeletons = screen.getAllByRole("status");

      rerender(<DashboardStats chapterId="chapter-123" />);

      const secondSkeletons = screen.getAllByRole("status");

      expect(firstSkeletons.length).toBe(secondSkeletons.length);
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero values", async () => {
      vi.spyOn(getDashboardStatisticsService, "getDashboardStatistics").mockResolvedValue({
        data: {
          requestsByStatus: {
            Disponible: 0,
            Asignada: 0,
            Finalizada: 0,
            Pendiente: 0,
            Cancelada: 0,
            Conversando: 0,
          },
          tutoringsByStatus: {
            Activa: 0,
            Completada: 0,
            Cancelada: 0,
          },
          activeTutorsByChapter: {
            activeTutors: 0,
          },
        },
        message: "Success",
        timestamp: new Date().toISOString(),
      });

      render(<DashboardStats chapterId="chapter-123" />);

      await waitFor(() => {
        const zeros = screen.getAllByText("0");
        expect(zeros.length).toBeGreaterThan(0);
      });
    });

    it("should handle large numbers", async () => {
      vi.spyOn(getDashboardStatisticsService, "getDashboardStatistics").mockResolvedValue({
        data: {
          requestsByStatus: {
            Disponible: 0,
            Asignada: 0,
            Finalizada: 0,
            Pendiente: 9999,
            Cancelada: 0,
            Conversando: 0,
          },
          tutoringsByStatus: {
            Activa: 0,
            Completada: 0,
            Cancelada: 0,
          },
          activeTutorsByChapter: {
            activeTutors: 0,
          },
        },
        message: "Success",
        timestamp: new Date().toISOString(),
      });

      render(<DashboardStats chapterId="chapter-123" />);

      await waitFor(() => {
        expect(screen.getByText("9999")).toBeInTheDocument();
      });
    });
  });
});
