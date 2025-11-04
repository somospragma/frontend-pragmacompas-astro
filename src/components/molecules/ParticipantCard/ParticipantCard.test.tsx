import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ParticipantCard } from "./ParticipantCard";
import { UserRole } from "@/shared/utils/enums/role";
import type { User } from "@/infrastructure/models/TutoringRequest";

const mockUser: User = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  chapter: {
    id: "1",
    name: "Desarrollo Frontend",
  },
  rol: UserRole.TUTOR,
  activeTutoringLimit: 3,
  seniority: "Senior",
};

describe("ParticipantCard", () => {
  describe("Rendering", () => {
    it("should render the participant card", () => {
      render(<ParticipantCard user={mockUser} />);
      const card = screen.getByRole("article");
      expect(card).toBeInTheDocument();
    });

    it("should render user initials", () => {
      render(<ParticipantCard user={mockUser} />);
      const initials = screen.getByText("JD");
      expect(initials).toBeInTheDocument();
    });

    it("should render full name", () => {
      render(<ParticipantCard user={mockUser} />);
      const name = screen.getByText("John Doe");
      expect(name).toBeInTheDocument();
    });

    it("should render email", () => {
      render(<ParticipantCard user={mockUser} />);
      const email = screen.getByText("john.doe@example.com");
      expect(email).toBeInTheDocument();
    });

    it("should render chapter name", () => {
      render(<ParticipantCard user={mockUser} />);
      const chapter = screen.getByText(/Desarrollo Frontend/);
      expect(chapter).toBeInTheDocument();
    });

    it("should render role when provided", () => {
      render(<ParticipantCard user={mockUser} role={UserRole.TUTOR} />);
      const roleText = screen.getByText(/Tutor/);
      expect(roleText).toBeInTheDocument();
    });

    it("should render chapter without role when role is not provided", () => {
      render(<ParticipantCard user={mockUser} />);
      const chapter = screen.getByText("Desarrollo Frontend");
      expect(chapter).toBeInTheDocument();
    });
  });

  describe("User Variations", () => {
    it("should handle user with different name", () => {
      const differentUser: User = {
        ...mockUser,
        firstName: "Jane",
        lastName: "Smith",
      };
      render(<ParticipantCard user={differentUser} />);
      expect(screen.getByText("JS")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    it("should handle user with different email", () => {
      const differentUser: User = {
        ...mockUser,
        email: "jane.smith@test.com",
      };
      render(<ParticipantCard user={differentUser} />);
      expect(screen.getByText("jane.smith@test.com")).toBeInTheDocument();
    });

    it("should handle user with different chapter", () => {
      const differentUser: User = {
        ...mockUser,
        chapter: {
          id: "2",
          name: "Desarrollo Backend",
        },
      };
      render(<ParticipantCard user={differentUser} />);
      expect(screen.getByText(/Desarrollo Backend/)).toBeInTheDocument();
    });

    it("should handle user without chapter", () => {
      const userWithoutChapter = {
        ...mockUser,
        chapter: undefined,
      } as unknown as User;
      render(<ParticipantCard user={userWithoutChapter} />);
      const card = screen.getByRole("article");
      expect(card).toBeInTheDocument();
    });
  });

  describe("Role Variations", () => {
    it("should display TUTOR role correctly", () => {
      render(<ParticipantCard user={mockUser} role={UserRole.TUTOR} />);
      expect(screen.getByText("Desarrollo Frontend | Tutor")).toBeInTheDocument();
    });

    it("should display TUTEE role correctly", () => {
      render(<ParticipantCard user={mockUser} role={UserRole.TUTEE} />);
      expect(screen.getByText("Desarrollo Frontend | Tutorado")).toBeInTheDocument();
    });

    it("should not display pipe separator when role is undefined", () => {
      render(<ParticipantCard user={mockUser} />);
      const chapterText = screen.getByText("Desarrollo Frontend");
      expect(chapterText).toBeInTheDocument();
      expect(chapterText.textContent).not.toContain("|");
    });
  });

  describe("Accessibility", () => {
    it("should have article role on main container", () => {
      render(<ParticipantCard user={mockUser} />);
      const article = screen.getByRole("article");
      expect(article).toBeInTheDocument();
    });

    it("should have descriptive aria-label on article", () => {
      render(<ParticipantCard user={mockUser} role={UserRole.TUTOR} />);
      const article = screen.getByRole("article");
      expect(article).toHaveAttribute("aria-label", "Participante: John Doe, Desarrollo Frontend, Tutor");
    });

    it("should have aria-label on article without role", () => {
      render(<ParticipantCard user={mockUser} />);
      const article = screen.getByRole("article");
      expect(article).toHaveAttribute("aria-label", "Participante: John Doe, Desarrollo Frontend");
    });

    it("should have role='img' on avatar container", () => {
      render(<ParticipantCard user={mockUser} />);
      const avatar = screen.getByRole("img");
      expect(avatar).toBeInTheDocument();
    });

    it("should have descriptive aria-label on avatar", () => {
      render(<ParticipantCard user={mockUser} />);
      const avatar = screen.getByRole("img");
      expect(avatar).toHaveAttribute("aria-label", "Avatar de John Doe");
    });

    it("should have aria-hidden on initials span", () => {
      const { container } = render(<ParticipantCard user={mockUser} />);
      const initialsSpan = container.querySelector(".text-primary");
      expect(initialsSpan).toHaveAttribute("aria-hidden", "true");
    });

    it("should use heading for name", () => {
      render(<ParticipantCard user={mockUser} />);
      const heading = screen.getByRole("heading", { name: "John Doe" });
      expect(heading).toBeInTheDocument();
    });
  });

  describe("Semantic HTML", () => {
    it("should use article element for semantic structure", () => {
      const { container } = render(<ParticipantCard user={mockUser} />);
      const article = container.querySelector("article");
      expect(article).toBeInTheDocument();
    });

    it("should use h3 heading for name", () => {
      const { container } = render(<ParticipantCard user={mockUser} />);
      const heading = container.querySelector("h3");
      expect(heading).toBeInTheDocument();
      expect(heading?.textContent).toBe("John Doe");
    });

    it("should use p elements for chapter and email", () => {
      const { container } = render(<ParticipantCard user={mockUser} />);
      const paragraphs = container.querySelectorAll("p");
      expect(paragraphs.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Styling", () => {
    it("should apply correct container classes", () => {
      render(<ParticipantCard user={mockUser} />);
      const article = screen.getByRole("article");
      expect(article).toHaveClass("flex", "items-center", "gap-4");
    });

    it("should apply correct avatar classes", () => {
      render(<ParticipantCard user={mockUser} />);
      const avatar = screen.getByRole("img");
      expect(avatar).toHaveClass("w-16", "h-16", "rounded-full", "bg-primary/10");
    });

    it("should apply correct initials classes", () => {
      const { container } = render(<ParticipantCard user={mockUser} />);
      const initialsSpan = container.querySelector(".text-primary");
      expect(initialsSpan).toHaveClass("text-primary", "font-semibold", "text-lg");
    });

    it("should apply correct name classes", () => {
      const { container } = render(<ParticipantCard user={mockUser} />);
      const nameHeading = container.querySelector("h3");
      expect(nameHeading).toHaveClass("text-lg", "font-semibold", "text-foreground");
    });

    it("should apply correct chapter classes", () => {
      const { container } = render(<ParticipantCard user={mockUser} />);
      const chapterParagraph = container.querySelector(".text-muted-foreground");
      expect(chapterParagraph).toHaveClass("text-muted-foreground");
    });

    it("should apply correct email classes", () => {
      const { container } = render(<ParticipantCard user={mockUser} />);
      const emailParagraph = container.querySelector(".text-sm");
      expect(emailParagraph).toHaveClass("text-sm", "text-muted-foreground");
    });
  });

  describe("Performance", () => {
    it("should memoize computed values", () => {
      const { rerender } = render(<ParticipantCard user={mockUser} role={UserRole.TUTOR} />);
      const firstArticle = screen.getByRole("article");
      const firstInitials = screen.getByText("JD");

      rerender(<ParticipantCard user={mockUser} role={UserRole.TUTOR} />);
      const secondArticle = screen.getByRole("article");
      const secondInitials = screen.getByText("JD");

      expect(firstArticle).toBe(secondArticle);
      expect(firstInitials.textContent).toBe(secondInitials.textContent);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty firstName gracefully", () => {
      const userWithoutFirstName: User = {
        ...mockUser,
        firstName: "",
      };
      render(<ParticipantCard user={userWithoutFirstName} />);
      const article = screen.getByRole("article");
      expect(article).toBeInTheDocument();
    });

    it("should handle empty lastName gracefully", () => {
      const userWithoutLastName: User = {
        ...mockUser,
        lastName: "",
      };
      render(<ParticipantCard user={userWithoutLastName} />);
      const article = screen.getByRole("article");
      expect(article).toBeInTheDocument();
    });

    it("should handle undefined user properties gracefully", () => {
      const partialUser = {
        ...mockUser,
        firstName: undefined,
        lastName: undefined,
      } as unknown as User;
      render(<ParticipantCard user={partialUser} />);
      const article = screen.getByRole("article");
      expect(article).toBeInTheDocument();
    });

    it("should handle missing email", () => {
      const userWithoutEmail: User = {
        ...mockUser,
        email: "",
      };
      render(<ParticipantCard user={userWithoutEmail} />);
      const article = screen.getByRole("article");
      expect(article).toBeInTheDocument();
    });

    it("should render without errors when mounted multiple times", () => {
      const { unmount, rerender } = render(<ParticipantCard user={mockUser} />);
      expect(() => {
        rerender(<ParticipantCard user={mockUser} />);
        unmount();
        render(<ParticipantCard user={mockUser} />);
      }).not.toThrow();
    });

    it("should handle special characters in name", () => {
      const userWithSpecialChars: User = {
        ...mockUser,
        firstName: "José",
        lastName: "O'Brien",
      };
      render(<ParticipantCard user={userWithSpecialChars} />);
      expect(screen.getByText("JO")).toBeInTheDocument();
      expect(screen.getByText("José O'Brien")).toBeInTheDocument();
    });

    it("should handle long names", () => {
      const userWithLongName: User = {
        ...mockUser,
        firstName: "Christopher",
        lastName: "Montgomery-Wellington",
      };
      render(<ParticipantCard user={userWithLongName} />);
      expect(screen.getByText("CM")).toBeInTheDocument();
      expect(screen.getByText("Christopher Montgomery-Wellington")).toBeInTheDocument();
    });
  });
});
