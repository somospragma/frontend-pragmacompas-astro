import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UserViewModal from "./UserViewModal";
import type { User } from "@/infrastructure/models/TutoringRequest";
import { UserRole } from "@/shared/utils/enums/role";

const mockUser: User = {
  id: "123",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@test.com",
  rol: UserRole.TUTEE,
  seniority: "Senior",
  chapterId: "chapter-1",
  slackId: "U123456",
  chapter: { id: "chapter-1", name: "Chapter 1" },
  activeTutoringLimit: 5,
};

const mockOnClose = vi.fn();

describe("UserViewModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering Logic", () => {
    it("should not render when isOpen is false", () => {
      render(<UserViewModal isOpen={false} onClose={mockOnClose} user={mockUser} />);
      expect(screen.queryByText("Detalles del Usuario")).not.toBeInTheDocument();
    });

    it("should not render when user is null", () => {
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={null} />);
      expect(screen.queryByText("Detalles del Usuario")).not.toBeInTheDocument();
    });

    it("should render when isOpen is true and user exists", () => {
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);
      expect(screen.getByText("Detalles del Usuario")).toBeInTheDocument();
    });
  });

  describe("User Data Display", () => {
    it("should display complete user information", () => {
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john.doe@test.com")).toBeInTheDocument();
      expect(screen.getByText("Tutorado")).toBeInTheDocument();
      expect(screen.getByText("Senior")).toBeInTheDocument();
      expect(screen.getByText("123")).toBeInTheDocument();
      expect(screen.getByText("chapter-1")).toBeInTheDocument();
      expect(screen.getByText("U123456")).toBeInTheDocument();
    });

    it("should handle missing optional fields", () => {
      const userWithoutOptional: User = {
        id: "123",
        firstName: "John",
        lastName: "Doe",
        email: "",
        rol: UserRole.TUTEE,
        seniority: "",
        chapter: { id: "chapter-1", name: "Chapter 1" },
        activeTutoringLimit: 5,
      };

      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={userWithoutOptional} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getAllByText("No especificado")).toHaveLength(2);
    });

    it("should display fallback when names are missing", () => {
      const userWithoutNames: User = {
        id: "123",
        firstName: "",
        lastName: "",
        email: "test@test.com",
        rol: UserRole.TUTEE,
        seniority: "Junior",
        chapter: { id: "chapter-1", name: "Chapter 1" },
        activeTutoringLimit: 5,
      };

      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={userWithoutNames} />);
      expect(screen.getByText("Sin nombre")).toBeInTheDocument();
    });

    it("should display user initial correctly", () => {
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);
      expect(screen.getByText("J")).toBeInTheDocument();
    });
  });

  describe("XSS Protection", () => {
    it("should sanitize malicious input", () => {
      const maliciousUser: User = {
        id: "123",
        firstName: "<script>alert('xss')</script>John",
        lastName: "<img src=x onerror=alert(1)>Doe",
        email: "test@test.com",
        rol: UserRole.TUTEE,
        seniority: "Senior",
        chapter: { id: "chapter-1", name: "Chapter 1" },
        activeTutoringLimit: 5,
      };

      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={maliciousUser} />);

      expect(screen.queryByText(/<script>/)).not.toBeInTheDocument();
      expect(screen.queryByText(/<img/)).not.toBeInTheDocument();
      expect(screen.getByText(/John/)).toBeInTheDocument();
      expect(screen.getByText(/Doe/)).toBeInTheDocument();
    });

    it("should validate email format", () => {
      const userWithInvalidEmail: User = {
        ...mockUser,
        email: "invalid-email-format",
      };

      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={userWithInvalidEmail} />);
      expect(screen.getByText("Email inválido")).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should call onClose when close button is clicked", () => {
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);

      fireEvent.click(screen.getByText("Cerrar"));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should call onClose when Escape key is pressed", () => {
      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);

      fireEvent.keyDown(screen.getByRole("article"), { key: "Escape" });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe("Error Handling", () => {
    it("should render even with malformed user data", () => {
      const malformedUser = {
        id: null,
        firstName: undefined,
        lastName: "",
        email: null,
        rol: undefined,
        seniority: null,
      } as unknown as User;

      render(<UserViewModal isOpen={true} onClose={mockOnClose} user={malformedUser} />);

      expect(screen.getByText("Sin nombre")).toBeInTheDocument();
      expect(screen.getByText("?")).toBeInTheDocument();
    });
  });

  describe("Memoization Logic", () => {
    it("should update display when user changes", () => {
      const { rerender } = render(<UserViewModal isOpen={true} onClose={mockOnClose} user={mockUser} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();

      const newUser = { ...mockUser, firstName: "Jane", lastName: "Smith" };
      rerender(<UserViewModal isOpen={true} onClose={mockOnClose} user={newUser} />);

      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    });
  });
});
