import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DataTable from "./DataTable";
import type { MentorshipData, TableColumn } from "@/shared/config/historyTableConfig";
import { UserRole } from "@/shared/utils/enums/role";

// Mock de los componentes hijos
vi.mock("@/components/molecules/Table/TableHeaderRow", () => ({
  TableHeaderRow: ({ columns }: { columns: TableColumn[] }) => (
    <tr data-testid="table-header-row">
      {columns.map((col) => (
        <th key={col.key}>{col.label}</th>
      ))}
    </tr>
  ),
}));

vi.mock("@/components/molecules/Table/TableDataRow", () => ({
  TableDataRow: ({
    row,
    index,
    onActionClick,
  }: {
    row: MentorshipData;
    index: number;
    onActionClick?: (action: string, mentorship: MentorshipData) => void;
  }) => (
    <tr data-testid={`table-data-row-${index}`}>
      <td>{row.tutor.name}</td>
      <td>{row.tutee.name}</td>
      <td>
        <button onClick={() => onActionClick?.("view", row)}>Ver</button>
      </td>
    </tr>
  ),
}));

vi.mock("@/components/atoms/Table/TableEmptyState", () => ({
  TableEmptyState: ({ message }: { message: string }) => (
    <tr data-testid="table-empty-state">
      <td>{message}</td>
    </tr>
  ),
}));

vi.mock("@/components/atoms/Table/TableLoadingState", () => ({
  TableLoadingState: () => (
    <tr data-testid="table-loading-state">
      <td>Cargando...</td>
    </tr>
  ),
}));

describe("DataTable", () => {
  const mockColumns: TableColumn[] = [
    { key: "tutor.name", label: "Tutor", cellType: "text" },
    { key: "tutee.name", label: "Tutorado", cellType: "text" },
    { key: "status", label: "Estado", cellType: "badge" },
  ];

  const mockData: MentorshipData[] = [
    {
      id: "1",
      type: "Mentoría",
      myRole: UserRole.TUTOR,
      tutor: { name: "Juan Pérez", email: "juan@test.com", role: UserRole.TUTOR, id: "tutor1" },
      tutee: { name: "María García", email: "maria@test.com", role: UserRole.TUTEE, id: "tutee1" },
      status: "Activa",
      startDate: "2024-01-01",
      chapter: "Chapter 1",
      skills: ["React", "TypeScript"],
      action: ["view", "edit"],
    },
    {
      id: "2",
      type: "Mentoría",
      myRole: UserRole.TUTOR,
      tutor: { name: "Carlos López", email: "carlos@test.com", role: UserRole.TUTOR, id: "tutor2" },
      tutee: { name: "Ana Martínez", email: "ana@test.com", role: UserRole.TUTEE, id: "tutee2" },
      status: "Completada",
      startDate: "2024-02-01",
      chapter: "Chapter 2",
      skills: ["Vue", "JavaScript"],
      action: ["view"],
    },
  ];

  describe("Rendering", () => {
    it("should render table with data", () => {
      render(<DataTable columns={mockColumns} data={mockData} />);

      expect(screen.getByTestId("table-header-row")).toBeInTheDocument();
      expect(screen.getByTestId("table-data-row-0")).toBeInTheDocument();
      expect(screen.getByTestId("table-data-row-1")).toBeInTheDocument();
    });

    it("should render title when provided", () => {
      render(<DataTable title="Mis Mentorías" columns={mockColumns} data={mockData} />);

      expect(screen.getByText("Mis Mentorías")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Mis Mentorías");
    });

    it("should not render title when not provided", () => {
      render(<DataTable columns={mockColumns} data={mockData} />);

      expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(<DataTable columns={mockColumns} data={mockData} className="custom-class" />);

      const section = container.querySelector("section");
      expect(section).toHaveClass("space-y-4", "custom-class");
    });
  });

  describe("Loading State", () => {
    it("should render loading state when loading is true", () => {
      render(<DataTable columns={mockColumns} data={[]} loading={true} />);

      expect(screen.getByTestId("table-loading-state")).toBeInTheDocument();
      expect(screen.queryByTestId("table-empty-state")).not.toBeInTheDocument();
      expect(screen.queryByTestId("table-data-row-0")).not.toBeInTheDocument();
    });

    it("should have aria-busy=true when loading", () => {
      render(<DataTable columns={mockColumns} data={[]} loading={true} />);

      const tableContainer = screen.getByLabelText("Tabla de datos");
      expect(tableContainer).toHaveAttribute("aria-busy", "true");
    });

    it("should show loading text for screen readers", () => {
      render(<DataTable columns={mockColumns} data={[]} loading={true} />);

      expect(screen.getByText("Cargando datos de la tabla...")).toBeInTheDocument();
      expect(screen.getByText("Cargando datos de la tabla...")).toHaveClass("sr-only");
    });
  });

  describe("Empty State", () => {
    it("should render empty state when no data and not loading", () => {
      render(<DataTable columns={mockColumns} data={[]} loading={false} />);

      expect(screen.getByTestId("table-empty-state")).toBeInTheDocument();
      expect(screen.queryByTestId("table-loading-state")).not.toBeInTheDocument();
      expect(screen.queryByTestId("table-data-row-0")).not.toBeInTheDocument();
    });

    it("should display default empty message", () => {
      render(<DataTable columns={mockColumns} data={[]} />);

      expect(screen.getByText("No hay datos disponibles")).toBeInTheDocument();
    });

    it("should display custom empty message", () => {
      render(<DataTable columns={mockColumns} data={[]} emptyMessage="No hay mentorías registradas" />);

      expect(screen.getByText("No hay mentorías registradas")).toBeInTheDocument();
    });

    it("should show empty text for screen readers", () => {
      render(<DataTable columns={mockColumns} data={[]} />);

      expect(screen.getByText("No hay datos disponibles en la tabla")).toBeInTheDocument();
      expect(screen.getByText("No hay datos disponibles en la tabla")).toHaveClass("sr-only");
    });
  });

  describe("Data Rendering", () => {
    it("should render correct number of rows", () => {
      render(<DataTable columns={mockColumns} data={mockData} />);

      expect(screen.getByTestId("table-data-row-0")).toBeInTheDocument();
      expect(screen.getByTestId("table-data-row-1")).toBeInTheDocument();
      expect(screen.queryByTestId("table-data-row-2")).not.toBeInTheDocument();
    });

    it("should render data with unique keys", () => {
      const { container } = render(<DataTable columns={mockColumns} data={mockData} />);

      const rows = container.querySelectorAll('[data-testid^="table-data-row"]');
      expect(rows).toHaveLength(2);
    });

    it("should show correct count in sr-only text", () => {
      render(<DataTable columns={mockColumns} data={mockData} />);

      expect(screen.getByText("Tabla con 2 registros")).toBeInTheDocument();
    });

    it("should show singular form for single record", () => {
      render(<DataTable columns={mockColumns} data={[mockData[0]]} />);

      expect(screen.getByText("Tabla con 1 registro")).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should call onActionClick when action button is clicked", async () => {
      const user = userEvent.setup();
      const handleActionClick = vi.fn();

      render(<DataTable columns={mockColumns} data={mockData} onActionClick={handleActionClick} />);

      const viewButtons = screen.getAllByText("Ver");
      await user.click(viewButtons[0]);

      expect(handleActionClick).toHaveBeenCalledWith("view", mockData[0]);
    });

    it("should work without onActionClick", () => {
      expect(() => {
        render(<DataTable columns={mockColumns} data={mockData} />);
      }).not.toThrow();
    });
  });

  describe("Accessibility", () => {
    it("should use semantic section element", () => {
      const { container } = render(<DataTable columns={mockColumns} data={mockData} />);

      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
    });

    it("should have role=region on section", () => {
      render(<DataTable columns={mockColumns} data={mockData} />);

      const section = screen.getByRole("region");
      expect(section).toBeInTheDocument();
    });

    it("should have aria-labelledby when title is provided", () => {
      render(<DataTable title="Mis Mentorías" columns={mockColumns} data={mockData} />);

      const section = screen.getByRole("region");
      const heading = screen.getByRole("heading", { level: 2 });

      expect(section).toHaveAttribute("aria-labelledby");
      expect(heading).toHaveAttribute("id");
    });

    it("should not have aria-labelledby when no title", () => {
      render(<DataTable columns={mockColumns} data={mockData} />);

      const section = screen.getByRole("region");
      expect(section).not.toHaveAttribute("aria-labelledby");
    });

    it("should have aria-label on table container", () => {
      render(<DataTable columns={mockColumns} data={mockData} />);

      const tableContainer = screen.getByLabelText("Tabla de datos");
      expect(tableContainer).toHaveAttribute("aria-label", "Tabla de datos");
    });

    it("should use title as aria-label when provided", () => {
      render(<DataTable title="Historial de Mentorías" columns={mockColumns} data={mockData} />);

      const tableContainer = screen.getByRole("table", { name: "Historial de Mentorías" });
      expect(tableContainer).toHaveAttribute("aria-label", "Historial de Mentorías");
    });

    it("should have aria-busy=false when not loading", () => {
      render(<DataTable columns={mockColumns} data={mockData} loading={false} />);

      const tableContainer = screen.getByLabelText("Tabla de datos");
      expect(tableContainer).toHaveAttribute("aria-busy", "false");
    });

    it("should have sr-only text for screen readers", () => {
      render(<DataTable columns={mockColumns} data={mockData} />);

      const srText = screen.getByText("Tabla con 2 registros");
      expect(srText).toHaveClass("sr-only");
    });
  });

  describe("Performance", () => {
    it("should memoize shouldShowEmpty", () => {
      const { rerender } = render(<DataTable columns={mockColumns} data={[]} />);

      expect(screen.getByTestId("table-empty-state")).toBeInTheDocument();

      rerender(<DataTable columns={mockColumns} data={[]} />);

      expect(screen.getByTestId("table-empty-state")).toBeInTheDocument();
    });

    it("should memoize shouldShowData", () => {
      const { rerender } = render(<DataTable columns={mockColumns} data={mockData} />);

      expect(screen.getByTestId("table-data-row-0")).toBeInTheDocument();

      rerender(<DataTable columns={mockColumns} data={mockData} />);

      expect(screen.getByTestId("table-data-row-0")).toBeInTheDocument();
    });

    it("should memoize containerClassName", () => {
      const { container, rerender } = render(<DataTable columns={mockColumns} data={mockData} className="test" />);

      const firstSection = container.querySelector("section");
      const firstClassName = firstSection?.className;

      rerender(<DataTable columns={mockColumns} data={mockData} className="test" />);

      const secondSection = container.querySelector("section");
      const secondClassName = secondSection?.className;

      expect(firstClassName).toBe(secondClassName);
    });

    it("should update when data changes", async () => {
      const { rerender } = render(<DataTable columns={mockColumns} data={mockData} />);

      expect(screen.getByText("Tabla con 2 registros")).toBeInTheDocument();

      const newData = [...mockData, { ...mockData[0], id: "3" }];
      rerender(<DataTable columns={mockColumns} data={newData} />);

      await waitFor(() => {
        expect(screen.getByText("Tabla con 3 registros")).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty columns array", () => {
      expect(() => {
        render(<DataTable columns={[]} data={mockData} />);
      }).not.toThrow();
    });

    it("should handle very long titles", () => {
      const longTitle = "A".repeat(100);
      render(<DataTable title={longTitle} columns={mockColumns} data={mockData} />);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it("should handle special characters in empty message", () => {
      const specialMessage = "<script>alert('test')</script> & special chars";
      render(<DataTable columns={mockColumns} data={[]} emptyMessage={specialMessage} />);

      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });

    it("should transition from loading to data", async () => {
      const { rerender } = render(<DataTable columns={mockColumns} data={[]} loading={true} />);

      expect(screen.getByTestId("table-loading-state")).toBeInTheDocument();

      rerender(<DataTable columns={mockColumns} data={mockData} loading={false} />);

      await waitFor(() => {
        expect(screen.queryByTestId("table-loading-state")).not.toBeInTheDocument();
        expect(screen.getByTestId("table-data-row-0")).toBeInTheDocument();
      });
    });

    it("should transition from loading to empty", async () => {
      const { rerender } = render(<DataTable columns={mockColumns} data={[]} loading={true} />);

      expect(screen.getByTestId("table-loading-state")).toBeInTheDocument();

      rerender(<DataTable columns={mockColumns} data={[]} loading={false} />);

      await waitFor(() => {
        expect(screen.queryByTestId("table-loading-state")).not.toBeInTheDocument();
        expect(screen.getByTestId("table-empty-state")).toBeInTheDocument();
      });
    });
  });
});
