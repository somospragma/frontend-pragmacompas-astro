import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { TableCellRenderer } from "../../atoms/Table/TableCellRenderer";
import type { MentorshipData, TableColumn } from "@/shared/config/historyTableConfig";

interface TableDataRowProps {
  row: MentorshipData;
  index: number;
  columns?: TableColumn[];
}

export const TableDataRow: React.FC<TableDataRowProps> = ({ row, index, columns = [] }) => (
  <TableRow key={`${row.participant}-${index}`} className="border-border hover:bg-accent transition-colors">
    {columns.map((column) => {
      const value = row[column.key];

      const getCellClassName = (): string => {
        if (column.cellType === "skills" || column.cellType === "button") {
          return "py-6 px-6";
        }

        if (column.cellType === "text" && column.className?.includes("font-medium")) {
          return "text-foreground font-medium py-6 px-6";
        }

        return "text-foreground py-6 px-6";
      };

      return (
        <TableCell key={column.key} className={getCellClassName()}>
          <TableCellRenderer value={value} column={column} row={row} />
        </TableCell>
      );
    })}
  </TableRow>
);
