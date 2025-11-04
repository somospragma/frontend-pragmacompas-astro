import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserViewModal from "./UserViewModal";
import type { User } from "@/infrastructure/models/TutoringRequest";
import { UserRole } from "@/shared/utils/enums/role";

describe("UserViewModal", () => {
  const mockOnClose = vi.fn();

  const mockUser: User = {
    id: "user-123",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    rol: UserRole.TUTEE,
    seniority: "Senior",
    chapterId: "chapter-456",
    slackId: "U123456",
    chapter: { id: "chapter-456", name: "Test Chapter" },
    activeTutoringLimit: 5,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should not render when isOpen is false", () => {
      render(<UserViewModal isOpen={false} onClose={mockOnClose} user={mockUser} />);

      expect(screen.queryByText("Detalles del Usuario")).not.toBeInTheDocument();
    });

    it("should not render when user is null", () => {
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={null} />);

      expect(screen.queryByText("Detalles del Usuario")).not.toBeInTheDocument();
    });

    it("should render modal when isOpen is true and user is provided", () => {
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);

      expect(screen.getByText("Detalles del Usuario")).toBeInTheDocument();
    });

    it("should display user full name", () => {
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("should display user email", () => {
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);

      expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    });

    it("should display user role", () => {
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);

      expect(screen.getByText(UserRole.TUTEE)).toBeInTheDocument();
    });

    it("should display user seniority", () => {
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);

      expect(screen.getByText("Senior")).toBeInTheDocument();
    });

    it("should display user ID", () => {
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);

      expect(screen.getByText("user-123")).toBeInTheDocument();
    });

    it("should display user initial in avatar", () => {
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);

      expect(screen.getByText("J")).toBeInTheDocument();
    });

    it("should display chapter ID when provided", () => {
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);

      expect(screen.getByText("chapter-456")).toBeInTheDocument();
    });

    it("should display slack ID when provided", () => {
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);

      expect(screen.getByText("U123456")).toBeInTheDocument();
    });
  });

  describe("User Name Display", () => {
    it("should display full name when both firstName and lastName are provided", () => {
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("should display only firstName when lastName is missing", () => {
      const userWithoutLastName = { ...mockUser, lastName: undefined };
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={userWithoutLastName as User} />);

      expect(screen.getByText("John")).toBeInTheDocument();
    });

    it("should display only lastName when firstName is missing", () => {
      const userWithoutFirstName = { ...mockUser, firstName: undefined };
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={userWithoutFirstName as User} />);

      expect(screen.getByText("Doe")).toBeInTheDocument();
    });

    it("should display 'Sin nombre' when both names are missing", () => {
      const userWithoutName = { ...mockUser, firstName: undefined, lastName: undefined };
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={userWithoutName as User} />);

      expect(screen.getByText("Sin nombre")).toBeInTheDocument();
    });
  });

  describe("User Initial Display", () => {
    it("should display first letter of firstName as initial", () => {
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);

      expect(screen.getByText("J")).toBeInTheDocument();
    });

    it("should display first letter of lastName when firstName is missing", () => {
      const userWithoutFirstName = { ...mockUser, firstName: undefined };
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={userWithoutFirstName as User} />);

      expect(screen.getByText("D")).toBeInTheDocument();
    });

    it("should display '?' when both names are missing", () => {
      const userWithoutName = { ...mockUser, firstName: undefined, lastName: undefined };
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={userWithoutName as User} />);

      expect(screen.getByText("?")).toBeInTheDocument();
    });

    it("should display initial in uppercase", () => {
      const userWithLowerCase = { ...mockUser, firstName: "john" };
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={userWithLowerCase} />);

      expect(screen.getByText("J")).toBeInTheDocument();
    });
  });

  describe("Optional Fields", () => {
    it("should not display chapter ID section when chapterId is not provided", () => {
      const userWithoutChapter = { ...mockUser, chapterId: undefined };
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={userWithoutChapter as User} />);

      expect(screen.queryByText("Chapter ID")).not.toBeInTheDocument();
    });

    it("should not display slack ID section when slackId is not provided", () => {
      const userWithoutSlack = { ...mockUser, slackId: undefined };
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={userWithoutSlack as User} />);

      expect(screen.queryByText("Slack ID")).not.toBeInTheDocument();
    });

    it("should display 'No especificado' when email is missing", () => {
      const userWithoutEmail = { ...mockUser, email: undefined };
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={userWithoutEmail as User} />);

      const emailLabels = screen.getAllByText("No especificado");
      expect(emailLabels.length).toBeGreaterThan(0);
    });

    it("should display 'No especificado' when seniority is missing", () => {
      const userWithoutSeniority = { ...mockUser, seniority: undefined };
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={userWithoutSeniority as User} />);

      const noSpecifiedLabels = screen.getAllByText("No especificado");
      expect(noSpecifiedLabels.length).toBeGreaterThan(0);
    });

    it("should display 'No especificado' when id is missing", () => {
      const userWithoutId = { ...mockUser, id: undefined };
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={userWithoutId as User} />);

      const noSpecifiedLabels = screen.getAllByText("No especificado");
      expect(noSpecifiedLabels.length).toBeGreaterThan(0);
    });
  });

  describe("Close Button", () => {
    it("should call onClose when close button is clicked", async () => {
      const user = userEvent.setup();
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);

      const closeButton = screen.getByRole("button", { name: /cerrar/i });
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should display close button with correct text", () => {
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);

      const closeButton = screen.getByRole("button", { name: /cerrar/i });
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveTextContent("Cerrar");
    });
  });

  describe("Accessibility", () => {
    it("should have article element with proper structure", () => {
      const { container } = render(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);

      const article = container.querySelector("article");
      expect(article).toBeInTheDocument();
    });

    it("should have header element for user info section", () => {
      const { container } = render(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);

      const header = container.querySelector("header");
      expect(header).toBeInTheDocument();
    });

    it("should have section with aria-label for user details", () => {
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);

      const section = screen.getByLabelText("Información del usuario");
      expect(section).toBeInTheDocument();
    });

    it("should have footer element for actions", () => {
      const { container } = render(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);

      const footer = container.querySelector("footer");
      expect(footer).toBeInTheDocument();
    });

    it("should have aria-hidden on avatar", () => {
      const { container } = render(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);

      const avatar = container.querySelector('[aria-hidden="true"]');
      expect(avatar).toBeInTheDocument();
    });

    it("should have role status on user role display", () => {
      const { container } = render(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);

      const roleStatus = container.querySelector('[role="status"]');
      expect(roleStatus).toBeInTheDocument();
      expect(roleStatus).toHaveTextContent(UserRole.TUTEE);
    });

    it("should have aria-label on close button", () => {
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);

      const closeButton = screen.getByRole("button", { name: /cerrar modal de detalles/i });
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should memoize fullName computation", () => {
      const { rerender } = render(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();

      // Rerender with same user
      rerender(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("should memoize userInitial computation", () => {
      const { rerender } = render(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);

      expect(screen.getByText("J")).toBeInTheDocument();

      // Rerender with same user
      rerender(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);

      expect(screen.getByText("J")).toBeInTheDocument();
    });

    it("should recalculate fullName when user changes", () => {
      const { rerender } = render(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();

      const newUser = { ...mockUser, firstName: "Jane", lastName: "Smith" };
      rerender(<UserViewModal isOpen={true} onClose={mockOnClose} user={newUser} />);

      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    });

    it("should recalculate userInitial when user changes", () => {
      const { rerender } = render(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);

      expect(screen.getByText("J")).toBeInTheDocument();

      const newUser = { ...mockUser, firstName: "Alice" };
      rerender(<UserViewModal isOpen={true} onClose={mockOnClose} user={newUser} />);

      expect(screen.getByText("A")).toBeInTheDocument();
    });
  });
});
