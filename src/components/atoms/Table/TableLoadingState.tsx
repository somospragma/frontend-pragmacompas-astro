import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { TableColumn } from "@/shared/config/historyTableConfig";

interface TableLoadingStateProps {
  columns?: TableColumn[];
}

/**
 * TableLoadingState Component
 *
 * Displays an animated skeleton loading state for tables.
 * Shows two rows with skeleton structure matching the table columns and their types.
 *
 * @param columns - Array of table columns with their configuration
 * @returns Two skeleton rows with structure matching column types
 */
export const TableLoadingState: React.FC<TableLoadingStateProps> = ({ columns = [] }) => {
  const renderSkeletonCell = (column: TableColumn, columnIndex: number) => {
    const cellType = column.cellType || "text";

    return (
      <TableCell key={columnIndex} className={column.className}>
        {cellType === "text" && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-[60%]" />
            <Skeleton className="h-3 w-[80%]" />
          </div>
        )}
        {cellType === "badge" && <Skeleton className="h-6 w-20 rounded-full" />}
        {cellType === "skills" && (
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        )}
        {cellType === "button" && <Skeleton className="h-8 w-8 rounded-md" />}
      </TableCell>
    );
  };

  const renderSkeletonRow = (rowIndex: number) => (
    <TableRow key={`skeleton-row-${rowIndex}`}>
      {columns.map((column, columnIndex) => renderSkeletonCell(column, columnIndex))}
    </TableRow>
  );

  return (
    <>
      {renderSkeletonRow(0)}
      {renderSkeletonRow(1)}
    </>
  );
};
