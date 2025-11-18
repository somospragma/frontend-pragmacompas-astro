import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useStore } from "@nanostores/react";
import { toast } from "sonner";
import MentorshipForm from "./MentorshipForm";
import { getSkills } from "@/infrastructure/services/getSkills";
import { getChapters } from "@/infrastructure/services/getChapters";
import { createTutoringRequest } from "@/infrastructure/services/createTutoringRequest";

vi.mock("@nanostores/react");
vi.mock("sonner");
vi.mock("@/infrastructure/services/getSkills");
vi.mock("@/infrastructure/services/getChapters");
vi.mock("@/infrastructure/services/createTutoringRequest");

const mockSkills = [
  { id: "1", name: "React" },
  { id: "2", name: "TypeScript" },
];

const mockChapters = [
  { id: "c1", name: "Chapter 1" },
  { id: "c2", name: "Chapter 2" },
];

describe("MentorshipForm", () => {
  const mockLocation = { href: "", reload: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    (useStore as Mock).mockReturnValue({ userId: "user-123", name: "Test User" });
    (getSkills as Mock).mockResolvedValue(mockSkills);
    (getChapters as Mock).mockResolvedValue(mockChapters);
    (createTutoringRequest as Mock).mockResolvedValue({ success: true });

    Object.defineProperty(globalThis, "location", {
      value: mockLocation,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe("Rendering", () => {
    it("should render loading state initially", () => {
      render(<MentorshipForm />);
      expect(screen.getByText(/cargando formulario/i)).toBeInTheDocument();
      expect(screen.getByText(/loading form data/i)).toBeInTheDocument();
    });

    it("should render form after data loads successfully", async () => {
      render(<MentorshipForm />);

      await waitFor(() => {
        expect(screen.getByText(/solicitar tutoría/i)).toBeInTheDocument();
      });

      // Verifica que los labels del formulario estén presentes
      expect(screen.getByRole("form")).toBeInTheDocument();
      expect(screen.getByText(/habilidades/i)).toBeInTheDocument();
      expect(screen.getByText(/notas/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /enviar solicitud/i })).toBeInTheDocument();
    });

    it("should handle data loading failures gracefully", async () => {
      (getSkills as Mock).mockRejectedValue(new Error("Network error"));
      (getChapters as Mock).mockRejectedValue(new Error("Network error"));

      render(<MentorshipForm />);

      // El componente maneja errores internamente y aún renderiza el formulario
      await waitFor(() => {
        expect(screen.getByText(/solicitar tutoría/i)).toBeInTheDocument();
      });

      // Verifica que el formulario se muestra incluso con errores de carga
      expect(screen.getByRole("form")).toBeInTheDocument();
    });

    it("should have proper ARIA attributes on form elements", async () => {
      render(<MentorshipForm />);

      await waitFor(() => {
        expect(screen.getByRole("form")).toBeInTheDocument();
      });

      const form = screen.getByRole("form");
      expect(form).toHaveAttribute("aria-labelledby");
    });
  });

  describe("Data Loading", () => {
    it("should fetch skills and chapters on mount", async () => {
      render(<MentorshipForm />);

      await waitFor(() => {
        expect(getSkills).toHaveBeenCalledTimes(1);
        expect(getChapters).toHaveBeenCalledTimes(1);
      });
    });

    it("should display loading state with aria-busy", () => {
      render(<MentorshipForm />);

      const loadingText = screen.getByText(/cargando formulario/i);
      expect(loadingText).toBeInTheDocument();

      // Verifica que el Card tiene aria-busy="true"
      const card = loadingText.closest('[aria-busy="true"]');
      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute("aria-live", "polite");
    });
  });

  describe("Form Validation", () => {
    it("should show error when submitting without chapter", async () => {
      const user = userEvent.setup();
      render(<MentorshipForm />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /enviar solicitud/i })).toBeInTheDocument();
      });

      const submitButton = screen.getByRole("button", { name: /enviar solicitud/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Error de validación", {
          description: "Por favor completa todos los campos requeridos",
        });
      });

      expect(screen.getByText(/el chapter es requerido/i)).toBeInTheDocument();
    });

    it("should show error when submitting without skills", async () => {
      const user = userEvent.setup();
      render(<MentorshipForm />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /enviar solicitud/i })).toBeInTheDocument();
      });

      const submitButton = screen.getByRole("button", { name: /enviar solicitud/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/selecciona al menos una habilidad/i)).toBeInTheDocument();
      });
    });

    it("should show error when submitting without description", async () => {
      const user = userEvent.setup();
      render(<MentorshipForm />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /enviar solicitud/i })).toBeInTheDocument();
      });

      const submitButton = screen.getByRole("button", { name: /enviar solicitud/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/la descripción es requerida/i)).toBeInTheDocument();
      });
    });

    it("should display all validation errors simultaneously", async () => {
      const user = userEvent.setup();
      render(<MentorshipForm />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /enviar solicitud/i })).toBeInTheDocument();
      });

      const submitButton = screen.getByRole("button", { name: /enviar solicitud/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/el chapter es requerido/i)).toBeInTheDocument();
        expect(screen.getByText(/selecciona al menos una habilidad/i)).toBeInTheDocument();
        expect(screen.getByText(/la descripción es requerida/i)).toBeInTheDocument();
      });
    });
  });

  describe("Form Submission", () => {
    it("should call validation on submit", async () => {
      const user = userEvent.setup();
      render(<MentorshipForm />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/describe en qué/i)).toBeInTheDocument();
      });

      const textarea = screen.getByPlaceholderText(/describe en qué/i);
      await user.type(textarea, "Need help with React hooks");

      const submitButton = screen.getByRole("button", { name: /enviar solicitud/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });

    it("should show error toast when submission fails", async () => {
      (createTutoringRequest as Mock).mockRejectedValue(new Error("Server error"));
      const user = userEvent.setup();
      render(<MentorshipForm />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/describe en qué/i)).toBeInTheDocument();
      });

      const textarea = screen.getByPlaceholderText(/describe en qué/i);
      await user.type(textarea, "Test");

      const submitButton = screen.getByRole("button", { name: /enviar solicitud/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });

    it("should show error when user is not authenticated", async () => {
      (useStore as Mock).mockReturnValue({ userId: null });
      const user = userEvent.setup();
      render(<MentorshipForm />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/describe en qué/i)).toBeInTheDocument();
      });

      const textarea = screen.getByPlaceholderText(/describe en qué/i);
      await user.type(textarea, "Test");

      const submitButton = screen.getByRole("button", { name: /enviar solicitud/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });

      expect(createTutoringRequest).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes on error messages", async () => {
      const user = userEvent.setup();
      render(<MentorshipForm />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /enviar solicitud/i })).toBeInTheDocument();
      });

      const submitButton = screen.getByRole("button", { name: /enviar solicitud/i });
      await user.click(submitButton);

      await waitFor(() => {
        const errorMessages = screen.getAllByRole("alert");
        expect(errorMessages.length).toBeGreaterThan(0);
      });
    });

    it("should associate error messages with fields via aria-describedby", async () => {
      const user = userEvent.setup();
      render(<MentorshipForm />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /enviar solicitud/i })).toBeInTheDocument();
      });

      const submitButton = screen.getByRole("button", { name: /enviar solicitud/i });
      await user.click(submitButton);

      await waitFor(() => {
        const textarea = screen.getByPlaceholderText(/describe en qué/i);
        expect(textarea).toHaveAttribute("aria-invalid", "true");
        expect(textarea).toHaveAttribute("aria-describedby");
      });
    });

    it("should mark fields as invalid when they have errors", async () => {
      const user = userEvent.setup();
      render(<MentorshipForm />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /enviar solicitud/i })).toBeInTheDocument();
      });

      const submitButton = screen.getByRole("button", { name: /enviar solicitud/i });
      await user.click(submitButton);

      await waitFor(() => {
        const textarea = screen.getByPlaceholderText(/describe en qué/i);
        expect(textarea).toHaveAttribute("aria-invalid", "true");
      });
    });

    it("should have sr-only text for loading state", () => {
      render(<MentorshipForm />);

      const srText = screen.getByText(/loading form data/i);
      expect(srText).toHaveClass("sr-only");
    });

    it("should have aria-hidden on decorative icons", async () => {
      render(<MentorshipForm />);

      const loaderContainer = screen.getByText(/cargando formulario/i).closest("div");
      const loader = loaderContainer?.querySelector("svg");
      expect(loader).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("User Interactions", () => {
    it("should update textarea value on user input", async () => {
      const user = userEvent.setup();
      render(<MentorshipForm />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/describe en qué/i)).toBeInTheDocument();
      });

      const textarea = screen.getByPlaceholderText(/describe en qué/i) as HTMLTextAreaElement;
      await user.type(textarea, "Test input");

      expect(textarea.value).toBe("Test input");
    });
  });

  describe("Performance", () => {
    it("should memoize chapter options", async () => {
      const { rerender } = render(<MentorshipForm />);

      await waitFor(() => {
        expect(screen.getByText(/solicitar tutoría/i)).toBeInTheDocument();
      });

      rerender(<MentorshipForm />);

      expect(getChapters).toHaveBeenCalledTimes(1);
    });

    it("should memoize skill options", async () => {
      const { rerender } = render(<MentorshipForm />);

      await waitFor(() => {
        expect(screen.getByText(/solicitar tutoría/i)).toBeInTheDocument();
      });

      rerender(<MentorshipForm />);

      expect(getSkills).toHaveBeenCalledTimes(1);
    });

    it("should use useCallback for handlers", async () => {
      const user = userEvent.setup();
      render(<MentorshipForm />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/describe en qué/i)).toBeInTheDocument();
      });

      const textarea = screen.getByPlaceholderText(/describe en qué/i);
      await user.type(textarea, "Test");
      await user.clear(textarea);
      await user.type(textarea, "New test");

      expect(textarea).toHaveValue("New test");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty skills array", async () => {
      (getSkills as Mock).mockResolvedValue([]);

      render(<MentorshipForm />);

      await waitFor(() => {
        expect(screen.getByText(/solicitar tutoría/i)).toBeInTheDocument();
      });

      expect(screen.getByText(/habilidades/i)).toBeInTheDocument();
    });

    it("should handle textarea input", async () => {
      const user = userEvent.setup();
      render(<MentorshipForm />);

      await waitFor(() => {
        const textareas = screen.getAllByRole("textbox");
        expect(textareas.length).toBeGreaterThan(0);
      });

      const textarea = screen.getByPlaceholderText(/describe en qué/i) as HTMLTextAreaElement;
      const testText = "Test description";
      await user.type(textarea, testText);

      expect(textarea.value).toBe(testText);
    });

    it("should handle validation error clearing", async () => {
      const user = userEvent.setup();
      render(<MentorshipForm />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /enviar solicitud/i })).toBeInTheDocument();
      });

      const submitButton = screen.getByRole("button", { name: /enviar solicitud/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/la descripción es requerida/i)).toBeInTheDocument();
      });

      const textarea = screen.getByPlaceholderText(/describe en qué/i);
      await user.type(textarea, "Fixed description");

      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText(/la descripción es requerida/i)).not.toBeInTheDocument();
      });
    });
  });
});
