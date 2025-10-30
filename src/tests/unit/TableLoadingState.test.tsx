import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { TableLoadingState } from "@/components/atoms/Table/TableLoadingState";
import { Table, TableBody } from "@/components/ui/table";

describe("TableLoadingState Component", () => {
  const renderWithTable = (columns?: number) => {
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
      const { container } = renderWithTable();
      expect(container).toBeInTheDocument();
    });

    it("should render two skeleton rows", () => {
      const { container } = renderWithTable();
      const rows = container.querySelectorAll("tr");
      expect(rows).toHaveLength(2);
    });

    it("should render 4 columns by default", () => {
      const { container } = renderWithTable();
      const firstRow = container.querySelector("tr");
      const cells = firstRow?.querySelectorAll("td");
      expect(cells).toHaveLength(4);
    });

    it("should render custom number of columns", () => {
      const { container } = renderWithTable(6);
      const firstRow = container.querySelector("tr");
      const cells = firstRow?.querySelectorAll("td");
      expect(cells).toHaveLength(6);
    });

    it("should render Skeleton components", () => {
      const { container } = renderWithTable();
      const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe("Column Structure", () => {
    it("should have main content column with double line in first position", () => {
      const { container } = renderWithTable();
      const firstRow = container.querySelector("tr");
      const firstCell = firstRow?.querySelector("td");
      const skeletons = firstCell?.querySelectorAll('[class*="h-"]');
      expect(skeletons).toHaveLength(2);
    });

    it("should have actions column in last position", () => {
      const { container } = renderWithTable(4);
      const firstRow = container.querySelector("tr");
      const cells = firstRow?.querySelectorAll("td");
      const lastCell = cells?.[3];
      const buttonSkeleton = lastCell?.querySelector(".rounded-md");
      expect(buttonSkeleton).toBeInTheDocument();
    });

    it("should alternate badge and text skeletons in middle columns", () => {
      const { container } = renderWithTable(5);
      const firstRow = container.querySelector("tr");
      const cells = firstRow?.querySelectorAll("td");

      // Column 1 (index 1): badge (odd index)
      const badgeSkeleton = cells?.[1]?.querySelector(".rounded-full");
      expect(badgeSkeleton).toBeInTheDocument();

      // Column 2 (index 2): text (even index)
      const textSkeleton = cells?.[2]?.querySelector(".h-4");
      expect(textSkeleton).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should have proper width class on first column", () => {
      const { container } = renderWithTable();
      const firstRow = container.querySelector("tr");
      const firstCell = firstRow?.querySelector("td");
      expect(firstCell).toHaveClass("w-1/2");
    });

    it("should have proper width class on last column", () => {
      const { container } = renderWithTable();
      const firstRow = container.querySelector("tr");
      const cells = firstRow?.querySelectorAll("td");
      const lastCell = cells?.[3];
      expect(lastCell).toHaveClass("w-[10%]");
    });

    it("should have spacing in main content column", () => {
      const { container } = renderWithTable();
      const firstRow = container.querySelector("tr");
      const firstCell = firstRow?.querySelector("td");
      const contentDiv = firstCell?.querySelector(".space-y-2");
      expect(contentDiv).toBeInTheDocument();
    });
  });

  describe("Consistency", () => {
    it("should render identical structure for both rows", () => {
      const { container } = renderWithTable();
      const rows = container.querySelectorAll("tr");

      const firstRowCells = rows[0].querySelectorAll("td");
      const secondRowCells = rows[1].querySelectorAll("td");

      expect(firstRowCells).toHaveLength(secondRowCells.length);
    });

    it("should work with different column counts", () => {
      const columnCounts = [2, 3, 5, 7];

      for (const count of columnCounts) {
        const { container } = renderWithTable(count);
        const firstRow = container.querySelector("tr");
        const cells = firstRow?.querySelectorAll("td");
        expect(cells).toHaveLength(count);
      }
    });
  });
});
