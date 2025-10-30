import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface TableLoadingStateProps {
  columns?: number;
}

/**
 * TableLoadingState Component
 *
 * Displays an animated skeleton loading state for tables.
 * Shows two rows with skeleton structure matching the table columns.
 *
 * @param columns - Number of columns to render (default: 4)
 * @returns Two skeleton rows with dynamic column structure
 */
export const TableLoadingState: React.FC<TableLoadingStateProps> = ({ columns = 4 }) => {
  const renderSkeletonCell = (columnIndex: number) => {
    if (columnIndex === 0) {
      return (
        <TableCell key={columnIndex} className="w-1/2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[50%]" />
            <Skeleton className="h-3 w-[65%]" />
          </div>
        </TableCell>
      );
    }

    if (columnIndex === columns - 1) {
      return (
        <TableCell key={columnIndex} className="w-[10%]">
          <Skeleton className="h-8 w-8 rounded-md" />
        </TableCell>
      );
    }

    const isBadgeColumn = columnIndex % 2 === 1;
    return (
      <TableCell key={columnIndex}>
        {isBadgeColumn ? <Skeleton className="h-6 w-20 rounded-full" /> : <Skeleton className="h-4 w-24" />}
      </TableCell>
    );
  };

  const renderSkeletonRow = (rowIndex: number) => (
    <TableRow key={`skeleton-row-${rowIndex}`}>
      {Array.from({ length: columns }).map((_, columnIndex) => renderSkeletonCell(columnIndex))}
    </TableRow>
  );

  return (
    <>
      {renderSkeletonRow(0)}
      {renderSkeletonRow(1)}
    </>
  );
};
