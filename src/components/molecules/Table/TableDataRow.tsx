import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { TableCellRenderer } from "../../atoms/Table/TableCellRenderer";
import { historyTableStyles } from "../../organisms/HistoryTable/HistoryTable.styles";
import type { MentorshipData, TableColumn } from "@/shared/config/historyTableConfig";

interface TableDataRowProps {
  row: MentorshipData;
  index: number;
  columns?: TableColumn[];
}

export const TableDataRow: React.FC<TableDataRowProps> = ({ row, index, columns = [] }) => (
  <TableRow key={`${row.participant}-${index}`} className={historyTableStyles.body.row}>
    {columns.map((column) => {
      const value = row[column.key];

      const getCellClassName = (): string => {
        if (column.cellType === "skills" || column.cellType === "button") {
          return historyTableStyles.body.skillsCell;
        }

        if (column.cellType === "text" && column.className?.includes("font-medium")) {
          return historyTableStyles.body.cellMedium;
        }

        return historyTableStyles.body.cell;
      };

      return (
        <TableCell key={column.key} className={getCellClassName()}>
          <TableCellRenderer value={value} column={column} row={row} />
        </TableCell>
      );
    })}
  </TableRow>
);
