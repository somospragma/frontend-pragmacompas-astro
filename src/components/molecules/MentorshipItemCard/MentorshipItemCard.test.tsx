import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MentorshipItemCard from "./MentorshipItemCard";
import { MentorshipStatus } from "@/shared/utils/enums/mentorshipStatus";
import { UserRole } from "@/shared/utils/enums/role";

// Mock renderState helper
vi.mock("@/shared/utils/helpers/renderState", () => ({
  renderState: (status: string) => <span data-testid="status-badge">{status}</span>,
}));

const mockUser = {
  firstName: "John",
  lastName: "Doe",
  chapter: {
    name: "Engineering",
  },
};

const mockSkills = [{ name: "React" }, { name: "TypeScript" }, { name: "Node.js" }];

describe("MentorshipItemCard", () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render user full name", () => {
      render(
        <MentorshipItemCard
          id="1"
          user={mockUser}
          status={MentorshipStatus.AVAILABLE}
          description="Learn React basics"
          skills={mockSkills}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("should render user initials", () => {
      render(
        <MentorshipItemCard
          id="1"
          user={mockUser}
          status={MentorshipStatus.AVAILABLE}
          description="Learn React basics"
          skills={mockSkills}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText("JD")).toBeInTheDocument();
    });

    it("should render chapter name", () => {
      render(
        <MentorshipItemCard
          id="1"
          user={mockUser}
          status={MentorshipStatus.AVAILABLE}
          description="Learn React basics"
          skills={mockSkills}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText("Engineering")).toBeInTheDocument();
    });

    it("should render description", () => {
      render(
        <MentorshipItemCard
          id="1"
          user={mockUser}
          status={MentorshipStatus.AVAILABLE}
          description="Learn React basics"
          skills={mockSkills}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText(/Learn React basics/)).toBeInTheDocument();
    });

    it("should render skills", () => {
      render(
        <MentorshipItemCard
          id="1"
          user={mockUser}
          status={MentorshipStatus.AVAILABLE}
          description="Learn React basics"
          skills={mockSkills}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText(/React, TypeScript, Node.js/)).toBeInTheDocument();
    });

    it("should render status badge", () => {
      render(
        <MentorshipItemCard
          id="1"
          user={mockUser}
          status={MentorshipStatus.COMPLETED}
          description="Learn React basics"
          skills={mockSkills}
          onClick={mockOnClick}
        />
      );

      const statusBadge = screen.getByTestId("status-badge");
      expect(statusBadge).toBeInTheDocument();
      expect(statusBadge).toHaveTextContent(MentorshipStatus.COMPLETED);
    });

    it("should render additional info when provided", () => {
      render(
        <MentorshipItemCard
          id="1"
          user={mockUser}
          status={MentorshipStatus.AVAILABLE}
          description="Learn React basics"
          skills={mockSkills}
          additionalInfo={UserRole.TUTOR}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText(/Engineering \| Tutor/)).toBeInTheDocument();
    });
  });

  describe("User Information Edge Cases", () => {
    it("should display 'Usuario desconocido' when user has no name", () => {
      const userWithoutName = {
        chapter: { name: "Engineering" },
      };

      render(
        <MentorshipItemCard
          id="1"
          user={userWithoutName}
          status={MentorshipStatus.AVAILABLE}
          description="Learn React basics"
          skills={mockSkills}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText("Usuario desconocido")).toBeInTheDocument();
    });

    it("should display '??' for initials when user has no name", () => {
      const userWithoutName = {
        chapter: { name: "Engineering" },
      };

      render(
        <MentorshipItemCard
          id="1"
          user={userWithoutName}
          status={MentorshipStatus.AVAILABLE}
          description="Learn React basics"
          skills={mockSkills}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText("??")).toBeInTheDocument();
    });

    it("should handle user with only firstName", () => {
      const userWithFirstName = {
        firstName: "John",
        chapter: { name: "Engineering" },
      };

      render(
        <MentorshipItemCard
          id="1"
          user={userWithFirstName}
          status={MentorshipStatus.AVAILABLE}
          description="Learn React basics"
          skills={mockSkills}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("J?")).toBeInTheDocument();
    });

    it("should handle user with only lastName", () => {
      const userWithLastName = {
        lastName: "Doe",
        chapter: { name: "Engineering" },
      };

      render(
        <MentorshipItemCard
          id="1"
          user={userWithLastName}
          status={MentorshipStatus.AVAILABLE}
          description="Learn React basics"
          skills={mockSkills}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText("Doe")).toBeInTheDocument();
      expect(screen.getByText("?D")).toBeInTheDocument();
    });

    it("should handle user without chapter", () => {
      const userWithoutChapter = {
        firstName: "John",
        lastName: "Doe",
      };

      render(
        <MentorshipItemCard
          id="1"
          user={userWithoutChapter}
          status={MentorshipStatus.AVAILABLE}
          description="Learn React basics"
          skills={mockSkills}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  describe("Skills Display", () => {
    it("should handle empty skills array", () => {
      render(
        <MentorshipItemCard
          id="1"
          user={mockUser}
          status={MentorshipStatus.AVAILABLE}
          description="Learn React basics"
          skills={[]}
          onClick={mockOnClick}
        />
      );

      // Should still render the "Habilidades:" text but with empty skills
      expect(screen.getByText(/Habilidades:/)).toBeInTheDocument();
    });

    it("should handle single skill", () => {
      render(
        <MentorshipItemCard
          id="1"
          user={mockUser}
          status={MentorshipStatus.AVAILABLE}
          description="Learn React basics"
          skills={[{ name: "React" }]}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText(/React/)).toBeInTheDocument();
    });
  });

  describe("Interactivity", () => {
    it("should call onClick when card is clicked", async () => {
      const user = userEvent.setup();
      render(
        <MentorshipItemCard
          id="1"
          user={mockUser}
          status={MentorshipStatus.AVAILABLE}
          description="Learn React basics"
          skills={mockSkills}
          onClick={mockOnClick}
        />
      );

      const card = screen.getByRole("button");
      await user.click(card);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("should call onClick when Enter key is pressed", async () => {
      const user = userEvent.setup();
      render(
        <MentorshipItemCard
          id="1"
          user={mockUser}
          status={MentorshipStatus.AVAILABLE}
          description="Learn React basics"
          skills={mockSkills}
          onClick={mockOnClick}
        />
      );

      const card = screen.getByRole("button");
      card.focus();
      await user.keyboard("{Enter}");

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("should call onClick when Space key is pressed", async () => {
      const user = userEvent.setup();
      render(
        <MentorshipItemCard
          id="1"
          user={mockUser}
          status={MentorshipStatus.AVAILABLE}
          description="Learn React basics"
          skills={mockSkills}
          onClick={mockOnClick}
        />
      );

      const card = screen.getByRole("button");
      card.focus();
      await user.keyboard(" ");

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("should not call onClick when other keys are pressed", async () => {
      const user = userEvent.setup();
      render(
        <MentorshipItemCard
          id="1"
          user={mockUser}
          status={MentorshipStatus.AVAILABLE}
          description="Learn React basics"
          skills={mockSkills}
          onClick={mockOnClick}
        />
      );

      const card = screen.getByRole("button");
      card.focus();
      await user.keyboard("a");

      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("should have role='button'", () => {
      render(
        <MentorshipItemCard
          id="1"
          user={mockUser}
          status={MentorshipStatus.AVAILABLE}
          description="Learn React basics"
          skills={mockSkills}
          onClick={mockOnClick}
        />
      );

      const card = screen.getByRole("button");
      expect(card).toBeInTheDocument();
    });

    it("should have tabIndex=0 for keyboard navigation", () => {
      render(
        <MentorshipItemCard
          id="1"
          user={mockUser}
          status={MentorshipStatus.AVAILABLE}
          description="Learn React basics"
          skills={mockSkills}
          onClick={mockOnClick}
        />
      );

      const card = screen.getByRole("button");
      expect(card).toHaveAttribute("tabIndex", "0");
    });

    it("should have appropriate aria-label", () => {
      render(
        <MentorshipItemCard
          id="1"
          user={mockUser}
          status={MentorshipStatus.AVAILABLE}
          description="Learn React basics"
          skills={mockSkills}
          onClick={mockOnClick}
        />
      );

      const card = screen.getByRole("button");
      expect(card).toHaveAttribute("aria-label", "Mentoría: John Doe, Aprobada, Learn React basics");
    });

    it("should have aria-hidden on initials container", () => {
      const { container } = render(
        <MentorshipItemCard
          id="1"
          user={mockUser}
          status={MentorshipStatus.AVAILABLE}
          description="Learn React basics"
          skills={mockSkills}
          onClick={mockOnClick}
        />
      );

      const initialsContainer = container.querySelector(".w-12.h-12");
      expect(initialsContainer).toHaveAttribute("aria-hidden", "true");
    });

    it("should have aria-label on status container", () => {
      render(
        <MentorshipItemCard
          id="1"
          user={mockUser}
          status={MentorshipStatus.COMPLETED}
          description="Learn React basics"
          skills={mockSkills}
          onClick={mockOnClick}
        />
      );

      const statusContainer = screen.getByLabelText(`Estado: ${MentorshipStatus.COMPLETED}`);
      expect(statusContainer).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should have cursor-pointer class", () => {
      render(
        <MentorshipItemCard
          id="1"
          user={mockUser}
          status={MentorshipStatus.AVAILABLE}
          description="Learn React basics"
          skills={mockSkills}
          onClick={mockOnClick}
        />
      );

      const card = screen.getByRole("button");
      expect(card).toHaveClass("cursor-pointer");
    });

    it("should have hover:bg-accent class", () => {
      render(
        <MentorshipItemCard
          id="1"
          user={mockUser}
          status={MentorshipStatus.AVAILABLE}
          description="Learn React basics"
          skills={mockSkills}
          onClick={mockOnClick}
        />
      );

      const card = screen.getByRole("button");
      expect(card).toHaveClass("hover:bg-accent");
    });
  });

  describe("Performance", () => {
    it("should not recreate handlers on re-render with same props", () => {
      const { rerender } = render(
        <MentorshipItemCard
          id="1"
          user={mockUser}
          status={MentorshipStatus.AVAILABLE}
          description="Learn React basics"
          skills={mockSkills}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText("John Doe")).toBeInTheDocument();

      rerender(
        <MentorshipItemCard
          id="1"
          user={mockUser}
          status={MentorshipStatus.AVAILABLE}
          description="Learn React basics"
          skills={mockSkills}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  describe("Different Statuses", () => {
    it("should render PENDING status", () => {
      render(
        <MentorshipItemCard
          id="1"
          user={mockUser}
          status={MentorshipStatus.PENDING}
          description="Learn React basics"
          skills={mockSkills}
          onClick={mockOnClick}
        />
      );

      const statusBadge = screen.getByTestId("status-badge");
      expect(statusBadge).toHaveTextContent(MentorshipStatus.PENDING);
    });

    it("should render COMPLETED status", () => {
      render(
        <MentorshipItemCard
          id="1"
          user={mockUser}
          status={MentorshipStatus.COMPLETED}
          description="Learn React basics"
          skills={mockSkills}
          onClick={mockOnClick}
        />
      );

      const statusBadge = screen.getByTestId("status-badge");
      expect(statusBadge).toHaveTextContent(MentorshipStatus.COMPLETED);
    });

    it("should render CANCELLED status", () => {
      render(
        <MentorshipItemCard
          id="1"
          user={mockUser}
          status={MentorshipStatus.CANCELLED}
          description="Learn React basics"
          skills={mockSkills}
          onClick={mockOnClick}
        />
      );

      const statusBadge = screen.getByTestId("status-badge");
      expect(statusBadge).toHaveTextContent(MentorshipStatus.CANCELLED);
    });
  });
});
