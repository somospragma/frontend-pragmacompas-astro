import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { HISTORY_TABLE_CONFIG } from "@/shared/config/historyTableConfig";

interface TableEmptyStateProps {
  /** Message to display when table is empty */
  message: string;
}

/**
 * TableEmptyState component displays empty state for tables
 *
 * Features:
 * - Automatic colspan calculation based on table configuration
 * - Centered text with muted styling
 * - Semantic table structure
 * - Consistent spacing
 *
 * @example
 * ```tsx
 * <TableEmptyState message="No mentorships found" />
 * ```
 */

export const TableEmptyState: React.FC<TableEmptyStateProps> = ({ message }) => (
  <TableRow>
    <TableCell colSpan={HISTORY_TABLE_CONFIG?.length} className="text-center py-8 text-muted-foreground">
      {message}
    </TableCell>
  </TableRow>
);
