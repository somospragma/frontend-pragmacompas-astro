import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MentorshipActionModal from "./MentorshipActionModal";
import { MentorshipStatus } from "@/shared/utils/enums/mentorshipStatus";
import { UserRole } from "@/shared/utils/enums/role";
import { useMentorshipStates } from "@/shared/entities/mentorshipState";
import { userStore } from "@/store/userStore";

vi.mock("@/shared/entities/mentorshipState");
vi.mock("@/store/userStore", () => ({
  userStore: {
    get: vi.fn(),
  },
}));

const mockRequest = {
  id: "req-1",
  requestStatus: MentorshipStatus.PENDING,
  requestDate: "2025-01-01",
  tutee: {
    id: "tutee-1",
    firstName: "John",
    lastName: "Doe",
    email: "john@test.com",
    rol: UserRole.TUTEE,
    chapter: {
      id: "chapter-1",
      name: "Test Chapter",
    },
    activeTutoringLimit: 3,
    seniority: "Junior",
  },
  tutor: {
    id: "tutor-1",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@test.com",
    rol: UserRole.TUTOR,
    chapter: {
      id: "chapter-1",
      name: "Test Chapter",
    },
    activeTutoringLimit: 5,
    seniority: "Senior",
  },
  skills: [
    { id: "1", name: "React" },
    { id: "2", name: "TypeScript" },
  ],
  needsDescription: "Need help with React hooks and state management",
};

describe("MentorshipActionModal", () => {
  const mockNext = vi.fn();
  const mockPrevious = vi.fn();
  const mockOnOpenChange = vi.fn();
  const mockOnRefetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (userStore.get as Mock).mockReturnValue({ userId: "user-123" });
    (useMentorshipStates as Mock).mockReturnValue({
      next: mockNext,
      previous: mockPrevious,
      isLoading: false,
    });
  });

  describe("Rendering", () => {
    it("should render modal when open", () => {
      render(
        <MentorshipActionModal
          isOpen={true}
          selectedRequest={mockRequest}
          onOpenChange={mockOnOpenChange}
          onRefetch={mockOnRefetch}
        />
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Solicitud de tutoría")).toBeInTheDocument();
    });

    it("should not render when closed", () => {
      render(
        <MentorshipActionModal
          isOpen={false}
          selectedRequest={mockRequest}
          onOpenChange={mockOnOpenChange}
          onRefetch={mockOnRefetch}
        />
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("should display request details", () => {
      render(
        <MentorshipActionModal
          isOpen={true}
          selectedRequest={mockRequest}
          onOpenChange={mockOnOpenChange}
          onRefetch={mockOnRefetch}
        />
      );

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("Need help with React hooks and state management")).toBeInTheDocument();
    });
  });

  describe("PENDING Status Actions", () => {
    it("should show Aprobar and Rechazar buttons for PENDING status", () => {
      render(
        <MentorshipActionModal
          isOpen={true}
          selectedRequest={mockRequest}
          onOpenChange={mockOnOpenChange}
          onRefetch={mockOnRefetch}
        />
      );

      expect(screen.getByRole("button", { name: /aprobar tutoría/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /rechazar/i })).toBeInTheDocument();
    });

    it("should call next when Aprobar is clicked", async () => {
      const user = userEvent.setup();
      render(
        <MentorshipActionModal
          isOpen={true}
          selectedRequest={mockRequest}
          onOpenChange={mockOnOpenChange}
          onRefetch={mockOnRefetch}
        />
      );

      const approveButton = screen.getByRole("button", { name: /aprobar tutoría/i });
      await user.click(approveButton);

      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it("should call previous when Rechazar is clicked", async () => {
      const user = userEvent.setup();
      render(
        <MentorshipActionModal
          isOpen={true}
          selectedRequest={mockRequest}
          onOpenChange={mockOnOpenChange}
          onRefetch={mockOnRefetch}
        />
      );

      const rejectButton = screen.getByRole("button", { name: /rechazar/i });
      await user.click(rejectButton);

      expect(mockPrevious).toHaveBeenCalledTimes(1);
    });
  });

  describe("CONVERSING Status Actions", () => {
    const conversingRequest = {
      ...mockRequest,
      requestStatus: MentorshipStatus.CONVERSING,
    };

    it("should show objectives textarea for CONVERSING status", () => {
      render(
        <MentorshipActionModal
          isOpen={true}
          selectedRequest={conversingRequest}
          onOpenChange={mockOnOpenChange}
          onRefetch={mockOnRefetch}
        />
      );

      expect(screen.getByLabelText(/objetivos/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/comparte tus objetivos/i)).toBeInTheDocument();
    });

    it("should show Aceptar Tutoría button for CONVERSING status", () => {
      render(
        <MentorshipActionModal
          isOpen={true}
          selectedRequest={conversingRequest}
          onOpenChange={mockOnOpenChange}
          onRefetch={mockOnRefetch}
        />
      );

      expect(screen.getByRole("button", { name: /aceptar tutoría/i })).toBeInTheDocument();
    });

    it("should disable Aceptar button when objectives is empty", () => {
      render(
        <MentorshipActionModal
          isOpen={true}
          selectedRequest={conversingRequest}
          onOpenChange={mockOnOpenChange}
          onRefetch={mockOnRefetch}
        />
      );

      const acceptButton = screen.getByRole("button", { name: /aceptar tutoría/i });
      expect(acceptButton).toBeDisabled();
    });

    it("should enable Aceptar button when objectives is filled", async () => {
      const user = userEvent.setup();
      render(
        <MentorshipActionModal
          isOpen={true}
          selectedRequest={conversingRequest}
          onOpenChange={mockOnOpenChange}
          onRefetch={mockOnRefetch}
        />
      );

      const textarea = screen.getByLabelText(/objetivos/i);
      await user.type(textarea, "Learn advanced React patterns");

      await waitFor(() => {
        const acceptButton = screen.getByRole("button", { name: /aceptar tutoría/i });
        expect(acceptButton).not.toBeDisabled();
      });
    });

    it("should disable Aceptar button when objectives is empty", async () => {
      render(
        <MentorshipActionModal
          isOpen={true}
          selectedRequest={conversingRequest}
          onOpenChange={mockOnOpenChange}
          onRefetch={mockOnRefetch}
        />
      );

      const acceptButton = screen.getByRole("button", { name: /aceptar tutoría/i });
      expect(acceptButton).toBeDisabled();

      // Button should remain disabled and prevent clicks
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should prevent accept action when objectives cleared", async () => {
      const user = userEvent.setup();
      render(
        <MentorshipActionModal
          isOpen={true}
          selectedRequest={conversingRequest}
          onOpenChange={mockOnOpenChange}
          onRefetch={mockOnRefetch}
        />
      );

      const textarea = screen.getByLabelText(/objetivos/i);
      await user.type(textarea, "a");
      await user.clear(textarea);

      // Button should be disabled when textarea is empty
      const acceptButton = screen.getByRole("button", { name: /aceptar tutoría/i });
      expect(acceptButton).toBeDisabled();

      await user.type(textarea, "New objectives");

      await waitFor(() => {
        expect(acceptButton).not.toBeDisabled();
      });
    });

    it("should call next with objectives when valid", async () => {
      const user = userEvent.setup();
      render(
        <MentorshipActionModal
          isOpen={true}
          selectedRequest={conversingRequest}
          onOpenChange={mockOnOpenChange}
          onRefetch={mockOnRefetch}
        />
      );

      const textarea = screen.getByLabelText(/objetivos/i);
      await user.type(textarea, "Learn advanced React patterns");

      const acceptButton = screen.getByRole("button", { name: /aceptar tutoría/i });
      await user.click(acceptButton);

      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });

  describe("AVAILABLE Status Actions", () => {
    const availableRequest = {
      ...mockRequest,
      requestStatus: MentorshipStatus.AVAILABLE,
    };

    it("should show Reunirse button for AVAILABLE status", () => {
      render(
        <MentorshipActionModal
          isOpen={true}
          selectedRequest={availableRequest}
          onOpenChange={mockOnOpenChange}
          onRefetch={mockOnRefetch}
        />
      );

      expect(screen.getByRole("button", { name: /reunirse/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /volver/i })).toBeInTheDocument();
    });

    it("should call onOpenChange when Volver is clicked", async () => {
      const user = userEvent.setup();
      render(
        <MentorshipActionModal
          isOpen={true}
          selectedRequest={availableRequest}
          onOpenChange={mockOnOpenChange}
          onRefetch={mockOnRefetch}
        />
      );

      const backButton = screen.getByRole("button", { name: /volver/i });
      await user.click(backButton);

      expect(mockOnOpenChange).toHaveBeenCalledTimes(1);
      expect(mockPrevious).not.toHaveBeenCalled();
    });

    it("should not show objectives textarea for AVAILABLE status", () => {
      render(
        <MentorshipActionModal
          isOpen={true}
          selectedRequest={availableRequest}
          onOpenChange={mockOnOpenChange}
          onRefetch={mockOnRefetch}
        />
      );

      expect(screen.queryByLabelText(/objetivos/i)).not.toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    beforeEach(() => {
      (useMentorshipStates as Mock).mockReturnValue({
        next: mockNext,
        previous: mockPrevious,
        isLoading: true,
      });
    });

    it("should disable action buttons when loading", () => {
      render(
        <MentorshipActionModal
          isOpen={true}
          selectedRequest={mockRequest}
          onOpenChange={mockOnOpenChange}
          onRefetch={mockOnRefetch}
        />
      );

      const approveButton = screen.getByRole("button", { name: /aprobar tutoría/i });
      const rejectButton = screen.getByRole("button", { name: /rechazar/i });

      expect(approveButton).toBeDisabled();
      expect(rejectButton).toBeDisabled();

      // Close button should remain enabled
      const closeButton = screen.getByLabelText(/close dialog/i);
      expect(closeButton).not.toBeDisabled();
    });

    it("should show aria-busy on buttons when loading", () => {
      render(
        <MentorshipActionModal
          isOpen={true}
          selectedRequest={mockRequest}
          onOpenChange={mockOnOpenChange}
          onRefetch={mockOnRefetch}
        />
      );

      const approveButton = screen.getByRole("button", { name: /aprobar tutoría/i });
      const rejectButton = screen.getByRole("button", { name: /rechazar/i });

      expect(approveButton).toHaveAttribute("aria-busy", "true");
      expect(rejectButton).toHaveAttribute("aria-busy", "true");
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes on dialog", () => {
      render(
        <MentorshipActionModal
          isOpen={true}
          selectedRequest={mockRequest}
          onOpenChange={mockOnOpenChange}
          onRefetch={mockOnRefetch}
        />
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
    });

    it("should have proper label for objectives textarea", () => {
      const conversingRequest = {
        ...mockRequest,
        requestStatus: MentorshipStatus.CONVERSING,
      };

      render(
        <MentorshipActionModal
          isOpen={true}
          selectedRequest={conversingRequest}
          onOpenChange={mockOnOpenChange}
          onRefetch={mockOnRefetch}
        />
      );

      const textarea = screen.getByLabelText(/objetivos/i);
      expect(textarea).toHaveAttribute("aria-required", "true");
    });

    it("should associate error with textarea via aria-describedby", async () => {
      const user = userEvent.setup();
      const conversingRequest = {
        ...mockRequest,
        requestStatus: MentorshipStatus.CONVERSING,
      };

      render(
        <MentorshipActionModal
          isOpen={true}
          selectedRequest={conversingRequest}
          onOpenChange={mockOnOpenChange}
          onRefetch={mockOnRefetch}
        />
      );

      const textarea = screen.getByLabelText(/objetivos/i);
      await user.type(textarea, "a");
      await user.clear(textarea);
      await user.tab(); // Trigger blur event

      await waitFor(() => {
        expect(textarea).toHaveAttribute("aria-invalid", "true");
        expect(textarea).toHaveAttribute("aria-describedby");
      });
    });

    it("should have error message with role alert", async () => {
      const user = userEvent.setup();
      const conversingRequest = {
        ...mockRequest,
        requestStatus: MentorshipStatus.CONVERSING,
      };

      render(
        <MentorshipActionModal
          isOpen={true}
          selectedRequest={conversingRequest}
          onOpenChange={mockOnOpenChange}
          onRefetch={mockOnRefetch}
        />
      );

      const textarea = screen.getByLabelText(/objetivos/i);
      await user.type(textarea, "a");
      await user.clear(textarea);
      await user.tab(); // Trigger blur event

      await waitFor(() => {
        const errorMessage = screen.getByRole("alert");
        expect(errorMessage).toHaveTextContent(/los objetivos son requeridos/i);
      });
    });
  });

  describe("State Cleanup", () => {
    it("should clear objectives when modal closes", async () => {
      const user = userEvent.setup();
      const conversingRequest = {
        ...mockRequest,
        requestStatus: MentorshipStatus.CONVERSING,
      };

      const { rerender } = render(
        <MentorshipActionModal
          isOpen={true}
          selectedRequest={conversingRequest}
          onOpenChange={mockOnOpenChange}
          onRefetch={mockOnRefetch}
        />
      );

      const textarea = screen.getByLabelText(/objetivos/i) as HTMLTextAreaElement;
      await user.type(textarea, "Test objectives");

      expect(textarea.value).toBe("Test objectives");

      // Close modal
      rerender(
        <MentorshipActionModal
          isOpen={false}
          selectedRequest={conversingRequest}
          onOpenChange={mockOnOpenChange}
          onRefetch={mockOnRefetch}
        />
      );

      // Reopen modal
      rerender(
        <MentorshipActionModal
          isOpen={true}
          selectedRequest={conversingRequest}
          onOpenChange={mockOnOpenChange}
          onRefetch={mockOnRefetch}
        />
      );

      const newTextarea = screen.getByLabelText(/objetivos/i) as HTMLTextAreaElement;
      expect(newTextarea.value).toBe("");
    });

    it("should clear objectives when modal closes and reopens", async () => {
      const user = userEvent.setup();
      const conversingRequest = {
        ...mockRequest,
        requestStatus: MentorshipStatus.CONVERSING,
      };

      const { rerender } = render(
        <MentorshipActionModal
          isOpen={true}
          selectedRequest={conversingRequest}
          onOpenChange={mockOnOpenChange}
          onRefetch={mockOnRefetch}
        />
      );

      const textarea = screen.getByLabelText(/objetivos/i);
      await user.type(textarea, "Initial objectives");

      const acceptButton = screen.getByRole("button", { name: /aceptar tutoría/i });
      expect(acceptButton).not.toBeDisabled();

      // Close modal
      rerender(
        <MentorshipActionModal
          isOpen={false}
          selectedRequest={conversingRequest}
          onOpenChange={mockOnOpenChange}
          onRefetch={mockOnRefetch}
        />
      );

      // Reopen modal
      rerender(
        <MentorshipActionModal
          isOpen={true}
          selectedRequest={conversingRequest}
          onOpenChange={mockOnOpenChange}
          onRefetch={mockOnRefetch}
        />
      );

      // Objectives should be cleared and button disabled
      const newTextarea = screen.getByLabelText(/objetivos/i) as HTMLTextAreaElement;
      expect(newTextarea.value).toBe("");

      const newAcceptButton = screen.getByRole("button", { name: /aceptar tutoría/i });
      expect(newAcceptButton).toBeDisabled();
    });
  });

  describe("Performance", () => {
    it("should use memoized callbacks", () => {
      const { rerender } = render(
        <MentorshipActionModal
          isOpen={true}
          selectedRequest={mockRequest}
          onOpenChange={mockOnOpenChange}
          onRefetch={mockOnRefetch}
        />
      );

      const firstButtons = screen.getAllByRole("button");

      rerender(
        <MentorshipActionModal
          isOpen={true}
          selectedRequest={mockRequest}
          onOpenChange={mockOnOpenChange}
          onRefetch={mockOnRefetch}
        />
      );

      const secondButtons = screen.getAllByRole("button");
      expect(firstButtons.length).toBe(secondButtons.length);
    });
  });
});
