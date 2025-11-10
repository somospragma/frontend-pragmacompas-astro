import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TableEmptyState } from "./TableEmptyState";

// Mock the table components
vi.mock("@/components/ui/table", () => ({
  TableCell: ({ children, colSpan, className }: { children: React.ReactNode; colSpan: number; className: string }) => (
    <td colSpan={colSpan} className={className}>
      {children}
    </td>
  ),
  TableRow: ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>,
}));

// Mock the history table config
vi.mock("@/shared/config/historyTableConfig", () => ({
  HISTORY_TABLE_CONFIG: [
    { key: "col1", label: "Column 1" },
    { key: "col2", label: "Column 2" },
    { key: "col3", label: "Column 3" },
  ],
}));

describe("TableEmptyState", () => {
  describe("Rendering", () => {
    it("should render empty state message", () => {
      const message = "No data available";
      render(
        <table>
          <tbody>
            <TableEmptyState message={message} />
          </tbody>
        </table>
      );

      expect(screen.getByText(message)).toBeInTheDocument();
    });

    it("should render with correct table structure", () => {
      const message = "Empty table";
      render(
        <table>
          <tbody>
            <TableEmptyState message={message} />
          </tbody>
        </table>
      );

      const tableRow = screen.getByRole("row");
      const tableCell = screen.getByRole("cell");

      expect(tableRow).toBeInTheDocument();
      expect(tableCell).toBeInTheDocument();
    });

    it("should have correct colSpan based on config length", () => {
      const message = "No results found";
      render(
        <table>
          <tbody>
            <TableEmptyState message={message} />
          </tbody>
        </table>
      );

      const tableCell = screen.getByRole("cell");
      expect(tableCell).toHaveAttribute("colSpan", "3");
    });

    it("should apply correct CSS classes", () => {
      const message = "Empty state";
      render(
        <table>
          <tbody>
            <TableEmptyState message={message} />
          </tbody>
        </table>
      );

      const tableCell = screen.getByRole("cell");
      expect(tableCell).toHaveClass("text-center");
      expect(tableCell).toHaveClass("py-8");
      expect(tableCell).toHaveClass("text-muted-foreground");
    });
  });

  describe("Props validation", () => {
    it("should handle empty message", () => {
      const message = "";
      render(
        <table>
          <tbody>
            <TableEmptyState message={message} />
          </tbody>
        </table>
      );

      const tableCell = screen.getByRole("cell");
      expect(tableCell).toHaveTextContent("");
    });

    it("should handle long message", () => {
      const longMessage =
        "This is a very long message that should be displayed correctly in the empty state component without breaking the layout or causing any issues";
      render(
        <table>
          <tbody>
            <TableEmptyState message={longMessage} />
          </tbody>
        </table>
      );

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it("should handle message with special characters", () => {
      const specialMessage = "No results found! @#$%^&*()_+-={}[]|\\:;\"'<>?,./";
      render(
        <table>
          <tbody>
            <TableEmptyState message={specialMessage} />
          </tbody>
        </table>
      );

      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });
  });

  describe("Integration with Table Context", () => {
    it("should work within a complete table structure", () => {
      const message = "No mentorships found";
      render(
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <TableEmptyState message={message} />
          </tbody>
        </table>
      );

      expect(screen.getByText(message)).toBeInTheDocument();
      expect(screen.getByRole("table")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper semantic structure", () => {
      const message = "Accessible empty state";
      render(
        <table>
          <tbody>
            <TableEmptyState message={message} />
          </tbody>
        </table>
      );

      const tableRow = screen.getByRole("row");
      const tableCell = screen.getByRole("cell");

      expect(tableRow).toBeInTheDocument();
      expect(tableCell).toBeInTheDocument();
    });

    it("should be readable by screen readers", () => {
      const message = "No data to display";
      render(
        <table>
          <tbody>
            <TableEmptyState message={message} />
          </tbody>
        </table>
      );

      const tableCell = screen.getByRole("cell");
      expect(tableCell).toHaveTextContent(message);
      expect(tableCell).toBeVisible();
    });
  });

  describe("Edge cases", () => {
    it("should handle undefined HISTORY_TABLE_CONFIG", () => {
      // Mock undefined config
      vi.doMock("@/shared/config/historyTableConfig", () => ({
        HISTORY_TABLE_CONFIG: undefined,
      }));

      const message = "Config undefined test";
      render(
        <table>
          <tbody>
            <TableEmptyState message={message} />
          </tbody>
        </table>
      );

      // Should still render without crashing
      expect(screen.getByText(message)).toBeInTheDocument();
    });

    it("should handle empty HISTORY_TABLE_CONFIG array", () => {
      // Mock empty config
      vi.doMock("@/shared/config/historyTableConfig", () => ({
        HISTORY_TABLE_CONFIG: [],
      }));

      const message = "Empty config test";
      render(
        <table>
          <tbody>
            <TableEmptyState message={message} />
          </tbody>
        </table>
      );

      expect(screen.getByText(message)).toBeInTheDocument();
    });
  });
});
