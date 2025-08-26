import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { HISTORY_TABLE_CONFIG } from "@/shared/config/historyTableConfig";

interface TableEmptyStateProps {
  message: string;
}

export const TableEmptyState: React.FC<TableEmptyStateProps> = ({ message }) => (
  <TableRow>
    <TableCell colSpan={HISTORY_TABLE_CONFIG?.length} className="text-center py-8 text-muted-foreground">
      {message}
    </TableCell>
  </TableRow>
);
