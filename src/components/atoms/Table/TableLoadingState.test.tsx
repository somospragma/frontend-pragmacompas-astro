import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { TableLoadingState } from "@/components/atoms/Table/TableLoadingState";
import { Table, TableBody } from "@/components/ui/table";
import type { TableColumn } from "@/shared/config/historyTableConfig";

describe("TableLoadingState Component", () => {
  const mockColumns: TableColumn[] = [
    { key: "name", label: "Name", cellType: "text" },
    { key: "status", label: "Status", cellType: "badge" },
    { key: "skills", label: "Skills", cellType: "skills" },
    { key: "action", label: "Action", cellType: "button" },
  ];

  const renderWithTable = (columns?: TableColumn[]) => {
    return render(
      <Table>
        <TableBody>
          <TableLoadingState columns={columns} />
        </TableBody>
      </Table>
    );
  };

  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = renderWithTable(mockColumns);
      expect(container).toBeInTheDocument();
    });

    it("should render two skeleton rows", () => {
      const { container } = renderWithTable(mockColumns);
      const rows = container.querySelectorAll("tr");
      expect(rows).toHaveLength(2);
    });

    it("should render correct number of columns", () => {
      const { container } = renderWithTable(mockColumns);
      const firstRow = container.querySelector("tr");
      const cells = firstRow?.querySelectorAll("td");
      expect(cells).toHaveLength(4);
    });

    it("should render with empty columns array", () => {
      const { container } = renderWithTable([]);
      const rows = container.querySelectorAll("tr");
      expect(rows).toHaveLength(2);
    });
  });

  describe("Cell Types", () => {
    it("should render text cell with double line", () => {
      const textColumns: TableColumn[] = [{ key: "name", label: "Name", cellType: "text" }];
      const { container } = renderWithTable(textColumns);
      const firstRow = container.querySelector("tr");
      const firstCell = firstRow?.querySelector("td");
      const skeletons = firstCell?.querySelectorAll('[class*="h-"]');
      expect(skeletons).toHaveLength(2);
    });

    it("should render badge cell with rounded skeleton", () => {
      const badgeColumns: TableColumn[] = [{ key: "status", label: "Status", cellType: "badge" }];
      const { container } = renderWithTable(badgeColumns);
      const firstRow = container.querySelector("tr");
      const firstCell = firstRow?.querySelector("td");
      const roundedSkeleton = firstCell?.querySelector(".rounded-full");
      expect(roundedSkeleton).toBeInTheDocument();
    });

    it("should render skills cell with multiple badges", () => {
      const skillsColumns: TableColumn[] = [{ key: "skills", label: "Skills", cellType: "skills" }];
      const { container } = renderWithTable(skillsColumns);
      const firstRow = container.querySelector("tr");
      const firstCell = firstRow?.querySelector("td");
      const badges = firstCell?.querySelectorAll(".rounded-full");
      expect(badges?.length).toBe(2);
    });

    it("should render button cell with rounded-md skeleton", () => {
      const buttonColumns: TableColumn[] = [{ key: "action", label: "Action", cellType: "button" }];
      const { container } = renderWithTable(buttonColumns);
      const firstRow = container.querySelector("tr");
      const firstCell = firstRow?.querySelector("td");
      const buttonSkeleton = firstCell?.querySelector(".rounded-md");
      expect(buttonSkeleton).toBeInTheDocument();
    });

    it("should default to text type when cellType is not specified", () => {
      const defaultColumns: TableColumn[] = [{ key: "name", label: "Name" }];
      const { container } = renderWithTable(defaultColumns);
      const firstRow = container.querySelector("tr");
      const firstCell = firstRow?.querySelector("td");
      const skeletons = firstCell?.querySelectorAll('[class*="h-"]');
      expect(skeletons).toHaveLength(2);
    });
  });

  describe("Column Classes", () => {
    it("should apply className from column configuration", () => {
      const columnsWithClass: TableColumn[] = [
        { key: "name", label: "Name", cellType: "text", className: "font-medium" },
      ];
      const { container } = renderWithTable(columnsWithClass);
      const firstRow = container.querySelector("tr");
      const firstCell = firstRow?.querySelector("td");
      expect(firstCell).toHaveClass("font-medium");
    });
  });

  describe("Styling", () => {
    it("should have spacing in text cell", () => {
      const { container } = renderWithTable(mockColumns);
      const firstRow = container.querySelector("tr");
      const firstCell = firstRow?.querySelector("td");
      const contentDiv = firstCell?.querySelector(".space-y-2");
      expect(contentDiv).toBeInTheDocument();
    });

    it("should have flex layout in skills cell", () => {
      const skillsColumns: TableColumn[] = [{ key: "skills", label: "Skills", cellType: "skills" }];
      const { container } = renderWithTable(skillsColumns);
      const firstRow = container.querySelector("tr");
      const firstCell = firstRow?.querySelector("td");
      const flexDiv = firstCell?.querySelector(".flex");
      expect(flexDiv).toBeInTheDocument();
    });
  });

  describe("Consistency", () => {
    it("should render identical structure for both rows", () => {
      const { container } = renderWithTable(mockColumns);
      const rows = container.querySelectorAll("tr");

      const firstRowCells = rows[0].querySelectorAll("td");
      const secondRowCells = rows[1].querySelectorAll("td");

      expect(firstRowCells).toHaveLength(secondRowCells.length);
    });
  });
});
