import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { historyTableConfig } from "../../organisms/HistoryTable/HistoryTable.styles";

interface TableEmptyStateProps {
  message: string;
}

export const TableEmptyState: React.FC<TableEmptyStateProps> = ({ message }) => (
  <TableRow>
    <TableCell colSpan={historyTableConfig.length} className="text-center py-8 text-muted-foreground">
      {message}
    </TableCell>
  </TableRow>
);
