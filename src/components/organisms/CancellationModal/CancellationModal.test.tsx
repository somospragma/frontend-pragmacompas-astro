import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CancellationModal from "./CancellationModal";
import { MentorshipType } from "@/shared/utils/enums/mentorshipType";
import { toast } from "sonner";
import { logger } from "@/shared/utils/logger";
import * as sanitizeUtils from "@/shared/utils/sanitize";

// Mock dependencies
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("@/shared/utils/logger", () => ({
  logger: {
    error: vi.fn(),
  },
}));

vi.mock("@/shared/utils/sanitize", () => ({
  sanitizeInput: vi.fn((input: string) => input),
}));

vi.mock("@/shared/hooks/useAccessibilityAnnouncer", () => ({
  useAccessibilityAnnouncer: () => ({
    announce: vi.fn(),
    message: "",
  }),
}));

vi.mock("@/components/atoms/AccessibilityAnnouncer", () => ({
  AccessibilityAnnouncer: ({ message }: { message: string }) => (
    <div data-testid="accessibility-announcer">{message}</div>
  ),
}));

describe("CancellationModal", () => {
  const mockOnClose = vi.fn();
  const mockOnSubmitCancellation = vi.fn();

  const defaultProps = {
    type: MentorshipType.REQUEST,
    isOpen: true,
    onClose: mockOnClose,
    onSubmitCancellation: mockOnSubmitCancellation,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSubmitCancellation.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render modal when isOpen is true", () => {
      render(<CancellationModal {...defaultProps} />);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Cancelar solicitud")).toBeInTheDocument();
    });

    it("should not render modal when isOpen is false", () => {
      render(<CancellationModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("should render correct title for REQUEST type", () => {
      render(<CancellationModal {...defaultProps} type={MentorshipType.REQUEST} />);

      expect(screen.getByText("Cancelar solicitud")).toBeInTheDocument();
    });

    it("should render correct title for MENTORING type", () => {
      render(<CancellationModal {...defaultProps} type={MentorshipType.MENTORSHIP} />);

      expect(screen.getByText("Cancelar tutoría")).toBeInTheDocument();
    });

    it("should render warning message", () => {
      render(<CancellationModal {...defaultProps} />);

      expect(screen.getByText("Esta acción no se puede deshacer")).toBeInTheDocument();
    });

    it("should render required field indicator", () => {
      render(<CancellationModal {...defaultProps} />);

      const requiredIndicator = screen.getByLabelText("campo requerido");
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator).toHaveTextContent("*");
    });

    it("should render textarea with placeholder", () => {
      render(<CancellationModal {...defaultProps} />);

      const textarea = screen.getByPlaceholderText("Por favor, explica el motivo de la cancelación...");
      expect(textarea).toBeInTheDocument();
    });

    it("should render character counter", () => {
      render(<CancellationModal {...defaultProps} />);

      expect(screen.getByText("0/500 caracteres")).toBeInTheDocument();
    });

    it("should render Mantener button", () => {
      render(<CancellationModal {...defaultProps} />);

      expect(screen.getByRole("button", { name: /mantener/i })).toBeInTheDocument();
    });

    it("should render Confirmar button", () => {
      render(<CancellationModal {...defaultProps} />);

      expect(screen.getByRole("button", { name: /confirmar/i })).toBeInTheDocument();
    });

    it("should render Confirmar button disabled by default", () => {
      render(<CancellationModal {...defaultProps} />);

      const confirmButton = screen.getByRole("button", { name: /confirmar cancelación/i });
      expect(confirmButton).toBeDisabled();
    });
  });

  describe("Textarea Interaction", () => {
    it("should update textarea value when typing", async () => {
      const user = userEvent.setup();
      render(<CancellationModal {...defaultProps} />);

      const textarea = screen.getByRole("textbox", { name: /razón de cancelación/i });
      await user.type(textarea, "Valid reason for cancellation");

      expect(textarea).toHaveValue("Valid reason for cancellation");
    });

    it("should update character counter when typing", async () => {
      const user = userEvent.setup();
      render(<CancellationModal {...defaultProps} />);

      const textarea = screen.getByRole("textbox", { name: /razón de cancelación/i });
      await user.type(textarea, "Test reason");

      expect(screen.getByText("11/500 caracteres")).toBeInTheDocument();
    });

    it("should enable Confirmar button when textarea has valid content", async () => {
      const user = userEvent.setup();
      render(<CancellationModal {...defaultProps} />);

      const textarea = screen.getByRole("textbox", { name: /razón de cancelación/i });
      const confirmButton = screen.getByRole("button", { name: /confirmar cancelación/i });

      expect(confirmButton).toBeDisabled();

      await user.type(textarea, "Valid cancellation reason");

      expect(confirmButton).toBeEnabled();
    });

    it("should respect maxLength of 500 characters", () => {
      render(<CancellationModal {...defaultProps} />);

      const textarea = screen.getByRole("textbox", { name: /razón de cancelación/i });
      expect(textarea).toHaveAttribute("maxLength", "500");
    });
  });

  describe("Validation", () => {
    it("should show error when submitting empty reason", async () => {
      const user = userEvent.setup();
      render(<CancellationModal {...defaultProps} />);

      const textarea = screen.getByRole("textbox", { name: /razón de cancelación/i });
      await user.type(textarea, " ");
      await user.clear(textarea);

      // Force button to be enabled by typing and clearing
      await user.type(textarea, "a");
      const confirmButton = screen.getByRole("button", { name: /confirmar cancelación/i });
      await user.clear(textarea);

      // Button should be disabled again
      expect(confirmButton).toBeDisabled();
    });

    it("should show error when reason is too short (less than 10 characters)", async () => {
      const user = userEvent.setup();
      render(<CancellationModal {...defaultProps} />);

      const textarea = screen.getByRole("textbox", { name: /razón de cancelación/i });
      await user.type(textarea, "Short");

      const confirmButton = screen.getByRole("button", { name: /confirmar cancelación/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Razón muy corta", {
          description: "La razón debe tener al menos 10 caracteres.",
        });
      });

      expect(mockOnSubmitCancellation).not.toHaveBeenCalled();
    });

    it("should call sanitizeInput on validation", async () => {
      const user = userEvent.setup();
      const sanitizeSpy = vi.spyOn(sanitizeUtils, "sanitizeInput");
      render(<CancellationModal {...defaultProps} />);

      const textarea = screen.getByRole("textbox", { name: /razón de cancelación/i });
      const validReason = "This is a valid cancellation reason";
      await user.type(textarea, validReason);

      const confirmButton = screen.getByRole("button", { name: /confirmar cancelación/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(sanitizeSpy).toHaveBeenCalledWith(validReason);
      });
    });
  });

  describe("Form Submission", () => {
    it("should call onSubmitCancellation with sanitized reason on valid submission", async () => {
      const user = userEvent.setup();
      render(<CancellationModal {...defaultProps} />);

      const textarea = screen.getByRole("textbox", { name: /razón de cancelación/i });
      const validReason = "This is a valid cancellation reason";
      await user.type(textarea, validReason);

      const confirmButton = screen.getByRole("button", { name: /confirmar cancelación/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(mockOnSubmitCancellation).toHaveBeenCalledWith(validReason);
      });
    });

    it("should call onClose after successful submission", async () => {
      const user = userEvent.setup();
      render(<CancellationModal {...defaultProps} />);

      const textarea = screen.getByRole("textbox", { name: /razón de cancelación/i });
      await user.type(textarea, "Valid cancellation reason");

      const confirmButton = screen.getByRole("button", { name: /confirmar cancelación/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it("should clear textarea after successful submission", async () => {
      const user = userEvent.setup();
      render(<CancellationModal {...defaultProps} />);

      const textarea = screen.getByRole("textbox", { name: /razón de cancelación/i });
      await user.type(textarea, "Valid cancellation reason");

      const confirmButton = screen.getByRole("button", { name: /confirmar cancelación/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(textarea).toHaveValue("");
      });
    });

    it("should disable buttons during submission", async () => {
      const user = userEvent.setup();
      mockOnSubmitCancellation.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
      render(<CancellationModal {...defaultProps} />);

      const textarea = screen.getByRole("textbox", { name: /razón de cancelación/i });
      await user.type(textarea, "Valid cancellation reason");

      const confirmButton = screen.getByRole("button", { name: /confirmar cancelación/i });
      const mantenerButton = screen.getByRole("button", { name: /mantener/i });

      await user.click(confirmButton);

      expect(confirmButton).toBeDisabled();
      expect(mantenerButton).toBeDisabled();
    });

    it("should show loading text on Confirmar button during submission", async () => {
      const user = userEvent.setup();
      mockOnSubmitCancellation.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
      render(<CancellationModal {...defaultProps} />);

      const textarea = screen.getByRole("textbox", { name: /razón de cancelación/i });
      await user.type(textarea, "Valid cancellation reason");

      const confirmButton = screen.getByRole("button", { name: /confirmar cancelación/i });
      await user.click(confirmButton);

      expect(screen.getByText("Cancelando...")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should show error toast when submission fails", async () => {
      const user = userEvent.setup();
      const error = new Error("Network error");
      mockOnSubmitCancellation.mockRejectedValue(error);
      render(<CancellationModal {...defaultProps} />);

      const textarea = screen.getByRole("textbox", { name: /razón de cancelación/i });
      await user.type(textarea, "Valid cancellation reason");

      const confirmButton = screen.getByRole("button", { name: /confirmar cancelación/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Error al procesar la cancelación", {
          description: expect.any(String),
        });
      });
    });

    it("should log error when submission fails", async () => {
      const user = userEvent.setup();
      const error = new Error("Network error");
      mockOnSubmitCancellation.mockRejectedValue(error);
      render(<CancellationModal {...defaultProps} />);

      const textarea = screen.getByRole("textbox", { name: /razón de cancelación/i });
      const validReason = "Valid cancellation reason";
      await user.type(textarea, validReason);

      const confirmButton = screen.getByRole("button", { name: /confirmar cancelación/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(logger.error).toHaveBeenCalledWith("Error submitting cancellation", error, {
          type: MentorshipType.REQUEST,
          reasonLength: validReason.length,
        });
      });
    });

    it("should not call onClose when submission fails", async () => {
      const user = userEvent.setup();
      mockOnSubmitCancellation.mockRejectedValue(new Error("Network error"));
      render(<CancellationModal {...defaultProps} />);

      const textarea = screen.getByRole("textbox", { name: /razón de cancelación/i });
      await user.type(textarea, "Valid cancellation reason");

      const confirmButton = screen.getByRole("button", { name: /confirmar cancelación/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it("should re-enable buttons after submission error", async () => {
      const user = userEvent.setup();
      mockOnSubmitCancellation.mockRejectedValue(new Error("Network error"));
      render(<CancellationModal {...defaultProps} />);

      const textarea = screen.getByRole("textbox", { name: /razón de cancelación/i });
      await user.type(textarea, "Valid cancellation reason");

      const confirmButton = screen.getByRole("button", { name: /confirmar cancelación/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(confirmButton).toBeEnabled();
      });
    });
  });

  describe("Modal Close", () => {
    it("should call onClose when Mantener button is clicked", async () => {
      const user = userEvent.setup();
      render(<CancellationModal {...defaultProps} />);

      const mantenerButton = screen.getByRole("button", { name: /mantener/i });
      await user.click(mantenerButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it("should clear textarea when closing modal", async () => {
      const user = userEvent.setup();
      render(<CancellationModal {...defaultProps} />);

      const textarea = screen.getByRole("textbox", { name: /razón de cancelación/i });
      await user.type(textarea, "Some reason");

      const mantenerButton = screen.getByRole("button", { name: /mantener/i });
      await user.click(mantenerButton);

      await waitFor(() => {
        expect(textarea).toHaveValue("");
      });
    });

    it("should not call onClose when submitting", async () => {
      const user = userEvent.setup();
      mockOnSubmitCancellation.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
      render(<CancellationModal {...defaultProps} />);

      const textarea = screen.getByRole("textbox", { name: /razón de cancelación/i });
      await user.type(textarea, "Valid cancellation reason");

      const confirmButton = screen.getByRole("button", { name: /confirmar cancelación/i });
      await user.click(confirmButton);

      // Try to close while submitting
      const mantenerButton = screen.getByRole("button", { name: /mantener/i });
      await user.click(mantenerButton);

      // onClose should not be called during submission
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels on textarea", () => {
      render(<CancellationModal {...defaultProps} />);

      const textarea = screen.getByRole("textbox", { name: /razón de cancelación/i });
      expect(textarea).toHaveAttribute("aria-label", "Razón de cancelación");
      expect(textarea).toHaveAttribute("aria-required", "true");
      expect(textarea).toHaveAttribute("aria-describedby", "char-count");
    });

    it("should have aria-live on character counter", () => {
      render(<CancellationModal {...defaultProps} />);

      const charCounter = screen.getByText("0/500 caracteres");
      expect(charCounter).toHaveAttribute("aria-live", "polite");
      expect(charCounter).toHaveAttribute("id", "char-count");
    });

    it("should have proper ARIA labels on buttons", () => {
      render(<CancellationModal {...defaultProps} />);

      const mantenerButton = screen.getByRole("button", { name: /mantener/i });
      expect(mantenerButton).toHaveAttribute("aria-label", "Mantener y cerrar modal");

      const confirmarButton = screen.getByRole("button", { name: /confirmar cancelación/i });
      expect(confirmarButton).toHaveAttribute("aria-label", "Confirmar cancelación");
    });

    it("should have semantic HTML with section role", () => {
      render(<CancellationModal {...defaultProps} />);

      const formSection = screen.getByRole("form", { name: /formulario de cancelación/i });
      expect(formSection).toBeInTheDocument();
    });

    it("should have aria-describedby on DialogContent", () => {
      render(<CancellationModal {...defaultProps} />);

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-describedby", "dialog-description");
    });

    it("should render AccessibilityAnnouncer component", () => {
      render(<CancellationModal {...defaultProps} />);

      expect(screen.getByTestId("accessibility-announcer")).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should memoize cancelTitle based on type", () => {
      const { rerender } = render(<CancellationModal {...defaultProps} type={MentorshipType.REQUEST} />);

      expect(screen.getByText("Cancelar solicitud")).toBeInTheDocument();

      rerender(<CancellationModal {...defaultProps} type={MentorshipType.MENTORSHIP} />);

      expect(screen.getByText("Cancelar tutoría")).toBeInTheDocument();
    });

    it("should memoize isDisabled state", async () => {
      const user = userEvent.setup();
      render(<CancellationModal {...defaultProps} />);

      const confirmButton = screen.getByRole("button", { name: /confirmar cancelación/i });
      expect(confirmButton).toBeDisabled();

      const textarea = screen.getByRole("textbox", { name: /razón de cancelación/i });
      await user.type(textarea, "Valid reason");

      expect(confirmButton).toBeEnabled();
    });
  });
});
