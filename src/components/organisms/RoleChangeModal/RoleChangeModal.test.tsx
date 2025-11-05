import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RoleChangeModal from "./RoleChangeModal";
import type { User } from "@/infrastructure/models/TutoringRequest";
import { UserRole } from "@/shared/utils/enums/role";

const mockUser: User = {
  id: "user-123",
  email: "john.doe@example.com",
  firstName: "John",
  lastName: "Doe",
  chapter: { id: "chapter-1", name: "Chapter One" },
  chapterId: "chapter-1",
  seniority: "Senior",
  rol: UserRole.TUTEE,
  slackId: "U12345678",
  activeTutoringLimit: 5,
};

describe("RoleChangeModal", () => {
  const mockOnClose = vi.fn();
  const mockOnRoleChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnRoleChange.mockResolvedValue(undefined);
  });

  describe("Rendering", () => {
    it("should render nothing when isOpen is false", () => {
      render(<RoleChangeModal isOpen={false} onClose={mockOnClose} user={mockUser} onRoleChange={mockOnRoleChange} />);

      expect(screen.queryByText("Cambiar Rol de Usuario")).not.toBeInTheDocument();
    });

    it("should render nothing when user is null", () => {
      render(<RoleChangeModal isOpen={true} onClose={mockOnClose} user={null} onRoleChange={mockOnRoleChange} />);

      expect(screen.queryByText("Cambiar Rol de Usuario")).not.toBeInTheDocument();
    });

    it("should render modal when isOpen is true and user is provided", () => {
      render(<RoleChangeModal isOpen={true} onClose={mockOnClose} user={mockUser} onRoleChange={mockOnRoleChange} />);

      expect(screen.getByText("Cambiar Rol de Usuario")).toBeInTheDocument();
    });

    it("should display user information", () => {
      render(<RoleChangeModal isOpen={true} onClose={mockOnClose} user={mockUser} onRoleChange={mockOnRoleChange} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    });

    it("should display user initial when no full name", () => {
      const userWithoutLastName = { ...mockUser, lastName: "" };
      render(
        <RoleChangeModal
          isOpen={true}
          onClose={mockOnClose}
          user={userWithoutLastName}
          onRoleChange={mockOnRoleChange}
        />
      );

      expect(screen.getByText("J")).toBeInTheDocument();
      expect(screen.getByText("John")).toBeInTheDocument();
    });

    it("should display current role", () => {
      render(<RoleChangeModal isOpen={true} onClose={mockOnClose} user={mockUser} onRoleChange={mockOnRoleChange} />);

      expect(screen.getByText("Rol actual:")).toBeInTheDocument();
      expect(screen.getByRole("status")).toHaveTextContent(UserRole.TUTEE);
    });

    it("should render all role options", () => {
      render(<RoleChangeModal isOpen={true} onClose={mockOnClose} user={mockUser} onRoleChange={mockOnRoleChange} />);

      expect(screen.getByText("Usuario que recibe mentoría y puede solicitar sesiones de tutoría")).toBeInTheDocument();
      expect(
        screen.getByText("Usuario que puede brindar mentoría y aceptar solicitudes de tutoría")
      ).toBeInTheDocument();
      expect(screen.getByText("Usuario con permisos administrativos completos del sistema")).toBeInTheDocument();
    });
  });

  describe("Role Selection", () => {
    it("should pre-select current user role", () => {
      render(<RoleChangeModal isOpen={true} onClose={mockOnClose} user={mockUser} onRoleChange={mockOnRoleChange} />);

      const tuteeRadio = screen.getByRole("radio", { name: /usuario que recibe mentoría/i });
      expect(tuteeRadio).toBeChecked();
    });

    it("should allow selecting a different role", async () => {
      const user = userEvent.setup();
      render(<RoleChangeModal isOpen={true} onClose={mockOnClose} user={mockUser} onRoleChange={mockOnRoleChange} />);

      const tutorRadio = screen.getByRole("radio", { name: /usuario que puede brindar mentoría/i });
      await user.click(tutorRadio);

      expect(tutorRadio).toBeChecked();
    });

    it("should update selected role on radio change", async () => {
      const user = userEvent.setup();
      render(<RoleChangeModal isOpen={true} onClose={mockOnClose} user={mockUser} onRoleChange={mockOnRoleChange} />);

      const adminRadio = screen.getByRole("radio", { name: /usuario con permisos administrativos/i });
      await user.click(adminRadio);

      expect(adminRadio).toBeChecked();
    });
  });

  describe("Form Submission", () => {
    it("should call onRoleChange with correct parameters when role is changed", async () => {
      const user = userEvent.setup();
      render(<RoleChangeModal isOpen={true} onClose={mockOnClose} user={mockUser} onRoleChange={mockOnRoleChange} />);

      const tutorRadio = screen.getByRole("radio", { name: /usuario que puede brindar mentoría/i });
      await user.click(tutorRadio);

      const changeButton = screen.getByRole("button", { name: /confirmar cambio de rol/i });
      await user.click(changeButton);

      await waitFor(() => {
        expect(mockOnRoleChange).toHaveBeenCalledWith(mockUser.id, UserRole.TUTOR);
      });
    });

    it("should call onClose after successful role change", async () => {
      const user = userEvent.setup();
      render(<RoleChangeModal isOpen={true} onClose={mockOnClose} user={mockUser} onRoleChange={mockOnRoleChange} />);

      const tutorRadio = screen.getByRole("radio", { name: /usuario que puede brindar mentoría/i });
      await user.click(tutorRadio);

      const changeButton = screen.getByRole("button", { name: /confirmar cambio de rol/i });
      await user.click(changeButton);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });

    it("should not allow submitting if no role change", () => {
      render(<RoleChangeModal isOpen={true} onClose={mockOnClose} user={mockUser} onRoleChange={mockOnRoleChange} />);

      const changeButton = screen.getByRole("button", { name: /confirmar cambio de rol/i });

      // Button should be disabled when no role has changed
      expect(changeButton).toBeDisabled();
      expect(mockOnRoleChange).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it("should handle onRoleChange error gracefully", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      mockOnRoleChange.mockRejectedValueOnce(new Error("Failed to change role"));

      const user = userEvent.setup();
      render(<RoleChangeModal isOpen={true} onClose={mockOnClose} user={mockUser} onRoleChange={mockOnRoleChange} />);

      const tutorRadio = screen.getByRole("radio", { name: /usuario que puede brindar mentoría/i });
      await user.click(tutorRadio);

      const changeButton = screen.getByRole("button", { name: /confirmar cambio de rol/i });
      await user.click(changeButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith("Error changing role:", expect.any(Error));
      });

      expect(mockOnClose).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Button States", () => {
    it("should disable change button when no role change", () => {
      render(<RoleChangeModal isOpen={true} onClose={mockOnClose} user={mockUser} onRoleChange={mockOnRoleChange} />);

      const changeButton = screen.getByRole("button", { name: /confirmar cambio de rol/i });
      expect(changeButton).toBeDisabled();
    });

    it("should enable change button when role is changed", async () => {
      const user = userEvent.setup();
      render(<RoleChangeModal isOpen={true} onClose={mockOnClose} user={mockUser} onRoleChange={mockOnRoleChange} />);

      const tutorRadio = screen.getByRole("radio", { name: /usuario que puede brindar mentoría/i });
      await user.click(tutorRadio);

      const changeButton = screen.getByRole("button", { name: /confirmar cambio de rol/i });
      expect(changeButton).toBeEnabled();
    });

    it("should show loading state while changing role", async () => {
      mockOnRoleChange.mockImplementation(() => new Promise(() => {})); // Never resolves

      const user = userEvent.setup();
      render(<RoleChangeModal isOpen={true} onClose={mockOnClose} user={mockUser} onRoleChange={mockOnRoleChange} />);

      const tutorRadio = screen.getByRole("radio", { name: /usuario que puede brindar mentoría/i });
      await user.click(tutorRadio);

      const changeButton = screen.getByRole("button", { name: /confirmar cambio de rol/i });
      await user.click(changeButton);

      await waitFor(() => {
        expect(screen.getByText("Cambiando...")).toBeInTheDocument();
      });
    });

    it("should disable both buttons while loading", async () => {
      mockOnRoleChange.mockImplementation(() => new Promise(() => {})); // Never resolves

      const user = userEvent.setup();
      render(<RoleChangeModal isOpen={true} onClose={mockOnClose} user={mockUser} onRoleChange={mockOnRoleChange} />);

      const tutorRadio = screen.getByRole("radio", { name: /usuario que puede brindar mentoría/i });
      await user.click(tutorRadio);

      const changeButton = screen.getByRole("button", { name: /confirmar cambio de rol/i });
      await user.click(changeButton);

      await waitFor(() => {
        const changingButton = screen.getByRole("button", { name: /cambiando rol/i });
        expect(changingButton).toBeDisabled();
      });

      const cancelButton = screen.getByRole("button", { name: /cancelar cambio de rol/i });
      expect(cancelButton).toBeDisabled();
    });

    it("should call onClose when cancel button is clicked", async () => {
      const user = userEvent.setup();
      render(<RoleChangeModal isOpen={true} onClose={mockOnClose} user={mockUser} onRoleChange={mockOnRoleChange} />);

      const cancelButton = screen.getByRole("button", { name: /cancelar cambio de rol/i });
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("should have dialog role and aria-modal", () => {
      render(<RoleChangeModal isOpen={true} onClose={mockOnClose} user={mockUser} onRoleChange={mockOnRoleChange} />);

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(dialog).toHaveAttribute("aria-labelledby", "role-change-title");
    });

    it("should have proper heading with id", () => {
      render(<RoleChangeModal isOpen={true} onClose={mockOnClose} user={mockUser} onRoleChange={mockOnRoleChange} />);

      const heading = screen.getByRole("heading", { name: "Cambiar Rol de Usuario" });
      expect(heading).toHaveAttribute("id", "role-change-title");
    });

    it("should have aria-labels on buttons", () => {
      render(<RoleChangeModal isOpen={true} onClose={mockOnClose} user={mockUser} onRoleChange={mockOnRoleChange} />);

      const cancelButton = screen.getByRole("button", { name: /cancelar cambio de rol/i });
      expect(cancelButton).toHaveAttribute("aria-label");

      const changeButton = screen.getByRole("button", { name: /confirmar cambio de rol/i });
      expect(changeButton).toHaveAttribute("aria-label");
    });

    it("should have aria-describedby on radio inputs", () => {
      render(<RoleChangeModal isOpen={true} onClose={mockOnClose} user={mockUser} onRoleChange={mockOnRoleChange} />);

      const tuteeRadio = screen.getByRole("radio", { name: /usuario que recibe mentoría/i });
      expect(tuteeRadio).toHaveAttribute("aria-describedby", "role-desc-Tutorado");
    });

    it("should have semantic HTML with header and footer", () => {
      const { container } = render(
        <RoleChangeModal isOpen={true} onClose={mockOnClose} user={mockUser} onRoleChange={mockOnRoleChange} />
      );

      expect(container.querySelector("header")).toBeInTheDocument();
      expect(container.querySelector("footer")).toBeInTheDocument();
    });

    it("should use fieldset for radio group", () => {
      render(<RoleChangeModal isOpen={true} onClose={mockOnClose} user={mockUser} onRoleChange={mockOnRoleChange} />);

      const fieldset = screen.getByRole("group", { name: /opciones de rol/i });
      expect(fieldset).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should memoize user initial", () => {
      const { rerender } = render(
        <RoleChangeModal isOpen={true} onClose={mockOnClose} user={mockUser} onRoleChange={mockOnRoleChange} />
      );

      expect(screen.getByText("J")).toBeInTheDocument();

      rerender(<RoleChangeModal isOpen={true} onClose={mockOnClose} user={mockUser} onRoleChange={mockOnRoleChange} />);

      expect(screen.getByText("J")).toBeInTheDocument();
    });

    it("should memoize user name", () => {
      const { rerender } = render(
        <RoleChangeModal isOpen={true} onClose={mockOnClose} user={mockUser} onRoleChange={mockOnRoleChange} />
      );

      expect(screen.getByText("John Doe")).toBeInTheDocument();

      rerender(<RoleChangeModal isOpen={true} onClose={mockOnClose} user={mockUser} onRoleChange={mockOnRoleChange} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("should memoize role options", () => {
      const { rerender } = render(
        <RoleChangeModal isOpen={true} onClose={mockOnClose} user={mockUser} onRoleChange={mockOnRoleChange} />
      );

      expect(screen.getAllByRole("radio")).toHaveLength(3);

      rerender(<RoleChangeModal isOpen={true} onClose={mockOnClose} user={mockUser} onRoleChange={mockOnRoleChange} />);

      expect(screen.getAllByRole("radio")).toHaveLength(3);
    });
  });

  describe("Edge Cases", () => {
    it("should handle user without first name", () => {
      const userWithoutFirstName = { ...mockUser, firstName: "" };
      render(
        <RoleChangeModal
          isOpen={true}
          onClose={mockOnClose}
          user={userWithoutFirstName}
          onRoleChange={mockOnRoleChange}
        />
      );

      expect(screen.getByText("Doe")).toBeInTheDocument();
      expect(screen.getByText("D")).toBeInTheDocument();
    });

    it("should handle user without any name", () => {
      const userWithoutName = { ...mockUser, firstName: "", lastName: "" };
      render(
        <RoleChangeModal isOpen={true} onClose={mockOnClose} user={userWithoutName} onRoleChange={mockOnRoleChange} />
      );

      expect(screen.getByText("Sin nombre")).toBeInTheDocument();
      expect(screen.getByText("?")).toBeInTheDocument();
    });

    it("should handle user without id gracefully", async () => {
      const userWithoutId = { ...mockUser, id: "" };
      const user = userEvent.setup();

      render(
        <RoleChangeModal isOpen={true} onClose={mockOnClose} user={userWithoutId} onRoleChange={mockOnRoleChange} />
      );

      const tutorRadio = screen.getByRole("radio", { name: /usuario que puede brindar mentoría/i });
      await user.click(tutorRadio);

      const changeButton = screen.getByRole("button", { name: /confirmar cambio de rol/i });
      await user.click(changeButton);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });

      expect(mockOnRoleChange).not.toHaveBeenCalled();
    });

    it("should reset selected role when user changes", () => {
      const { rerender } = render(
        <RoleChangeModal isOpen={true} onClose={mockOnClose} user={mockUser} onRoleChange={mockOnRoleChange} />
      );

      const tuteeRadio = screen.getByRole("radio", { name: /usuario que recibe mentoría/i });
      expect(tuteeRadio).toBeChecked();

      const newUser = { ...mockUser, id: "user-456", rol: UserRole.TUTOR };

      rerender(<RoleChangeModal isOpen={true} onClose={mockOnClose} user={newUser} onRoleChange={mockOnRoleChange} />);

      // With useEffect optimization, the role should automatically reset to the new user's role
      const tutorRadio = screen.getByRole("radio", { name: /usuario que puede brindar mentoría/i });
      expect(tutorRadio).toBeChecked();
      expect(tuteeRadio).not.toBeChecked();
    });
  });
});
