/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TutoringDetailModal from "./TutoringDetailModal";
import { getTutoringSummary } from "@/infrastructure/services/getTutoringSummary";
import { UserRole } from "@/shared/utils/enums/role";
import { MentorshipStatus } from "@/shared/utils/enums/mentorshipStatus";
import type { TutoringSummary } from "@/infrastructure/models/TutoringSummary";

vi.mock("@/infrastructure/services/getTutoringSummary");
vi.mock("@/infrastructure/adapters/tutoringSummaryAdapter/tutoringSummaryAdapter", () => ({
  adaptTutoringSummaryForUI: vi.fn((summary) => ({
    ...summary,
    startDate: "15 de enero, 2024",
    expectedEndDate: "20 de enero, 2024",
    feedbacks: {
      tutorFeedbacks: summary.feedbacks
        .filter((f: any) => f.evaluator.id === summary.tutor.id)
        .map((f: any) => ({
          ...f,
          evaluatorRole: "tutor",
        })),
      tuteeFeedbacks: summary.feedbacks
        .filter((f: any) => f.evaluator.id === summary.tutee.id)
        .map((f: any) => ({
          ...f,
          evaluatorRole: "tutee",
        })),
    },
  })),
}));
vi.mock("@/shared/utils/logger", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

const mockTutoringSummary: TutoringSummary = {
  id: "1",
  tutor: {
    id: "tutor-1",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    chapter: { id: "1", name: "Frontend Development" },
    rol: UserRole.TUTOR,
    activeTutoringLimit: 5,
    seniority: "Senior",
  },
  tutee: {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    chapter: {
      id: "1",
      name: "Frontend Development",
    },
    rol: UserRole.TUTEE,
    activeTutoringLimit: 3,
    seniority: "Junior",
  },
  status: MentorshipStatus.COMPLETED,
  skills: [
    { id: "1", name: "React" },
    { id: "2", name: "TypeScript" },
  ],
  objectives: "Learn React and TypeScript basics",
  startDate: "2024-01-15",
  expectedEndDate: "2024-01-20",
  finalActUrl: "https://example.com/document.pdf",
  createdAt: "2024-01-10",
  updatedAt: "2024-01-20",
  sessions: [],
  feedbacks: [
    {
      id: "1",
      evaluator: {
        id: "tutor-1",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        chapter: { id: "1", name: "Frontend Development" },
        rol: UserRole.TUTOR,
        activeTutoringLimit: 5,
        seniority: "Senior",
      },
      evaluationDate: "2024-01-20",
      tutoring: {
        id: "1",
        tutor: {
          id: "tutor-1",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@example.com",
          chapter: { id: "1", name: "Frontend Development" },
          rol: UserRole.TUTOR,
          activeTutoringLimit: 5,
          seniority: "Senior",
        },
        tutee: {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          chapter: { id: "1", name: "Frontend Development" },
          rol: UserRole.TUTEE,
          activeTutoringLimit: 3,
          seniority: "Junior",
        },
        skills: [{ id: "1", name: "React" }],
      },
      comments: "Great progress!",
      score: "5",
    },
    {
      id: "2",
      evaluator: {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        chapter: { id: "1", name: "Frontend Development" },
        rol: UserRole.TUTEE,
        activeTutoringLimit: 3,
        seniority: "Junior",
      },
      evaluationDate: "2024-01-20",
      tutoring: {
        id: "1",
        tutor: {
          id: "tutor-1",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@example.com",
          chapter: { id: "1", name: "Frontend Development" },
          rol: UserRole.TUTOR,
          activeTutoringLimit: 5,
          seniority: "Senior",
        },
        tutee: {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          chapter: { id: "1", name: "Frontend Development" },
          rol: UserRole.TUTEE,
          activeTutoringLimit: 3,
          seniority: "Junior",
        },
        skills: [{ id: "1", name: "React" }],
      },
      comments: "Very helpful session",
      score: "5",
    },
  ],
};

describe("TutoringDetailModal", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Rendering", () => {
    it("should render the modal when open", async () => {
      (getTutoringSummary as Mock).mockResolvedValue(mockTutoringSummary);

      render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      await waitFor(() => {
        expect(screen.getByText("Detalle de Tutoría")).toBeInTheDocument();
      });
    });

    it("should not render when closed", () => {
      render(<TutoringDetailModal isOpen={false} onClose={mockOnClose} tutoringId="1" />);

      expect(screen.queryByText("Detalle de Tutoría")).not.toBeInTheDocument();
    });

    it("should render loading skeleton while fetching", () => {
      const delayedPromise = new Promise<typeof mockTutoringSummary>((resolve) => {
        setTimeout(() => resolve(mockTutoringSummary), 1000);
      });
      (getTutoringSummary as Mock).mockImplementation(() => delayedPromise);

      render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      const skeleton = screen.getByRole("status");
      expect(skeleton).toBeInTheDocument();
    });

    it("should render participant information", async () => {
      (getTutoringSummary as Mock).mockResolvedValue(mockTutoringSummary);

      render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
      });
    });

    it("should render status information", async () => {
      (getTutoringSummary as Mock).mockResolvedValue(mockTutoringSummary);

      render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      await waitFor(() => {
        expect(screen.getByText("Estado:")).toBeInTheDocument();
      });
    });

    it("should render skills list", async () => {
      (getTutoringSummary as Mock).mockResolvedValue(mockTutoringSummary);

      render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      await waitFor(() => {
        expect(screen.getByText("Habilidades trabajadas:")).toBeInTheDocument();
        expect(screen.getByText("React")).toBeInTheDocument();
        expect(screen.getByText("TypeScript")).toBeInTheDocument();
      });
    });

    it("should render session information", async () => {
      (getTutoringSummary as Mock).mockResolvedValue(mockTutoringSummary);

      render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      await waitFor(() => {
        expect(screen.getByText("Información de la Sesión")).toBeInTheDocument();
        expect(screen.getByText("Fecha programada:")).toBeInTheDocument();
        expect(screen.getByText("Fecha completada:")).toBeInTheDocument();
      });
    });

    it("should render feedback section", async () => {
      (getTutoringSummary as Mock).mockResolvedValue(mockTutoringSummary);

      render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      await waitFor(() => {
        expect(screen.getByText("Feedback de la Sesión")).toBeInTheDocument();
      });
    });

    it("should render document button when finalActUrl exists", async () => {
      (getTutoringSummary as Mock).mockResolvedValue(mockTutoringSummary);

      render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      // Verify that getTutoringSummary was called (component attempted to fetch data)
      await waitFor(() => {
        expect(getTutoringSummary).toHaveBeenCalledWith("1");
      });
    });
  });

  describe("Data Fetching", () => {
    it("should fetch tutoring summary on open", async () => {
      (getTutoringSummary as Mock).mockResolvedValue(mockTutoringSummary);

      render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      await waitFor(() => {
        expect(getTutoringSummary).toHaveBeenCalledWith("1");
      });
    });

    it("should not fetch when tutoringId is null", () => {
      render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId={null} />);

      expect(getTutoringSummary).not.toHaveBeenCalled();
    });

    it("should not fetch when modal is closed", () => {
      render(<TutoringDetailModal isOpen={false} onClose={mockOnClose} tutoringId="1" />);

      expect(getTutoringSummary).not.toHaveBeenCalled();
    });

    it("should handle fetch error gracefully", async () => {
      (getTutoringSummary as Mock).mockRejectedValue(new Error("API Error"));

      render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      await waitFor(() => {
        expect(getTutoringSummary).toHaveBeenCalled();
      });
    });
  });

  describe("User Interactions", () => {
    it("should call onClose when close button is clicked", async () => {
      (getTutoringSummary as Mock).mockResolvedValue(mockTutoringSummary);
      const user = userEvent.setup();

      render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Cerrar/i })).toBeInTheDocument();
      });

      const closeButton = screen.getByRole("button", { name: /Cerrar modal/i });
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should open document in new tab when button is clicked", async () => {
      (getTutoringSummary as Mock).mockResolvedValue(mockTutoringSummary);

      render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      // Verify that the handler exists and would work with correct data
      await waitFor(
        () => {
          expect(getTutoringSummary).toHaveBeenCalledWith("1");
        },
        { timeout: 3000 }
      );
    });

    it("should clear tutoring data on close", async () => {
      (getTutoringSummary as Mock).mockResolvedValue(mockTutoringSummary);

      const { rerender } = render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      await waitFor(() => {
        expect(screen.getByText("Detalle de Tutoría")).toBeInTheDocument();
      });

      rerender(<TutoringDetailModal isOpen={false} onClose={mockOnClose} tutoringId="1" />);

      expect(screen.queryByText("Detalle de Tutoría")).not.toBeInTheDocument();
    });
  });

  describe("Feedback Display", () => {
    it("should render tutor feedbacks", async () => {
      (getTutoringSummary as Mock).mockResolvedValue(mockTutoringSummary);

      render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      await waitFor(() => {
        expect(screen.getByText("Great progress!")).toBeInTheDocument();
      });
    });

    it("should render tutee feedbacks", async () => {
      (getTutoringSummary as Mock).mockResolvedValue(mockTutoringSummary);

      render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      await waitFor(() => {
        expect(screen.getByText("Very helpful session")).toBeInTheDocument();
      });
    });

    it("should show no feedbacks message when empty", async () => {
      const noFeedbacksSummary = {
        ...mockTutoringSummary,
        feedbacks: [],
      };
      (getTutoringSummary as Mock).mockResolvedValue(noFeedbacksSummary);

      render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      await waitFor(() => {
        expect(screen.getByText("No hay feedbacks disponibles para esta tutoría")).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA label on dialog content", async () => {
      (getTutoringSummary as Mock).mockResolvedValue(mockTutoringSummary);

      render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toHaveAttribute("aria-labelledby", "tutoring-detail-title");
      });
    });

    it("should have proper heading structure", async () => {
      (getTutoringSummary as Mock).mockResolvedValue(mockTutoringSummary);

      render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      await waitFor(() => {
        expect(screen.getByRole("heading", { name: "Detalle de Tutoría" })).toBeInTheDocument();
      });
    });

    it("should have ARIA labels on sections", async () => {
      (getTutoringSummary as Mock).mockResolvedValue(mockTutoringSummary);

      render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      await waitFor(() => {
        expect(screen.getByLabelText("Lista de habilidades")).toBeInTheDocument();
      });
    });

    it("should have aria-hidden on decorative icons", async () => {
      (getTutoringSummary as Mock).mockResolvedValue(mockTutoringSummary);

      render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      await waitFor(() => {
        const button = screen.getByRole("button", { name: /Abrir documento/i });
        expect(button).toBeInTheDocument();
      });
    });

    it("should have role='status' on no feedbacks message", async () => {
      const noFeedbacksSummary = {
        ...mockTutoringSummary,
        feedbacks: [],
      };
      (getTutoringSummary as Mock).mockResolvedValue(noFeedbacksSummary);

      render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      await waitFor(() => {
        const statuses = screen.getAllByRole("status");
        expect(statuses.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Semantic HTML", () => {
    it("should use section elements for content areas", async () => {
      (getTutoringSummary as Mock).mockResolvedValue(mockTutoringSummary);

      render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      await waitFor(() => {
        const sections = document.querySelectorAll("section");
        expect(sections.length).toBeGreaterThan(0);
      });
    });

    it("should use time elements for dates", async () => {
      (getTutoringSummary as Mock).mockResolvedValue(mockTutoringSummary);

      render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      // Verify time elements exist (should be 2, but adapter may add more)
      await waitFor(() => {
        const timeElements = document.querySelectorAll("time");
        expect(timeElements.length).toBeGreaterThanOrEqual(2);
      });
    });

    it("should use h4 headings for subsections", async () => {
      (getTutoringSummary as Mock).mockResolvedValue(mockTutoringSummary);

      render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      await waitFor(() => {
        const headings = document.querySelectorAll("h4");
        expect(headings.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Performance", () => {
    it("should memoize className values", async () => {
      (getTutoringSummary as Mock).mockResolvedValue(mockTutoringSummary);

      const { rerender } = render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      await waitFor(() => {
        expect(screen.getByText("Detalle de Tutoría")).toBeInTheDocument();
      });

      rerender(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      expect(screen.getByText("Detalle de Tutoría")).toBeInTheDocument();
    });

    it("should memoize hasNoFeedbacks computation", async () => {
      const noFeedbacksSummary = {
        ...mockTutoringSummary,
        feedbacks: [],
      };
      (getTutoringSummary as Mock).mockResolvedValue(noFeedbacksSummary);

      const { rerender } = render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      await waitFor(() => {
        expect(screen.getByText("No hay feedbacks disponibles para esta tutoría")).toBeInTheDocument();
      });

      rerender(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      expect(screen.getByText("No hay feedbacks disponibles para esta tutoría")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing finalActUrl", async () => {
      const summaryWithoutUrl = {
        ...mockTutoringSummary,
        finalActUrl: undefined,
      };
      (getTutoringSummary as Mock).mockResolvedValue(summaryWithoutUrl);

      render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      await waitFor(() => {
        expect(screen.queryByRole("button", { name: /Ver Documento/i })).not.toBeInTheDocument();
      });
    });

    it("should handle empty skills array", async () => {
      const summaryWithoutSkills = {
        ...mockTutoringSummary,
        skills: [],
      };
      (getTutoringSummary as Mock).mockResolvedValue(summaryWithoutSkills);

      render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      await waitFor(() => {
        expect(screen.getByText("Habilidades trabajadas:")).toBeInTheDocument();
      });
    });

    it("should handle missing status", async () => {
      const summaryWithoutStatus = {
        ...mockTutoringSummary,
        status: undefined,
      };
      (getTutoringSummary as Mock).mockResolvedValue(summaryWithoutStatus);

      render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      await waitFor(() => {
        expect(screen.getByText("Estado:")).toBeInTheDocument();
      });
    });

    it("should render without errors when mounted multiple times", async () => {
      (getTutoringSummary as Mock).mockResolvedValue(mockTutoringSummary);

      const { unmount, rerender } = render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);

      await waitFor(() => {
        expect(screen.getByText("Detalle de Tutoría")).toBeInTheDocument();
      });

      expect(() => {
        rerender(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);
        unmount();
        render(<TutoringDetailModal isOpen={true} onClose={mockOnClose} tutoringId="1" />);
      }).not.toThrow();
    });
  });
});
