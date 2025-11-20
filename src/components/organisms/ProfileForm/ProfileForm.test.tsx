import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useStore } from "@nanostores/react";
import { ProfileForm } from "./ProfileForm";
import { getChapters } from "@/infrastructure/services/getChapters";
import { postCreateUser } from "@/infrastructure/services/postCreateUser";
import { updateUser } from "@/infrastructure/services/updateUser";
import { updateUserProfile } from "@/store/userStore";
import { toast } from "sonner";

vi.mock("@nanostores/react");
vi.mock("@/infrastructure/services/getChapters");
vi.mock("@/infrastructure/services/postCreateUser");
vi.mock("@/infrastructure/services/updateUser");
vi.mock("@/store/userStore", async () => {
  const actual = await vi.importActual("@/store/userStore");
  return {
    ...actual,
    updateUserProfile: vi.fn(),
  };
});
vi.mock("sonner");

const mockChapters = [
  { id: "chapter-1", name: "Backend" },
  { id: "chapter-2", name: "Frontend" },
];

const mockUser = {
  id: "user-123",
  userId: "user-123",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  googleId: "google-123",
  chapterId: "chapter-1",
  seniority: "5",
  isLoggedIn: true,
};

describe("ProfileForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getChapters as Mock).mockResolvedValue(mockChapters);
    (toast.success as Mock).mockImplementation(() => {});
    (toast.error as Mock).mockImplementation(() => {});
    (toast.warning as Mock).mockImplementation(() => {});
  });

  describe("Rendering", () => {
    it("should render user profile with avatar and email", () => {
      (useStore as Mock).mockReturnValue(mockUser);

      render(<ProfileForm />);

      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });

    it("should render with default values when user data is missing", () => {
      (useStore as Mock).mockReturnValue({
        id: "user-123",
        userId: "",
        firstName: null,
        email: null,
        chapterId: null,
        seniority: null,
      });

      render(<ProfileForm />);

      expect(screen.getByText("Usuario")).toBeInTheDocument();
      expect(screen.getByText("email@ejemplo.com")).toBeInTheDocument();
    });

    it("should display chapter and seniority labels", async () => {
      (useStore as Mock).mockReturnValue(mockUser);

      render(<ProfileForm />);

      await waitFor(() => {
        expect(screen.getByText("Chapter")).toBeInTheDocument();
        expect(screen.getByText("Seniority")).toBeInTheDocument();
      });
    });

    it("should show loading skeleton while fetching chapters", () => {
      (useStore as Mock).mockReturnValue(mockUser);

      render(<ProfileForm />);

      const skeleton = document.querySelector(".animate-pulse");
      expect(skeleton).toBeInTheDocument();
    });

    it("should display selected chapter name after loading", async () => {
      (useStore as Mock).mockReturnValue(mockUser);

      render(<ProfileForm />);

      await waitFor(() => {
        expect(screen.getByText("Backend")).toBeInTheDocument();
      });
    });

    it("should display selected seniority label", async () => {
      (useStore as Mock).mockReturnValue(mockUser);

      render(<ProfileForm />);

      await waitFor(() => {
        expect(screen.getByText("Junior L2")).toBeInTheDocument();
      });
    });
  });

  describe("Initial Validation", () => {
    it("should show validation errors for missing fields on initial load", async () => {
      (useStore as Mock).mockReturnValue({
        id: "user-123",
        userId: "user-123",
        chapterId: null,
        seniority: null,
      });

      render(<ProfileForm />);

      await waitFor(() => {
        expect(screen.getByText("El chapter es requerido")).toBeInTheDocument();
        expect(screen.getByText("La seniority es requerida")).toBeInTheDocument();
      });
    });

    it("should not show validation errors when fields are complete", async () => {
      (useStore as Mock).mockReturnValue(mockUser);

      render(<ProfileForm />);

      await waitFor(() => {
        expect(screen.queryByText("El chapter es requerido")).not.toBeInTheDocument();
        expect(screen.queryByText("La seniority es requerida")).not.toBeInTheDocument();
      });
    });
  });

  describe("Chapter Loading", () => {
    it("should load chapters on mount", async () => {
      (useStore as Mock).mockReturnValue(mockUser);

      render(<ProfileForm />);

      await waitFor(() => {
        expect(getChapters).toHaveBeenCalledTimes(1);
      });
    });

    it("should handle chapter loading error", async () => {
      (useStore as Mock).mockReturnValue(mockUser);
      (getChapters as Mock).mockRejectedValue(new Error("Network error"));

      render(<ProfileForm />);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Error al cargar chapters", {
          description: "No se pudieron cargar los chapters. Recarga la página.",
        });
      });
    });

    it("should display fallback text when chapter not found", async () => {
      (useStore as Mock).mockReturnValue({
        ...mockUser,
        chapterId: "non-existent",
      });

      render(<ProfileForm />);

      await waitFor(() => {
        expect(screen.getByText("Sin información disponible")).toBeInTheDocument();
      });
    });
  });

  describe("Form Submission - Create User", () => {
    it("should call postCreateUser when userId is empty", async () => {
      (useStore as Mock).mockReturnValue({
        ...mockUser,
        userId: "",
      });
      (postCreateUser as Mock).mockResolvedValue({});

      render(<ProfileForm />);

      const form = document.querySelector("form");
      form?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

      await waitFor(() => {
        expect(postCreateUser).toHaveBeenCalledWith({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          googleUserId: "google-123",
          chapterId: "chapter-1",
          seniority: "5",
          rol: "Tutorado",
        });
      });
    });

    it("should show success toast after creating user", async () => {
      (useStore as Mock).mockReturnValue({
        ...mockUser,
        userId: "",
      });
      (postCreateUser as Mock).mockResolvedValue({});

      render(<ProfileForm />);

      const form = document.querySelector("form");
      form?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("¡Usuario creado exitosamente!", {
          description: "Tu perfil ha sido creado correctamente.",
          duration: 4000,
        });
      });
    });

    it("should handle create user error", async () => {
      (useStore as Mock).mockReturnValue({
        ...mockUser,
        userId: "",
      });
      (postCreateUser as Mock).mockRejectedValue(new Error("API error"));

      render(<ProfileForm />);

      const form = document.querySelector("form");
      form?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Error al actualizar perfil", {
          description: "Algo salió mal, por favor intenta de nuevo más tarde.",
          duration: 4000,
        });
      });
    });
  });

  describe("Form Submission - Update User", () => {
    it("should call updateUser when userId exists", async () => {
      (useStore as Mock).mockReturnValue(mockUser);
      (updateUser as Mock).mockResolvedValue({});

      render(<ProfileForm />);

      const form = document.querySelector("form");
      form?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

      await waitFor(() => {
        expect(updateUser).toHaveBeenCalledWith({
          id: "user-123",
          chapterId: "chapter-1",
          seniority: "5",
        });
      });
    });

    it("should update user profile store after successful update", async () => {
      (useStore as Mock).mockReturnValue(mockUser);
      (updateUser as Mock).mockResolvedValue({});

      render(<ProfileForm />);

      const form = document.querySelector("form");
      form?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

      await waitFor(() => {
        expect(updateUserProfile).toHaveBeenCalledWith({
          chapterId: "chapter-1",
          seniority: "5",
        });
      });
    });

    it("should show success toast after updating user", async () => {
      (useStore as Mock).mockReturnValue(mockUser);
      (updateUser as Mock).mockResolvedValue({});

      render(<ProfileForm />);

      const form = document.querySelector("form");
      form?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("¡Perfil actualizado exitosamente!", {
          description: "Tus datos han sido guardados correctamente.",
          duration: 4000,
        });
      });
    });

    it("should handle update user error", async () => {
      (useStore as Mock).mockReturnValue(mockUser);
      (updateUser as Mock).mockRejectedValue(new Error("API error"));

      render(<ProfileForm />);

      const form = document.querySelector("form");
      form?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle user with undefined properties", () => {
      (useStore as Mock).mockReturnValue({
        id: "user-123",
        userId: "user-123",
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        chapterId: undefined,
        seniority: undefined,
      });

      render(<ProfileForm />);

      expect(screen.getByText("Usuario")).toBeInTheDocument();
    });

    it("should not submit when validation fails", async () => {
      (useStore as Mock).mockReturnValue({
        ...mockUser,
        chapterId: "",
        seniority: "",
      });

      render(<ProfileForm />);

      const form = document.querySelector("form");
      form?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

      await waitFor(() => {
        expect(updateUser).not.toHaveBeenCalled();
        expect(postCreateUser).not.toHaveBeenCalled();
      });
    });
  });
});
