import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeedbackCard } from "./FeedbackCard";
import { UserRole } from "@/shared/utils/enums/role";
import type { FeedbackWithRole } from "@/shared/utils/helpers/feedbackHelpers";

// Mock dateAdapter
vi.mock("@/infrastructure/adapters/dateAdapter/dateAdapter", () => ({
  dateAdapter: () => ({
    format: () => {
      // Simple mock that returns a formatted date string
      return "15 de Marzo, 2024";
    },
  }),
}));

const mockFeedback: FeedbackWithRole = {
  id: "feedback1",
  score: "4.5",
  comments: "Great mentoring session! Very helpful and insightful.",
  evaluationDate: "2024-03-15T10:00:00Z",
  evaluator: {
    id: "evaluator1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    rol: UserRole.TUTOR,
    chapter: { id: "ch1", name: "Engineering" },
    activeTutoringLimit: 5,
    seniority: "Senior",
  },
  tutoring: {
    id: "tutoring1",
    tutor: {
      id: "tutor1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      rol: UserRole.TUTOR,
      chapter: { id: "ch1", name: "Engineering" },
      activeTutoringLimit: 5,
      seniority: "Senior",
    },
    tutee: {
      id: "tutee1",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      rol: UserRole.TUTEE,
      chapter: { id: "ch2", name: "Design" },
      activeTutoringLimit: 3,
      seniority: "Junior",
    },
    skills: [],
  },
  evaluatorRole: UserRole.TUTOR,
};

const mockRenderStars = vi.fn((score: number) => (
  <div data-testid="stars-container">
    {Array.from({ length: 5 }).map((_, index) => (
      <span key={index} data-testid={`star-${index}`}>
        {index < Math.floor(score) ? "★" : "☆"}
      </span>
    ))}
  </div>
));

describe("FeedbackCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render evaluator name", () => {
      render(<FeedbackCard feedback={mockFeedback} role={UserRole.TUTOR} renderStars={mockRenderStars} />);

      expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    });

    it("should render role in title", () => {
      render(<FeedbackCard feedback={mockFeedback} role={UserRole.TUTOR} renderStars={mockRenderStars} />);

      expect(screen.getByText(/Feedback del Tutor/)).toBeInTheDocument();
    });

    it("should render feedback comments", () => {
      render(<FeedbackCard feedback={mockFeedback} role={UserRole.TUTOR} renderStars={mockRenderStars} />);

      expect(screen.getByText(mockFeedback.comments)).toBeInTheDocument();
    });

    it("should render score", () => {
      render(<FeedbackCard feedback={mockFeedback} role={UserRole.TUTOR} renderStars={mockRenderStars} />);

      expect(screen.getByText("4.5/5")).toBeInTheDocument();
    });

    it("should render formatted date", () => {
      render(<FeedbackCard feedback={mockFeedback} role={UserRole.TUTOR} renderStars={mockRenderStars} />);

      expect(screen.getByText("15 de Marzo, 2024")).toBeInTheDocument();
    });

    it("should call renderStars with correct score", () => {
      render(<FeedbackCard feedback={mockFeedback} role={UserRole.TUTOR} renderStars={mockRenderStars} />);

      expect(mockRenderStars).toHaveBeenCalledWith(4.5);
    });

    it("should render stars container", () => {
      render(<FeedbackCard feedback={mockFeedback} role={UserRole.TUTOR} renderStars={mockRenderStars} />);

      expect(screen.getByTestId("stars-container")).toBeInTheDocument();
    });
  });

  describe("Different Roles", () => {
    it("should render correctly for TUTEE role", () => {
      render(<FeedbackCard feedback={mockFeedback} role={UserRole.TUTEE} renderStars={mockRenderStars} />);

      expect(screen.getByText(/Feedback del Tutorado/)).toBeInTheDocument();
    });
  });

  describe("Score Variations", () => {
    it("should handle perfect score (5)", () => {
      const perfectFeedback = { ...mockFeedback, score: "5" };
      render(<FeedbackCard feedback={perfectFeedback} role={UserRole.TUTOR} renderStars={mockRenderStars} />);

      expect(screen.getByText("5/5")).toBeInTheDocument();
      expect(mockRenderStars).toHaveBeenCalledWith(5);
    });

    it("should handle low score (1.5)", () => {
      const lowScoreFeedback = { ...mockFeedback, score: "1.5" };
      render(<FeedbackCard feedback={lowScoreFeedback} role={UserRole.TUTOR} renderStars={mockRenderStars} />);

      expect(screen.getByText("1.5/5")).toBeInTheDocument();
      expect(mockRenderStars).toHaveBeenCalledWith(1.5);
    });

    it("should handle integer score (3)", () => {
      const integerScoreFeedback = { ...mockFeedback, score: "3" };
      render(<FeedbackCard feedback={integerScoreFeedback} role={UserRole.TUTOR} renderStars={mockRenderStars} />);

      expect(screen.getByText("3/5")).toBeInTheDocument();
      expect(mockRenderStars).toHaveBeenCalledWith(3);
    });
  });

  describe("Evaluator Name Variations", () => {
    it("should handle short names", () => {
      const shortNameFeedback = {
        ...mockFeedback,
        evaluator: { ...mockFeedback.evaluator, firstName: "Jo", lastName: "Li" },
      };
      render(<FeedbackCard feedback={shortNameFeedback} role={UserRole.TUTOR} renderStars={mockRenderStars} />);

      expect(screen.getByText(/Jo Li/)).toBeInTheDocument();
    });

    it("should handle long names", () => {
      const longNameFeedback = {
        ...mockFeedback,
        evaluator: {
          ...mockFeedback.evaluator,
          firstName: "Christopher",
          lastName: "Montgomery-Wellington",
        },
      };
      render(<FeedbackCard feedback={longNameFeedback} role={UserRole.TUTOR} renderStars={mockRenderStars} />);

      expect(screen.getByText(/Christopher Montgomery-Wellington/)).toBeInTheDocument();
    });
  });

  describe("Comments Variations", () => {
    it("should handle short comments", () => {
      const shortCommentFeedback = { ...mockFeedback, comments: "Good!" };
      render(<FeedbackCard feedback={shortCommentFeedback} role={UserRole.TUTOR} renderStars={mockRenderStars} />);

      expect(screen.getByText("Good!")).toBeInTheDocument();
    });

    it("should handle long comments", () => {
      const longComment =
        "This was an exceptionally detailed and comprehensive mentoring session that covered many important topics. " +
        "The mentor demonstrated excellent knowledge and patience throughout the entire session, " +
        "making complex concepts easy to understand.";
      const longCommentFeedback = { ...mockFeedback, comments: longComment };
      render(<FeedbackCard feedback={longCommentFeedback} role={UserRole.TUTOR} renderStars={mockRenderStars} />);

      expect(screen.getByText(longComment)).toBeInTheDocument();
    });

    it("should handle comments with special characters", () => {
      const specialCharFeedback = {
        ...mockFeedback,
        comments: "Great session! 🎉 Very helpful & insightful (100%)",
      };
      render(<FeedbackCard feedback={specialCharFeedback} role={UserRole.TUTOR} renderStars={mockRenderStars} />);

      expect(screen.getByText("Great session! 🎉 Very helpful & insightful (100%)")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have article element", () => {
      render(<FeedbackCard feedback={mockFeedback} role={UserRole.TUTOR} renderStars={mockRenderStars} />);

      const article = screen.getByRole("article");
      expect(article).toBeInTheDocument();
    });

    it("should have aria-label on article", () => {
      render(<FeedbackCard feedback={mockFeedback} role={UserRole.TUTOR} renderStars={mockRenderStars} />);

      const article = screen.getByRole("article");
      expect(article).toHaveAttribute("aria-label", "Feedback del Tutor: John Doe, puntuación 4.5 de 5");
    });

    it("should have role='img' on stars container", () => {
      render(<FeedbackCard feedback={mockFeedback} role={UserRole.TUTOR} renderStars={mockRenderStars} />);

      const starsContainer = screen.getByRole("img", { name: /Puntuación/ });
      expect(starsContainer).toBeInTheDocument();
    });

    it("should have aria-label on stars container", () => {
      render(<FeedbackCard feedback={mockFeedback} role={UserRole.TUTOR} renderStars={mockRenderStars} />);

      const starsContainer = screen.getByRole("img");
      expect(starsContainer).toHaveAttribute("aria-label", "Puntuación: 4.5 de 5 estrellas");
    });

    it("should have aria-hidden on score text", () => {
      const { container } = render(
        <FeedbackCard feedback={mockFeedback} role={UserRole.TUTOR} renderStars={mockRenderStars} />
      );

      const scoreText = container.querySelector('span[aria-hidden="true"]');
      expect(scoreText).toBeInTheDocument();
      expect(scoreText?.textContent).toBe("4.5/5");
    });

    it("should have time element with dateTime attribute", () => {
      render(<FeedbackCard feedback={mockFeedback} role={UserRole.TUTOR} renderStars={mockRenderStars} />);

      const timeElement = screen.getByText("15 de Marzo, 2024");
      expect(timeElement.tagName).toBe("TIME");
      expect(timeElement).toHaveAttribute("dateTime", mockFeedback.evaluationDate);
    });
  });

  describe("Styling", () => {
    it("should have correct background class", () => {
      render(<FeedbackCard feedback={mockFeedback} role={UserRole.TUTOR} renderStars={mockRenderStars} />);

      const article = screen.getByRole("article");
      expect(article).toHaveClass("bg-slate-800/30");
    });

    it("should have rounded border", () => {
      render(<FeedbackCard feedback={mockFeedback} role={UserRole.TUTOR} renderStars={mockRenderStars} />);

      const article = screen.getByRole("article");
      expect(article).toHaveClass("rounded-lg");
      expect(article).toHaveClass("border");
      expect(article).toHaveClass("border-slate-700/30");
    });

    it("should have padding", () => {
      render(<FeedbackCard feedback={mockFeedback} role={UserRole.TUTOR} renderStars={mockRenderStars} />);

      const article = screen.getByRole("article");
      expect(article).toHaveClass("p-4");
    });
  });

  describe("Performance", () => {
    it("should not recreate memoized values on re-render with same props", () => {
      const { rerender } = render(
        <FeedbackCard feedback={mockFeedback} role={UserRole.TUTOR} renderStars={mockRenderStars} />
      );

      expect(screen.getByRole("article")).toBeInTheDocument();

      rerender(<FeedbackCard feedback={mockFeedback} role={UserRole.TUTOR} renderStars={mockRenderStars} />);

      expect(screen.getByRole("article")).toBeInTheDocument();
      // renderStars should only be called once per render
      expect(mockRenderStars).toHaveBeenCalledTimes(2); // Once per render
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty comments", () => {
      const emptyCommentsFeedback = { ...mockFeedback, comments: "" };
      render(<FeedbackCard feedback={emptyCommentsFeedback} role={UserRole.TUTOR} renderStars={mockRenderStars} />);

      // Should still render the component without crashing
      expect(screen.getByRole("article")).toBeInTheDocument();
    });

    it("should handle zero score", () => {
      const zeroScoreFeedback = { ...mockFeedback, score: "0" };
      render(<FeedbackCard feedback={zeroScoreFeedback} role={UserRole.TUTOR} renderStars={mockRenderStars} />);

      expect(screen.getByText("0/5")).toBeInTheDocument();
      expect(mockRenderStars).toHaveBeenCalledWith(0);
    });
  });
});
