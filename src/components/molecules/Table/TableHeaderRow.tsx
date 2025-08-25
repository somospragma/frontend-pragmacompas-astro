import React from "react";
import { TableHead, TableRow } from "@/components/ui/table";
import { historyTableStyles, historyTableConfig } from "../../organisms/HistoryTable/HistoryTable.styles";

export const TableHeaderRow: React.FC = () => (
  <TableRow className={historyTableStyles.header.row}>
    {historyTableConfig.map((column) => (
      <TableHead key={column.key} className={historyTableStyles.header.cell} scope="col">
        {column.label}
      </TableHead>
    ))}
  </TableRow>
);
