import React from "react";
import { TableHead, TableRow } from "@/components/ui/table";
import { historyTableStyles } from "../../organisms/HistoryTable/HistoryTable.styles";
import type { TableColumn } from "@/shared/config/historyTableConfig";

interface TableHeaderRowProps {
  columns?: TableColumn[];
}

export const TableHeaderRow: React.FC<TableHeaderRowProps> = ({ columns }) => (
  <TableRow className={historyTableStyles.header.row}>
    {columns?.map((column) => (
      <TableHead key={column.key} className={`${historyTableStyles.header.cell} ${column.className || ""}`} scope="col">
        {column.label}
      </TableHead>
    ))}
  </TableRow>
);
