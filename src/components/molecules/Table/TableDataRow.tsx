import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { TableCellRenderer } from "../../atoms/Table/TableCellRenderer";
import {
  historyTableStyles,
  historyTableConfig,
  type MentorshipData,
} from "../../organisms/HistoryTable/HistoryTable.styles";

interface TableDataRowProps {
  row: MentorshipData;
  index: number;
}

export const TableDataRow: React.FC<TableDataRowProps> = ({ row, index }) => (
  <TableRow key={`${row.participant}-${index}`} className={historyTableStyles.body.row}>
    {historyTableConfig.map((column) => {
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
