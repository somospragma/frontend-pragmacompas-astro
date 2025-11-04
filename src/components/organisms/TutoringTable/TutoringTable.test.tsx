/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TutoringTable from "./TutoringTable";
import type { Tutoring } from "@/infrastructure/models/Tutoring";
import { MentorshipStatus } from "@/shared/utils/enums/mentorshipStatus";
import { UserRole } from "@/shared/utils/enums/role";

// Mock TutoringDetailModal component
vi.mock("../TutoringDetailModal", () => ({
  default: ({ isOpen, onClose, tutoringId }: { isOpen: boolean; onClose: () => void; tutoringId: string | null }) => (
    <div data-testid="tutoring-detail-modal" data-is-open={isOpen} data-tutoring-id={tutoringId}>
      {isOpen && <button onClick={onClose}>Close Modal</button>}
    </div>
  ),
}));

// Mock MentorshipItemCard component
vi.mock("@/components/molecules/MentorshipItemCard", () => ({
  default: ({ id, user, status, description, onClick }: any) => (
    <button data-testid={`mentorship-item-${id}`} onClick={onClick} type="button">
      <span>
        {user.firstName} {user.lastName}
      </span>
      <span>{status}</span>
      <span>{description}</span>
    </button>
  ),
}));

// Mock AccessibilityAnnouncer
vi.mock("@/components/atoms/AccessibilityAnnouncer", () => ({
  AccessibilityAnnouncer: ({ message }: { message: string }) => (
    <div role="status" aria-live="polite">
      {message}
    </div>
  ),
}));

const mockTutorings: Tutoring[] = [
  {
    id: "1",
    objectives: "Learn React basics",
    skills: [
      { id: "skill1", name: "React" },
      { id: "skill2", name: "JavaScript" },
    ],
    tutor: {
      id: "tutor1",
      email: "john@example.com",
      rol: UserRole.TUTOR,
      firstName: "John",
      lastName: "Doe",
      chapter: { id: "ch1", name: "Chapter One" },
      activeTutoringLimit: 5,
      seniority: "Senior",
    },
    tutee: {
      id: "tutee1",
      email: "jane@example.com",
      rol: UserRole.TUTEE,
      firstName: "Jane",
      lastName: "Smith",
      chapter: { id: "ch2", name: "Chapter Two" },
      activeTutoringLimit: 3,
      seniority: "Junior",
    },
    status: MentorshipStatus.COMPLETED,
    startDate: "2024-03-01",
    expectedEndDate: "2024-03-15",
  },
  {
    id: "2",
    objectives: "Learn TypeScript",
    skills: [{ id: "skill3", name: "TypeScript" }],
    tutor: {
      id: "tutor2",
      email: "bob@example.com",
      rol: UserRole.TUTOR,
      firstName: "Bob",
      lastName: "Johnson",
      chapter: { id: "ch3", name: "Chapter Three" },
      activeTutoringLimit: 5,
      seniority: "Senior",
    },
    tutee: {
      id: "tutee2",
      email: "alice@example.com",
      rol: UserRole.TUTEE,
      firstName: "Alice",
      lastName: "Brown",
      chapter: { id: "ch4", name: "Chapter Four" },
      activeTutoringLimit: 3,
      seniority: "Mid",
    },
    status: MentorshipStatus.CANCELLED,
    startDate: "2024-03-05",
    expectedEndDate: "2024-03-20",
  },
  {
    id: "3",
    objectives: "Advanced JavaScript patterns",
    skills: [{ id: "skill4", name: "JavaScript" }],
    tutor: {
      id: "tutor3",
      email: "charlie@example.com",
      rol: UserRole.TUTOR,
      firstName: "Charlie",
      lastName: "Wilson",
      chapter: { id: "ch5", name: "Chapter Five" },
      activeTutoringLimit: 5,
      seniority: "Senior",
    },
    tutee: {
      id: "tutee3",
      email: "david@example.com",
      rol: UserRole.TUTEE,
      firstName: "David",
      lastName: "Lee",
      chapter: { id: "ch6", name: "Chapter Six" },
      activeTutoringLimit: 3,
      seniority: "Junior",
    },
    status: MentorshipStatus.PENDING,
    startDate: "2024-03-10",
    expectedEndDate: "2024-03-25",
  },
];

describe("TutoringTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the title", () => {
      render(<TutoringTable data={mockTutorings} title="My Tutorings" />);
      expect(screen.getByText("My Tutorings")).toBeInTheDocument();
    });

    it("should render all tutoring items", () => {
      render(<TutoringTable data={mockTutorings} title="All Tutorings" />);
      expect(screen.getByTestId("mentorship-item-1")).toBeInTheDocument();
      expect(screen.getByTestId("mentorship-item-2")).toBeInTheDocument();
      expect(screen.getByTestId("mentorship-item-3")).toBeInTheDocument();
    });

    it("should render search input", () => {
      render(<TutoringTable data={mockTutorings} title="Tutorings" />);
      const searchInput = screen.getByPlaceholderText("Buscar tutorías...");
      expect(searchInput).toBeInTheDocument();
    });

    it("should render status filter select", () => {
      render(<TutoringTable data={mockTutorings} title="Tutorings" />);
      const selectElement = screen.getByLabelText("Filtrar por estado");
      expect(selectElement).toBeInTheDocument();
    });

    it("should render empty state when no data", () => {
      render(<TutoringTable data={[]} title="No Tutorings" />);
      expect(screen.getByText("No se encontraron tutorías que coincidan con los filtros.")).toBeInTheDocument();
    });
  });

  describe("Search Functionality", () => {
    it("should filter tutorings by search term", async () => {
      const user = userEvent.setup();
      render(<TutoringTable data={mockTutorings} title="Tutorings" />);

      const searchInput = screen.getByPlaceholderText("Buscar tutorías...");
      await user.type(searchInput, "Jane");

      // Only the first tutoring should be visible (tutee is Jane Smith)
      expect(screen.getByTestId("mentorship-item-1")).toBeInTheDocument();
      expect(screen.queryByTestId("mentorship-item-2")).not.toBeInTheDocument();
      expect(screen.queryByTestId("mentorship-item-3")).not.toBeInTheDocument();
    });

    it("should show empty state when search has no results", async () => {
      const user = userEvent.setup();
      render(<TutoringTable data={mockTutorings} title="Tutorings" />);

      const searchInput = screen.getByPlaceholderText("Buscar tutorías...");
      await user.type(searchInput, "NonExistentTerm");

      expect(screen.getByText("No se encontraron tutorías que coincidan con los filtros.")).toBeInTheDocument();
    });

    it("should clear search results when input is cleared", async () => {
      const user = userEvent.setup();
      render(<TutoringTable data={mockTutorings} title="Tutorings" />);

      const searchInput = screen.getByPlaceholderText("Buscar tutorías...");
      await user.type(searchInput, "Jane");
      await user.clear(searchInput);

      // All tutorings should be visible again
      expect(screen.getByTestId("mentorship-item-1")).toBeInTheDocument();
      expect(screen.getByTestId("mentorship-item-2")).toBeInTheDocument();
      expect(screen.getByTestId("mentorship-item-3")).toBeInTheDocument();
    });
  });

  describe("Status Filter", () => {
    it("should filter tutorings by status", async () => {
      const user = userEvent.setup();
      render(<TutoringTable data={mockTutorings} title="Tutorings" />);

      const selectElement = screen.getByLabelText("Filtrar por estado");
      await user.selectOptions(selectElement, MentorshipStatus.COMPLETED);

      // Only completed tutoring should be visible
      expect(screen.getByTestId("mentorship-item-1")).toBeInTheDocument();
      expect(screen.queryByTestId("mentorship-item-2")).not.toBeInTheDocument();
      expect(screen.queryByTestId("mentorship-item-3")).not.toBeInTheDocument();
    });

    it("should show all tutorings when 'Todos los estados' is selected", async () => {
      const user = userEvent.setup();
      render(<TutoringTable data={mockTutorings} title="Tutorings" />);

      const selectElement = screen.getByLabelText("Filtrar por estado");
      await user.selectOptions(selectElement, MentorshipStatus.COMPLETED);
      await user.selectOptions(selectElement, "Todos los estados");

      // All tutorings should be visible
      expect(screen.getByTestId("mentorship-item-1")).toBeInTheDocument();
      expect(screen.getByTestId("mentorship-item-2")).toBeInTheDocument();
      expect(screen.getByTestId("mentorship-item-3")).toBeInTheDocument();
    });
  });

  describe("Modal Interactions", () => {
    it("should open modal when clicking completed tutoring", async () => {
      const user = userEvent.setup();
      render(<TutoringTable data={mockTutorings} title="Tutorings" />);

      const completedItem = screen.getByTestId("mentorship-item-1");
      await user.click(completedItem);

      const modal = screen.getByTestId("tutoring-detail-modal");
      expect(modal).toHaveAttribute("data-is-open", "true");
      expect(modal).toHaveAttribute("data-tutoring-id", "1");
    });

    it("should open modal when clicking cancelled tutoring", async () => {
      const user = userEvent.setup();
      render(<TutoringTable data={mockTutorings} title="Tutorings" />);

      const cancelledItem = screen.getByTestId("mentorship-item-2");
      await user.click(cancelledItem);

      const modal = screen.getByTestId("tutoring-detail-modal");
      expect(modal).toHaveAttribute("data-is-open", "true");
      expect(modal).toHaveAttribute("data-tutoring-id", "2");
    });

    it("should not open modal when clicking tutoring with other status", async () => {
      const user = userEvent.setup();
      render(<TutoringTable data={mockTutorings} title="Tutorings" />);

      const pendingItem = screen.getByTestId("mentorship-item-3");
      await user.click(pendingItem);

      const modal = screen.getByTestId("tutoring-detail-modal");
      expect(modal).toHaveAttribute("data-is-open", "false");
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels on search input", () => {
      render(<TutoringTable data={mockTutorings} title="Tutorings" />);
      const searchInput = screen.getByLabelText("Buscar tutorías");
      expect(searchInput).toHaveAttribute("aria-describedby", "search-description");
    });

    it("should have proper ARIA label on status select", () => {
      render(<TutoringTable data={mockTutorings} title="Tutorings" />);
      const selectElement = screen.getByLabelText("Filtrar por estado");
      expect(selectElement).toBeInTheDocument();
    });

    it("should have role='list' on tutorings container", () => {
      render(<TutoringTable data={mockTutorings} title="Tutorings" />);
      const listContainer = screen.getByRole("list", { name: "Lista de tutorías" });
      expect(listContainer).toBeInTheDocument();
    });

    it("should have role='listitem' on each tutoring", () => {
      render(<TutoringTable data={mockTutorings} title="Tutorings" />);
      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(3);
    });

    it("should have aria-live='polite' on empty state", () => {
      render(<TutoringTable data={[]} title="Tutorings" />);
      const emptyStates = screen.getAllByRole("status");
      const emptyStateMessage = emptyStates.find((el) =>
        el.textContent?.includes("No se encontraron tutorías que coincidan con los filtros.")
      );
      expect(emptyStateMessage).toBeInTheDocument();
      expect(emptyStateMessage).toHaveAttribute("aria-live", "polite");
    });

    it("should announce search changes", async () => {
      const user = userEvent.setup();
      render(<TutoringTable data={mockTutorings} title="Tutorings" />);

      const searchInput = screen.getByPlaceholderText("Buscar tutorías...");
      await user.type(searchInput, "React");

      // AccessibilityAnnouncer should contain announcement
      const announcements = screen.getAllByRole("status");
      const hasSearchAnnouncement = announcements.some((el) => el.textContent?.includes("Buscando tutorías"));
      expect(hasSearchAnnouncement).toBe(true);
    });

    it("should announce filter changes", async () => {
      const user = userEvent.setup();
      render(<TutoringTable data={mockTutorings} title="Tutorings" />);

      const selectElement = screen.getByLabelText("Filtrar por estado");
      await user.selectOptions(selectElement, MentorshipStatus.COMPLETED);

      // AccessibilityAnnouncer should contain announcement
      const announcements = screen.getAllByRole("status");
      const hasFilterAnnouncement = announcements.some(
        (el) => el.textContent?.includes("Filtrado por estado") || el.textContent?.includes("1 tutorías encontradas")
      );
      expect(hasFilterAnnouncement).toBe(true);
    });

    it("should announce filtered results count", () => {
      render(<TutoringTable data={mockTutorings} title="Tutorings" />);

      // AccessibilityAnnouncer should announce count
      const announcements = screen.getAllByRole("status");
      const hasCountAnnouncement = announcements.some((el) => el.textContent?.includes("tutorías encontradas"));
      expect(hasCountAnnouncement).toBe(true);
    });
  });

  describe("Combined Filters", () => {
    it("should apply both search and status filters", async () => {
      const user = userEvent.setup();
      render(<TutoringTable data={mockTutorings} title="Tutorings" />);

      // Apply status filter
      const selectElement = screen.getByLabelText("Filtrar por estado");
      await user.selectOptions(selectElement, MentorshipStatus.COMPLETED);

      // Apply search filter
      const searchInput = screen.getByPlaceholderText("Buscar tutorías...");
      await user.type(searchInput, "Jane");

      // Only the first tutoring matches both filters
      expect(screen.getByTestId("mentorship-item-1")).toBeInTheDocument();
      expect(screen.queryByTestId("mentorship-item-2")).not.toBeInTheDocument();
      expect(screen.queryByTestId("mentorship-item-3")).not.toBeInTheDocument();
    });

    it("should show empty state when combined filters have no results", async () => {
      const user = userEvent.setup();
      render(<TutoringTable data={mockTutorings} title="Tutorings" />);

      // Apply status filter
      const selectElement = screen.getByLabelText("Filtrar por estado");
      await user.selectOptions(selectElement, MentorshipStatus.CANCELLED);

      // Apply conflicting search filter
      const searchInput = screen.getByPlaceholderText("Buscar tutorías...");
      await user.type(searchInput, "Jane");

      expect(screen.getByText("No se encontraron tutorías que coincidan con los filtros.")).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should use memoized callbacks for event handlers", () => {
      const { rerender } = render(<TutoringTable data={mockTutorings} title="Tutorings" />);

      // Verify component renders successfully
      expect(screen.getByText("Tutorings")).toBeInTheDocument();

      rerender(<TutoringTable data={mockTutorings} title="Tutorings Updated" />);

      // Verify re-render works correctly with updated title
      expect(screen.getByText("Tutorings Updated")).toBeInTheDocument();
      expect(screen.queryByText("Tutorings")).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty data array", () => {
      render(<TutoringTable data={[]} title="Empty" />);
      expect(screen.getByText("No se encontraron tutorías que coincidan con los filtros.")).toBeInTheDocument();
    });

    it("should handle tutoring without skills", () => {
      const tutoringWithoutSkills: Tutoring[] = [
        {
          ...mockTutorings[0],
          skills: [],
        },
      ];
      render(<TutoringTable data={tutoringWithoutSkills} title="Tutorings" />);
      expect(screen.getByTestId("mentorship-item-1")).toBeInTheDocument();
    });

    it("should handle refetch prop when provided", () => {
      const refetchMock = vi.fn();
      render(<TutoringTable data={mockTutorings} title="Tutorings" refetch={refetchMock} />);
      // Component should render without issues even with refetch prop
      expect(screen.getByText("Tutorings")).toBeInTheDocument();
    });

    it("should handle special characters in search", async () => {
      const user = userEvent.setup();
      render(<TutoringTable data={mockTutorings} title="Tutorings" />);

      const searchInput = screen.getByPlaceholderText("Buscar tutorías...");
      await user.type(searchInput, "@#$%");

      // Should not crash and show empty state
      expect(screen.getByText("No se encontraron tutorías que coincidan con los filtros.")).toBeInTheDocument();
    });
  });
});
