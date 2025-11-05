import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TableCellRenderer } from "./TableCellRenderer";
import type { TableColumn, MentorshipData } from "@/shared/config/historyTableConfig";
import { MentorshipStatus } from "@/shared/utils/enums/mentorshipStatus";
import { UserRole } from "@/shared/utils/enums/role";

// Mock dependencies
vi.mock("@/components/ui/badge", () => ({
  Badge: ({ children, variant, className }: { children: React.ReactNode; variant: string; className: string }) => (
    <span data-testid="badge" className={className} data-variant={variant}>
      {children}
    </span>
  ),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    variant,
    size,
    onClick,
    "aria-label": ariaLabel,
  }: {
    children: React.ReactNode;
    variant: string;
    size: string;
    onClick: () => void;
    "aria-label": string;
  }) => (
    <button data-testid="button" data-variant={variant} data-size={size} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  ),
}));

vi.mock("@/shared/utils/helpers/tableCellStyles", () => ({
  getStatusBadgeClasses: (status: string) => `status-${status}`,
  getVariantButtonClasses: (action: string) => `variant-${action.toLowerCase()}`,
}));

vi.mock("@/shared/utils/helpers/displayStatus", () => ({
  displayStatus: (status: string) => status,
}));

describe("TableCellRenderer", () => {
  const mockMentorship: MentorshipData = {
    id: "1",
    type: "mentorship",
    myRole: UserRole.TUTEE,
    tutee: {
      name: "John Doe",
      email: "john@example.com",
      role: UserRole.TUTEE,
      id: "tutee-1",
    },
    tutor: {
      name: "Jane Smith",
      email: "jane@example.com",
      role: UserRole.TUTOR,
      id: "tutor-1",
    },
    status: MentorshipStatus.ACTIVE,
    startDate: "2023-01-01",
    chapter: "Frontend",
    skills: ["React", "TypeScript"],
    action: ["Edit", "Delete"],
  };

  const mockOnActionClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Badge cell type", () => {
    const badgeColumn: TableColumn = {
      key: "status",
      label: "Status",
      cellType: "badge",
    };

    it("should render badge with correct status", () => {
      render(
        <TableCellRenderer
          value={MentorshipStatus.ACTIVE}
          column={badgeColumn}
          row={mockMentorship}
          onActionClick={mockOnActionClick}
        />
      );

      const badge = screen.getByTestId("badge");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent("Activa");
      expect(badge).toHaveClass("status-Activa");
    });

    it("should handle invalid badge value", () => {
      render(
        <TableCellRenderer
          value={123 as unknown as string}
          column={badgeColumn}
          row={mockMentorship}
          onActionClick={mockOnActionClick}
        />
      );

      expect(screen.getByText("Invalid value")).toBeInTheDocument();
    });

    it("should apply correct CSS classes to badge", () => {
      render(<TableCellRenderer value={MentorshipStatus.PENDING} column={badgeColumn} row={mockMentorship} />);

      const badge = screen.getByTestId("badge");
      expect(badge).toHaveClass("font-medium", "px-3", "py-1", "rounded-full", "text-xs");
    });
  });

  describe("Skills cell type", () => {
    const skillsColumn: TableColumn = {
      key: "skills",
      label: "Skills",
      cellType: "skills",
    };

    it("should render skills list correctly", () => {
      const skills = ["React", "TypeScript", "Node.js"];
      render(<TableCellRenderer value={skills} column={skillsColumn} row={mockMentorship} />);

      skills.forEach((skill) => {
        expect(screen.getByText(new RegExp(skill))).toBeInTheDocument();
      });
    });

    it("should handle single skill", () => {
      const skills = ["React"];
      render(<TableCellRenderer value={skills} column={skillsColumn} row={mockMentorship} />);

      expect(screen.getByText("React")).toBeInTheDocument();
    });

    it("should handle empty skills array", () => {
      const { container } = render(<TableCellRenderer value={[]} column={skillsColumn} row={mockMentorship} />);

      const skillsContainer = container.querySelector(".flex.flex-col.gap-1");
      expect(skillsContainer).toBeInTheDocument();
      expect(skillsContainer).toBeEmptyDOMElement();
    });

    it("should handle invalid skills value", () => {
      render(<TableCellRenderer value="not-an-array" column={skillsColumn} row={mockMentorship} />);

      expect(screen.getByText("Invalid value")).toBeInTheDocument();
    });
  });

  describe("Button cell type", () => {
    const buttonColumn: TableColumn = {
      key: "actions",
      label: "Actions",
      cellType: "button",
    };

    it("should render single button", () => {
      render(
        <TableCellRenderer value="Edit" column={buttonColumn} row={mockMentorship} onActionClick={mockOnActionClick} />
      );

      const button = screen.getByTestId("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Edit");
      expect(button).toHaveAttribute("aria-label", "Edit");
    });

    it("should call onActionClick when button is clicked", () => {
      render(
        <TableCellRenderer
          value="Delete"
          column={buttonColumn}
          row={mockMentorship}
          onActionClick={mockOnActionClick}
        />
      );

      const button = screen.getByTestId("button");
      fireEvent.click(button);

      expect(mockOnActionClick).toHaveBeenCalledWith("Delete", mockMentorship);
    });

    it("should render multiple buttons from array", () => {
      const actions = ["Edit", "Delete", "View"];
      render(
        <TableCellRenderer
          value={actions}
          column={buttonColumn}
          row={mockMentorship}
          onActionClick={mockOnActionClick}
        />
      );

      const buttons = screen.getAllByTestId("button");
      expect(buttons).toHaveLength(3);

      actions.forEach((action, index) => {
        expect(buttons[index]).toHaveTextContent(action);
      });
    });

    it("should handle empty button array", () => {
      render(
        <TableCellRenderer value={[]} column={buttonColumn} row={mockMentorship} onActionClick={mockOnActionClick} />
      );

      expect(screen.queryByTestId("button")).not.toBeInTheDocument();
    });

    it("should handle empty string button value", () => {
      render(
        <TableCellRenderer value="" column={buttonColumn} row={mockMentorship} onActionClick={mockOnActionClick} />
      );

      expect(screen.queryByTestId("button")).not.toBeInTheDocument();
    });

    it("should handle invalid button value", () => {
      render(
        <TableCellRenderer
          value={123 as unknown as string}
          column={buttonColumn}
          row={mockMentorship}
          onActionClick={mockOnActionClick}
        />
      );

      expect(screen.getByText("Invalid value")).toBeInTheDocument();
    });

    it("should work without onActionClick callback", () => {
      render(<TableCellRenderer value="Edit" column={buttonColumn} row={mockMentorship} />);

      const button = screen.getByTestId("button");
      expect(() => fireEvent.click(button)).not.toThrow();
    });
  });

  describe("Text cell type", () => {
    const textColumn: TableColumn = {
      key: "name",
      label: "Name",
      cellType: "text",
      className: "custom-class",
    };

    it("should render text value", () => {
      render(<TableCellRenderer value="John Doe" column={textColumn} row={mockMentorship} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(<TableCellRenderer value="Test text" column={textColumn} row={mockMentorship} />);

      const span = screen.getByText("Test text");
      expect(span).toHaveClass("custom-class");
    });

    it("should handle invalid text value", () => {
      render(<TableCellRenderer value={123 as unknown as string} column={textColumn} row={mockMentorship} />);

      expect(screen.getByText("Invalid value")).toBeInTheDocument();
    });
  });

  describe("Default case", () => {
    const defaultColumn: TableColumn = {
      key: "default",
      label: "Default",
    };

    it("should render as text when no cellType specified", () => {
      render(<TableCellRenderer value="Default text" column={defaultColumn} row={mockMentorship} />);

      expect(screen.getByText("Default text")).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("should handle column without className", () => {
      const columnWithoutClass: TableColumn = {
        key: "test",
        label: "Test",
        cellType: "text",
      };

      render(<TableCellRenderer value="Test" column={columnWithoutClass} row={mockMentorship} />);

      expect(screen.getByText("Test")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should provide proper aria-label for buttons", () => {
      const buttonColumn: TableColumn = {
        key: "actions",
        label: "Actions",
        cellType: "button",
      };

      render(
        <TableCellRenderer
          value="Approve"
          column={buttonColumn}
          row={mockMentorship}
          onActionClick={mockOnActionClick}
        />
      );

      const button = screen.getByTestId("button");
      expect(button).toHaveAttribute("aria-label", "Approve");
    });

    it("should maintain accessibility for multiple buttons", () => {
      const buttonColumn: TableColumn = {
        key: "actions",
        label: "Actions",
        cellType: "button",
      };

      const actions = ["Edit", "Delete"];
      render(
        <TableCellRenderer
          value={actions}
          column={buttonColumn}
          row={mockMentorship}
          onActionClick={mockOnActionClick}
        />
      );

      const buttons = screen.getAllByTestId("button");
      expect(buttons[0]).toHaveAttribute("aria-label", "Edit");
      expect(buttons[1]).toHaveAttribute("aria-label", "Delete");
    });
  });
});
