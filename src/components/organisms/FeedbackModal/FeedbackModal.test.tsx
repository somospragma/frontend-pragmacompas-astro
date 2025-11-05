import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FeedbackModal from "./FeedbackModal";
import { toast } from "sonner";
import { getTutoringSummary } from "@/infrastructure/services/getTutoringSummary";

// Mock dependencies
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock("@/shared/utils/logger", () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock("@/infrastructure/services/getTutoringSummary");

vi.mock("@/shared/hooks/useAccessibilityAnnouncer", () => ({
  useAccessibilityAnnouncer: () => ({
    announce: vi.fn(),
    message: "",
  }),
}));

interface MockTutoringSummary {
  id: string;
  status: string;
  feedbacks: Array<{ evaluator: { id: string } }>;
}

describe("FeedbackModal", () => {
  const mockOnClose = vi.fn();
  const mockOnSubmitFeedback = vi.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    mentorship: {
      participant: "Juan Pérez",
      participantRole: "Developer",
      myRole: "tutee",
      skills: ["React", "TypeScript"],
      email: "juan@example.com",
      tutorId: "tutor-123",
      tutoringId: "tutoring-456",
    },
    currentUserId: "user-789",
    userAlreadyGaveFeedback: false,
    onSubmitFeedback: mockOnSubmitFeedback,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    const mockResponse: MockTutoringSummary = {
      id: "tutoring-456",
      status: "En progreso",
      feedbacks: [],
    };
    vi.mocked(getTutoringSummary).mockResolvedValue(
      mockResponse as unknown as Awaited<ReturnType<typeof getTutoringSummary>>
    );
  });

  describe("Rendering", () => {
    it("should render modal when isOpen is true", () => {
      render(<FeedbackModal {...defaultProps} />);

      expect(screen.getByText("Evaluación de Tutoría")).toBeInTheDocument();
      expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
      expect(screen.getByText("Developer")).toBeInTheDocument();
      expect(screen.getByText("juan@example.com")).toBeInTheDocument();
    });

    it("should render skills badges", () => {
      render(<FeedbackModal {...defaultProps} />);

      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
    });

    it("should render user initials avatar", () => {
      render(<FeedbackModal {...defaultProps} />);

      const avatar = screen.getByText("JP");
      expect(avatar).toBeInTheDocument();
    });

    it("should render star rating section for new feedback", () => {
      render(<FeedbackModal {...defaultProps} />);

      expect(screen.getByText("Puntuación (1-5):")).toBeInTheDocument();
      const radiogroup = screen.getByRole("radiogroup");
      expect(radiogroup).toBeInTheDocument();
    });

    it("should render comment textarea for new feedback", () => {
      render(<FeedbackModal {...defaultProps} />);

      expect(screen.getByText("Comentario:")).toBeInTheDocument();
      const textarea = screen.getByPlaceholderText("Comparte tu experiencia con esta tutoría...");
      expect(textarea).toBeInTheDocument();
    });

    it("should show 'Completar Mentoría' title when user already gave feedback and is tutor", () => {
      const props = {
        ...defaultProps,
        userAlreadyGaveFeedback: true,
        currentUserId: "tutor-123",
      };

      render(<FeedbackModal {...props} />);

      expect(screen.getByText("Completar Mentoría")).toBeInTheDocument();
    });
  });

  describe("Star Rating", () => {
    it("should render 5 star buttons", () => {
      render(<FeedbackModal {...defaultProps} />);

      const starButtons = screen.getAllByRole("radio");
      expect(starButtons).toHaveLength(5);
    });

    it("should have correct aria-labels for stars", () => {
      render(<FeedbackModal {...defaultProps} />);

      expect(screen.getByLabelText("1 estrella")).toBeInTheDocument();
      expect(screen.getByLabelText("2 estrellas")).toBeInTheDocument();
      expect(screen.getByLabelText("3 estrellas")).toBeInTheDocument();
      expect(screen.getByLabelText("4 estrellas")).toBeInTheDocument();
      expect(screen.getByLabelText("5 estrellas")).toBeInTheDocument();
    });

    it("should select star on click", async () => {
      render(<FeedbackModal {...defaultProps} />);

      const star3 = screen.getByLabelText("3 estrellas");
      await userEvent.click(star3);

      expect(star3).toHaveAttribute("aria-checked", "true");
    });

    it("should deselect star on second click", async () => {
      render(<FeedbackModal {...defaultProps} />);

      const star3 = screen.getByLabelText("3 estrellas");
      await userEvent.click(star3);
      expect(star3).toHaveAttribute("aria-checked", "true");

      await userEvent.click(star3);
      expect(star3).toHaveAttribute("aria-checked", "false");
    });

    it("should change selection when clicking different star", async () => {
      render(<FeedbackModal {...defaultProps} />);

      const star3 = screen.getByLabelText("3 estrellas");
      const star5 = screen.getByLabelText("5 estrellas");

      await userEvent.click(star3);
      expect(star3).toHaveAttribute("aria-checked", "true");

      await userEvent.click(star5);
      expect(star5).toHaveAttribute("aria-checked", "true");
      expect(star3).toHaveAttribute("aria-checked", "false");
    });
  });

  describe("Form Validation", () => {
    it("should disable submit button when no score selected", () => {
      render(<FeedbackModal {...defaultProps} />);

      const submitButton = screen.getByText("Enviar");
      expect(submitButton).toBeDisabled();
    });

    it("should disable submit button when no comment provided", async () => {
      render(<FeedbackModal {...defaultProps} />);

      const star5 = screen.getByLabelText("5 estrellas");
      await userEvent.click(star5);

      const submitButton = screen.getByText("Enviar");
      expect(submitButton).toBeDisabled();
    });

    it("should enable submit button when score and comment provided", async () => {
      render(<FeedbackModal {...defaultProps} />);

      const star5 = screen.getByLabelText("5 estrellas");
      await userEvent.click(star5);

      const textarea = screen.getByPlaceholderText("Comparte tu experiencia con esta tutoría...");
      await userEvent.type(textarea, "Excelente tutoría");

      const submitButton = screen.getByText("Enviar");
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe("Form Submission", () => {
    it("should call onSubmitFeedback with correct parameters", async () => {
      mockOnSubmitFeedback.mockResolvedValue(undefined);
      render(<FeedbackModal {...defaultProps} />);

      const star5 = screen.getByLabelText("5 estrellas");
      await userEvent.click(star5);

      const textarea = screen.getByPlaceholderText("Comparte tu experiencia con esta tutoría...");
      await userEvent.type(textarea, "Excelente tutoría");

      const submitButton = screen.getByText("Enviar");
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmitFeedback).toHaveBeenCalledWith(5, "Excelente tutoría", undefined);
      });
    });

    it("should show success toast after successful submission", async () => {
      mockOnSubmitFeedback.mockResolvedValue(undefined);
      render(<FeedbackModal {...defaultProps} />);

      const star5 = screen.getByLabelText("5 estrellas");
      await userEvent.click(star5);

      const textarea = screen.getByPlaceholderText("Comparte tu experiencia con esta tutoría...");
      await userEvent.type(textarea, "Excelente tutoría");

      const submitButton = screen.getByText("Enviar");
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("Feedback enviado", expect.any(Object));
      });
    });

    it("should reset form after successful submission", async () => {
      mockOnSubmitFeedback.mockResolvedValue(undefined);
      render(<FeedbackModal {...defaultProps} />);

      const star5 = screen.getByLabelText("5 estrellas");
      await userEvent.click(star5);

      const textarea = screen.getByPlaceholderText("Comparte tu experiencia con esta tutoría...");
      await userEvent.type(textarea, "Excelente tutoría");

      const submitButton = screen.getByText("Enviar");
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(star5).toHaveAttribute("aria-checked", "false");
        expect(textarea).toHaveValue("");
      });
    });

    it("should show error toast on submission failure", async () => {
      mockOnSubmitFeedback.mockRejectedValue(new Error("Network error"));
      render(<FeedbackModal {...defaultProps} />);

      const star5 = screen.getByLabelText("5 estrellas");
      await userEvent.click(star5);

      const textarea = screen.getByPlaceholderText("Comparte tu experiencia con esta tutoría...");
      await userEvent.type(textarea, "Excelente tutoría");

      const submitButton = screen.getByText("Enviar");
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Error al procesar el feedback", expect.any(Object));
      });
    });

    it("should disable submit button while submitting", async () => {
      mockOnSubmitFeedback.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
      render(<FeedbackModal {...defaultProps} />);

      const star5 = screen.getByLabelText("5 estrellas");
      await userEvent.click(star5);

      const textarea = screen.getByPlaceholderText("Comparte tu experiencia con esta tutoría...");
      await userEvent.type(textarea, "Excelente tutoría");

      const submitButton = screen.getByText("Enviar");
      await userEvent.click(submitButton);

      expect(screen.getByText("Enviando...")).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  describe("Tutor Functionality", () => {
    it("should show document URL field for tutor", async () => {
      const props = {
        ...defaultProps,
        currentUserId: "tutor-123",
      };

      render(<FeedbackModal {...props} />);

      await waitFor(() => {
        expect(screen.getByText("Acta de finalización")).toBeInTheDocument();
      });
    });

    it("should check for tutee feedback when tutor opens modal", async () => {
      const props = {
        ...defaultProps,
        currentUserId: "tutor-123",
      };

      render(<FeedbackModal {...props} />);

      await waitFor(() => {
        expect(getTutoringSummary).toHaveBeenCalledWith("tutoring-456");
      });
    });

    it("should render URL input for tutor", async () => {
      const props = {
        ...defaultProps,
        currentUserId: "tutor-123",
      };

      render(<FeedbackModal {...props} />);

      await waitFor(() => {
        const urlInput = screen.getByPlaceholderText("https://ejemplo.com/acta.pdf");
        expect(urlInput).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have AccessibilityAnnouncer component", () => {
      render(<FeedbackModal {...defaultProps} />);

      const announcer = screen.getByRole("status");
      expect(announcer).toBeInTheDocument();
    });

    it("should have proper ARIA labels on star buttons", () => {
      render(<FeedbackModal {...defaultProps} />);

      const radiogroup = screen.getByRole("radiogroup");
      expect(radiogroup).toHaveAttribute("aria-label", "Puntuación de la tutoría");
    });

    it("should have keyboard focus styling on star buttons", () => {
      render(<FeedbackModal {...defaultProps} />);

      const starButtons = screen.getAllByRole("radio");
      starButtons.forEach((button) => {
        expect(button).toHaveClass("focus:outline-none", "focus:ring-2", "focus:ring-primary");
      });
    });

    it("should have aria-describedby on URL input", async () => {
      const props = {
        ...defaultProps,
        currentUserId: "tutor-123",
      };

      render(<FeedbackModal {...props} />);

      await waitFor(() => {
        const urlInput = screen.getByPlaceholderText("https://ejemplo.com/acta.pdf");
        expect(urlInput).toHaveAttribute("aria-describedby", "documentUrl-status");
      });
    });
  });

  describe("Modal Controls", () => {
    it("should call onClose when cancel button is clicked", async () => {
      render(<FeedbackModal {...defaultProps} />);

      const cancelButton = screen.getByText("Cancelar");
      await userEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it("should not render when isOpen is false", () => {
      const props = {
        ...defaultProps,
        isOpen: false,
      };

      render(<FeedbackModal {...props} />);

      // Dialog should not be visible
      expect(screen.queryByText("Evaluación de Tutoría")).not.toBeInTheDocument();
    });
  });
});
