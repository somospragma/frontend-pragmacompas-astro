import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TableHeaderRow } from "./TableHeaderRow";
import type { TableColumn } from "@/shared/config/historyTableConfig";

describe("TableHeaderRow", () => {
  const mockColumns: TableColumn[] = [
    { key: "name", label: "Name", cellType: "text" },
    { key: "email", label: "Email", cellType: "text" },
    { key: "role", label: "Role", cellType: "text" },
  ];

  it("renders table header row with columns", () => {
    render(<TableHeaderRow columns={mockColumns} />);

    expect(screen.getByRole("row")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
  });

  it("renders correct number of column headers", () => {
    render(<TableHeaderRow columns={mockColumns} />);

    const columnHeaders = screen.getAllByRole("columnheader");
    expect(columnHeaders).toHaveLength(3);
  });

  it("applies custom className from column config", () => {
    const columnsWithCustomClass: TableColumn[] = [
      { key: "name", label: "Name", cellType: "text", className: "custom-class" },
      { key: "email", label: "Email", cellType: "text" },
    ];

    render(<TableHeaderRow columns={columnsWithCustomClass} />);

    const nameHeader = screen.getByText("Name");
    expect(nameHeader).toHaveClass("custom-class");
  });

  it("handles undefined columns gracefully", () => {
    render(<TableHeaderRow columns={undefined} />);

    expect(screen.getByRole("row")).toBeInTheDocument();
    expect(screen.queryByRole("columnheader")).not.toBeInTheDocument();
  });

  it("handles empty columns array", () => {
    render(<TableHeaderRow columns={[]} />);

    expect(screen.getByRole("row")).toBeInTheDocument();
    expect(screen.queryByRole("columnheader")).not.toBeInTheDocument();
  });

  it("renders with missing optional props", () => {
    render(<TableHeaderRow />);

    expect(screen.getByRole("row")).toBeInTheDocument();
    expect(screen.queryByRole("columnheader")).not.toBeInTheDocument();
  });

  it("uses column key as unique key prop", () => {
    const columnsWithSameLabel: TableColumn[] = [
      { key: "first_name", label: "Name", cellType: "text" },
      { key: "last_name", label: "Name", cellType: "text" },
    ];

    render(<TableHeaderRow columns={columnsWithSameLabel} />);

    // Both headers should render even with same labels
    const nameHeaders = screen.getAllByText("Name");
    expect(nameHeaders).toHaveLength(2);
  });

  it("handles columns without className property", () => {
    const columnsWithoutClassName: TableColumn[] = [{ key: "name", label: "Name", cellType: "text" }];

    render(<TableHeaderRow columns={columnsWithoutClassName} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByRole("columnheader")).not.toHaveClass("undefined");
  });

  it("renders with mixed column configurations", () => {
    const mixedColumns: TableColumn[] = [
      { key: "name", label: "Full Name", cellType: "text", className: "w-40" },
      { key: "status", label: "Status", cellType: "text" },
      { key: "actions", label: "Actions", cellType: "button", className: "text-center" },
    ];

    render(<TableHeaderRow columns={mixedColumns} />);

    expect(screen.getByText("Full Name")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.getAllByRole("columnheader")).toHaveLength(3);
  });
});
