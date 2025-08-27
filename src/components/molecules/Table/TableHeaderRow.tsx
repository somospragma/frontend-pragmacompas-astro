import React from "react";
import { TableHead, TableRow } from "@/components/ui/table";
import type { TableColumn } from "@/shared/config/historyTableConfig";

interface TableHeaderRowProps {
  columns?: TableColumn[];
}

export const TableHeaderRow: React.FC<TableHeaderRowProps> = ({ columns }) => (
  <TableRow className="border-border bg-primary/10">
    {columns?.map((column) => (
      <TableHead
        key={column.key}
        className={`text-foreground font-semibold py-4 px-6 ${column.className || ""}`}
        scope="col"
      >
        {column.label}
      </TableHead>
    ))}
  </TableRow>
);
