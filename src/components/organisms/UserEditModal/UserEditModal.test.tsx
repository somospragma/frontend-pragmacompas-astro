import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserEditModal from "./UserEditModal";
import type { User } from "@/infrastructure/models/TutoringRequest";
import { UserRole } from "@/shared/utils/enums/role";
import * as getChaptersService from "@/infrastructure/services/getChapters";
import * as updateUserService from "@/infrastructure/services/updateUser";
import * as updateUserRoleService from "@/infrastructure/services/updateUserRole";

// Mock services
vi.mock("@/infrastructure/services/getChapters");
vi.mock("@/infrastructure/services/updateUser");
vi.mock("@/infrastructure/services/updateUserRole");

const mockGetChapters = vi.mocked(getChaptersService.getChapters);
const mockUpdateUser = vi.mocked(updateUserService.updateUser);
const mockUpdateUserRole = vi.mocked(updateUserRoleService.updateUserRole);

const mockChapters = [
  { id: "chapter-1", name: "Chapter One" },
  { id: "chapter-2", name: "Chapter Two" },
  { id: "chapter-3", name: "Chapter Three" },
];

const mockUser: User = {
  id: "user-123",
  email: "john.doe@example.com",
  firstName: "John",
  lastName: "Doe",
  chapter: { id: "chapter-1", name: "Chapter One" },
  chapterId: "chapter-1",
  seniority: "Senior",
  rol: UserRole.TUTOR,
  slackId: "U12345678",
  activeTutoringLimit: 5,
};

describe("UserEditModal", () => {
  const mockOnClose = vi.fn();
  const mockOnUserUpdated = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetChapters.mockResolvedValue(mockChapters);
    mockUpdateUser.mockResolvedValue({} as User);
    mockUpdateUserRole.mockResolvedValue({} as User);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render nothing when user is null", () => {
      const { container } = render(
        <UserEditModal isOpen={true} onClose={mockOnClose} user={null} onUserUpdated={mockOnUserUpdated} />
      );

      expect(container.firstChild).toBeNull();
    });

    it("should render modal when isOpen is true and user is provided", async () => {
      render(<UserEditModal isOpen={true} onClose={mockOnClose} user={mockUser} onUserUpdated={mockOnUserUpdated} />);

      await waitFor(() => {
        expect(screen.getByText("Editar Usuario")).toBeInTheDocument();
      });
    });

    it("should not render modal when isOpen is false", () => {
      render(<UserEditModal isOpen={false} onClose={mockOnClose} user={mockUser} onUserUpdated={mockOnUserUpdated} />);

      expect(screen.queryByText("Editar Usuario")).not.toBeInTheDocument();
    });

    it("should display user email in description", async () => {
      render(<UserEditModal isOpen={true} onClose={mockOnClose} user={mockUser} onUserUpdated={mockOnUserUpdated} />);

      await waitFor(() => {
        expect(screen.getByText(mockUser.email)).toBeInTheDocument();
      });
    });

    it("should render all form sections", async () => {
      render(<UserEditModal isOpen={true} onClose={mockOnClose} user={mockUser} onUserUpdated={mockOnUserUpdated} />);

      await waitFor(() => {
        expect(screen.getByText("Información Básica")).toBeInTheDocument();
      });

      expect(screen.getByText("Asignación")).toBeInTheDocument();
      expect(screen.getByText("Información Adicional")).toBeInTheDocument();
    });
  });

  describe("Form Fields", () => {
    it("should populate form fields with user data", async () => {
      render(<UserEditModal isOpen={true} onClose={mockOnClose} user={mockUser} onUserUpdated={mockOnUserUpdated} />);

      await waitFor(() => {
        const firstNameInput = screen.getByLabelText(/nombre/i) as HTMLInputElement;
        expect(firstNameInput.value).toBe(mockUser.firstName);
      });

      const lastNameInput = screen.getByLabelText(/apellido/i) as HTMLInputElement;
      expect(lastNameInput.value).toBe(mockUser.lastName);

      const activeTutoringLimitInput = screen.getByLabelText(/límite de tutorías activas/i) as HTMLInputElement;
      expect(activeTutoringLimitInput.value).toBe(mockUser.activeTutoringLimit?.toString());
    });

    it("should disable Slack ID field", async () => {
      render(<UserEditModal isOpen={true} onClose={mockOnClose} user={mockUser} onUserUpdated={mockOnUserUpdated} />);

      await waitFor(() => {
        const slackIdInput = screen.getByLabelText(/slack id/i) as HTMLInputElement;
        expect(slackIdInput).toBeDisabled();
      });
    });

    it("should display Slack ID value in disabled field", async () => {
      render(<UserEditModal isOpen={true} onClose={mockOnClose} user={mockUser} onUserUpdated={mockOnUserUpdated} />);

      await waitFor(() => {
        const slackIdInput = screen.getByLabelText(/slack id/i) as HTMLInputElement;
        expect(slackIdInput.value).toBe(mockUser.slackId);
      });
    });
  });

  describe("Chapters Loading", () => {
    it("should fetch chapters when modal opens", async () => {
      render(<UserEditModal isOpen={true} onClose={mockOnClose} user={mockUser} onUserUpdated={mockOnUserUpdated} />);

      await waitFor(() => {
        expect(mockGetChapters).toHaveBeenCalledTimes(1);
      });
    });

    it("should not fetch chapters if already loaded", async () => {
      const { rerender } = render(
        <UserEditModal isOpen={true} onClose={mockOnClose} user={mockUser} onUserUpdated={mockOnUserUpdated} />
      );

      await waitFor(() => {
        expect(mockGetChapters).toHaveBeenCalledTimes(1);
      });

      rerender(
        <UserEditModal isOpen={false} onClose={mockOnClose} user={mockUser} onUserUpdated={mockOnUserUpdated} />
      );
      rerender(<UserEditModal isOpen={true} onClose={mockOnClose} user={mockUser} onUserUpdated={mockOnUserUpdated} />);

      expect(mockGetChapters).toHaveBeenCalledTimes(1);
    });

    it("should handle chapters fetch error gracefully", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      mockGetChapters.mockRejectedValueOnce(new Error("Failed to fetch chapters"));

      render(<UserEditModal isOpen={true} onClose={mockOnClose} user={mockUser} onUserUpdated={mockOnUserUpdated} />);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching chapters:", expect.any(Error));
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Form Submission", () => {
    it("should call updateUser with correct data on save", async () => {
      const user = userEvent.setup();
      render(<UserEditModal isOpen={true} onClose={mockOnClose} user={mockUser} onUserUpdated={mockOnUserUpdated} />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /guardar cambios/i })).toBeInTheDocument();
      });

      const saveButton = screen.getByRole("button", { name: /guardar cambios/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockUpdateUser).toHaveBeenCalledWith({
          id: mockUser.id,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          chapterId: mockUser.chapterId,
          seniority: mockUser.seniority,
          activeTutoringLimit: mockUser.activeTutoringLimit,
        });
      });
    });

    it("should call onUserUpdated and onClose after successful save", async () => {
      const user = userEvent.setup();
      render(<UserEditModal isOpen={true} onClose={mockOnClose} user={mockUser} onUserUpdated={mockOnUserUpdated} />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /guardar cambios/i })).toBeInTheDocument();
      });

      const saveButton = screen.getByRole("button", { name: /guardar cambios/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockOnUserUpdated).toHaveBeenCalledTimes(1);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });

    it("should handle save error gracefully", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      mockUpdateUser.mockRejectedValueOnce(new Error("Failed to update user"));

      const user = userEvent.setup();
      render(<UserEditModal isOpen={true} onClose={mockOnClose} user={mockUser} onUserUpdated={mockOnUserUpdated} />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /guardar cambios/i })).toBeInTheDocument();
      });

      const saveButton = screen.getByRole("button", { name: /guardar cambios/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith("Error updating user:", expect.any(Error));
      });

      expect(mockOnUserUpdated).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Button States", () => {
    it("should call onClose when cancel button is clicked", async () => {
      const user = userEvent.setup();
      render(<UserEditModal isOpen={true} onClose={mockOnClose} user={mockUser} onUserUpdated={mockOnUserUpdated} />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /cancelar/i })).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole("button", { name: /cancelar/i });
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("should have aria-required on required fields", async () => {
      render(<UserEditModal isOpen={true} onClose={mockOnClose} user={mockUser} onUserUpdated={mockOnUserUpdated} />);

      await waitFor(() => {
        const firstNameInput = screen.getByLabelText(/nombre/i);
        expect(firstNameInput).toHaveAttribute("aria-required", "true");
      });

      const lastNameInput = screen.getByLabelText(/apellido/i);
      expect(lastNameInput).toHaveAttribute("aria-required", "true");
    });
  });

  describe("Performance", () => {
    it("should memoize seniority options", async () => {
      const { rerender } = render(
        <UserEditModal isOpen={true} onClose={mockOnClose} user={mockUser} onUserUpdated={mockOnUserUpdated} />
      );

      await waitFor(() => {
        expect(screen.getByText("Seniority")).toBeInTheDocument();
      });

      rerender(<UserEditModal isOpen={true} onClose={mockOnClose} user={mockUser} onUserUpdated={mockOnUserUpdated} />);

      expect(screen.getByText("Seniority")).toBeInTheDocument();
    });

    it("should memoize role options", async () => {
      const { rerender } = render(
        <UserEditModal isOpen={true} onClose={mockOnClose} user={mockUser} onUserUpdated={mockOnUserUpdated} />
      );

      await waitFor(() => {
        expect(screen.getByText("Rol")).toBeInTheDocument();
      });

      rerender(<UserEditModal isOpen={true} onClose={mockOnClose} user={mockUser} onUserUpdated={mockOnUserUpdated} />);

      expect(screen.getByText("Rol")).toBeInTheDocument();
    });

    it("should memoize chapter options based on chapters array", async () => {
      const { rerender } = render(
        <UserEditModal isOpen={true} onClose={mockOnClose} user={mockUser} onUserUpdated={mockOnUserUpdated} />
      );

      await waitFor(() => {
        expect(mockGetChapters).toHaveBeenCalled();
      });

      rerender(<UserEditModal isOpen={true} onClose={mockOnClose} user={mockUser} onUserUpdated={mockOnUserUpdated} />);

      expect(mockGetChapters).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edge Cases", () => {
    it("should reset form when modal reopens with different user", async () => {
      const { rerender } = render(
        <UserEditModal isOpen={true} onClose={mockOnClose} user={mockUser} onUserUpdated={mockOnUserUpdated} />
      );

      await waitFor(() => {
        const firstNameInput = screen.getByLabelText(/nombre/i) as HTMLInputElement;
        expect(firstNameInput.value).toBe("John");
      });

      const newUser: User = {
        ...mockUser,
        id: "user-456",
        firstName: "Jane",
        lastName: "Smith",
      };

      rerender(<UserEditModal isOpen={false} onClose={mockOnClose} user={newUser} onUserUpdated={mockOnUserUpdated} />);
      rerender(<UserEditModal isOpen={true} onClose={mockOnClose} user={newUser} onUserUpdated={mockOnUserUpdated} />);

      await waitFor(() => {
        const firstNameInput = screen.getByLabelText(/nombre/i) as HTMLInputElement;
        expect(firstNameInput.value).toBe("Jane");
      });
    });
  });
});
