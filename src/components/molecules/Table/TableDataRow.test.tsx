import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TableDataRow } from "./TableDataRow";
import type { MentorshipData, TableColumn } from "@/shared/config/historyTableConfig";
import { UserRole } from "@/shared/utils/enums/role";

// Mock TableCellRenderer
vi.mock("../../atoms/Table/TableCellRenderer", () => ({
  TableCellRenderer: ({ value }: { value: unknown }) => <div data-testid="cell-renderer">{String(value)}</div>,
}));

describe("TableDataRow", () => {
  const mockRow: MentorshipData = {
    id: "1",
    tutor: {
      name: "John Doe",
      id: "t1",
      role: UserRole.TUTOR,
    },
    tutee: {
      name: "Jane Smith",
      id: "m1",
      role: UserRole.TUTEE,
    },
    status: "active",
  } as never;

  const mockColumns: TableColumn[] = [
    { key: "tutor.name", cellType: "text", label: "Tutor Name" },
    { key: "tutee.name", cellType: "text", label: "Tutee Name" },
    { key: "status", cellType: "text", label: "Status" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders table row with correct data", () => {
    render(<TableDataRow row={mockRow} index={0} columns={mockColumns} />);

    expect(screen.getByRole("row")).toBeInTheDocument();
    expect(screen.getAllByTestId("cell-renderer")).toHaveLength(3);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("active")).toBeInTheDocument();
  });

  it("handles invalid row data", () => {
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(<TableDataRow row={null as never} index={0} columns={mockColumns} />);

    expect(consoleWarn).toHaveBeenCalledWith("TableDataRow: Invalid row data provided");
    expect(screen.queryByRole("row")).not.toBeInTheDocument();

    consoleWarn.mockRestore();
  });

  it("handles invalid columns data", () => {
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(<TableDataRow row={mockRow} index={0} columns={null as never} />);

    expect(consoleWarn).toHaveBeenCalledWith("TableDataRow: columns should be an array");
    expect(screen.queryByRole("row")).not.toBeInTheDocument();

    consoleWarn.mockRestore();
  });
  it("handles missing row id", () => {
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const rowWithoutId = {
      tutor: { name: "John", id: "t1", role: UserRole.TUTOR },
      tutee: { name: "Jane", id: "m1", role: UserRole.TUTEE },
      status: "active",
    } as MentorshipData;

    render(<TableDataRow row={rowWithoutId} index={0} columns={mockColumns} />);

    expect(consoleWarn).toHaveBeenCalledWith("TableDataRow: Invalid row data provided");
    expect(screen.queryByRole("row")).not.toBeInTheDocument();

    consoleWarn.mockRestore();
  });

  it("sanitizes text values", () => {
    const rowWithScript: MentorshipData = {
      id: "1",
      tutor: { name: "<script>alert('xss')</script>John", id: "t1", role: UserRole.TUTOR },
      tutee: { name: "javascript:void(0)", id: "m1", role: UserRole.TUTEE },
      status: "onclick=alert('test')",
    } as never;

    render(<TableDataRow row={rowWithScript} index={0} columns={mockColumns} />);

    // Text should be sanitized - checking for sanitized output
    expect(screen.getByText("scriptalert('xss')/scriptJohn")).toBeInTheDocument();
    expect(screen.getByText("void(0)")).toBeInTheDocument();
    expect(screen.getByText("alert('test')")).toBeInTheDocument();
  });

  it("handles keyboard interaction with actions", () => {
    const onActionClick = vi.fn();
    const columnsWithButton: TableColumn[] = [
      { key: "tutor.name", cellType: "text", label: "Tutor Name" },
      { key: "actions", cellType: "button", label: "Actions" },
    ];

    render(<TableDataRow row={mockRow} index={0} columns={columnsWithButton} onActionClick={onActionClick} />);

    const tableRow = screen.getByRole("row");
    fireEvent.keyDown(tableRow, { key: "Enter" });

    expect(onActionClick).toHaveBeenCalledWith("primary", mockRow);
  });

  it("handles keyboard interaction without actions", () => {
    const onActionClick = vi.fn();

    render(<TableDataRow row={mockRow} index={0} columns={mockColumns} onActionClick={onActionClick} />);

    const tableRow = screen.getByRole("row");
    fireEvent.keyDown(tableRow, { key: "Enter" });

    expect(onActionClick).not.toHaveBeenCalled();
  });

  it("handles non-existent nested paths safely", () => {
    const columnsWithInvalidPath: TableColumn[] = [
      { key: "non.existent.path", cellType: "text", label: "Invalid Path" },
    ];

    render(<TableDataRow row={mockRow} index={0} columns={columnsWithInvalidPath} />);

    expect(screen.getByRole("row")).toBeInTheDocument();
    expect(screen.getByTestId("cell-renderer")).toHaveTextContent("undefined");
  });

  it("applies correct CSS classes based on cell type", () => {
    const mixedColumns: TableColumn[] = [
      { key: "tutor.name", cellType: "text", className: "font-medium", label: "Tutor Name" },
      { key: "status", cellType: "skills", label: "Status" },
      { key: "actions", cellType: "button", label: "Actions" },
    ];

    render(<TableDataRow row={mockRow} index={0} columns={mixedColumns} />);

    const cells = screen.getAllByRole("gridcell");
    expect(cells[0]).toHaveClass("text-foreground", "font-medium", "py-6", "px-6");
    expect(cells[1]).toHaveClass("py-6", "px-6");
    expect(cells[2]).toHaveClass("py-6", "px-6");
  });

  it("renders empty columns array", () => {
    render(<TableDataRow row={mockRow} index={0} columns={[]} />);

    expect(screen.getByRole("row")).toBeInTheDocument();
    expect(screen.queryByRole("gridcell")).not.toBeInTheDocument();
  });
});
