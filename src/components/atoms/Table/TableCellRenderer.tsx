import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CellValue, MentorshipData, TableColumn } from "@/shared/config/historyTableConfig";
import { historyTableStyles } from "@/components/organisms/HistoryTable/HistoryTable.styles";
import { getStatusBadgeClasses, getVariantButtonClasses } from "@/shared/utils/helpers/tableCellStyles";

interface TableCellRendererProps {
  value: CellValue;
  column: TableColumn;
  row: MentorshipData;
}

export const TableCellRenderer: React.FC<TableCellRendererProps> = ({ value, column, row }) => {
  const baseClassName = column.className || "";

  switch (column.cellType) {
    case "badge":
      if (typeof value !== "string") {
        console.warn("Badge cell expected string value, got:", typeof value);
        return <span>Invalid value</span>;
      }
      return (
        <Badge variant="outline" className={`${historyTableStyles.badge.base} ${getStatusBadgeClasses(value)}`}>
          {value}
        </Badge>
      );

    case "skills":
      if (!Array.isArray(value)) {
        console.warn("Skills cell expected array value, got:", typeof value);
        return <span>Invalid value</span>;
      }
      return (
        <div className="flex flex-col gap-1">
          {value.map((skill, skillIndex) => (
            <span key={skillIndex} className="text-foreground text-sm">
              {skill}
              {skillIndex < value.length - 1 && ","}
            </span>
          ))}
        </div>
      );

    case "button":
      if (typeof value !== "string") {
        console.warn("Button cell expected string value, got:", typeof value);
        return <span>Invalid value</span>;
      }

      if (value === "") {
        return null;
      }

      return (
        <Button variant={getVariantButtonClasses(value)} size="sm" aria-label={`${value} ${row.participant}`}>
          {value}
        </Button>
      );

    case "text":
    default:
      if (typeof value !== "string") {
        console.warn("Text cell expected string value, got:", typeof value);
        return <span>Invalid value</span>;
      }
      return <span className={baseClassName}>{value}</span>;
  }
};
