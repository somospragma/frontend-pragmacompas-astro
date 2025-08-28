import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CellValue, MentorshipData, TableColumn } from "@/shared/config/historyTableConfig";
import { getStatusBadgeClasses, getVariantButtonClasses } from "@/shared/utils/helpers/tableCellStyles";

interface TableCellRendererProps {
  value: CellValue;
  column: TableColumn;
  row: MentorshipData;
  onActionClick?: (action: string, mentorship: MentorshipData) => void;
}

export const TableCellRenderer: React.FC<TableCellRendererProps> = ({ value, column, row, onActionClick }) => {
  const baseClassName = column.className || "";

  switch (column.cellType) {
    case "badge":
      if (typeof value !== "string") {
        return <span>Invalid value</span>;
      }
      return (
        <Badge
          variant="outline"
          className={`font-medium px-3 py-1 rounded-full text-xs ${getStatusBadgeClasses(value)}`}
        >
          {value}
        </Badge>
      );

    case "skills":
      if (!Array.isArray(value)) {
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
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return null;
        }

        return (
          <div className="flex gap-2 flex-wrap">
            {value.map((buttonValue, index) => (
              <Button
                key={index}
                variant={getVariantButtonClasses(buttonValue)}
                size="sm"
                aria-label={`${buttonValue}`}
                onClick={() => onActionClick?.(buttonValue, row)}
              >
                {buttonValue}
              </Button>
            ))}
          </div>
        );
      }

      if (typeof value !== "string") {
        return <span>Invalid value</span>;
      }

      if (value === "") {
        return null;
      }

      return (
        <Button
          variant={getVariantButtonClasses(value)}
          size="sm"
          aria-label={`${value}`}
          onClick={() => onActionClick?.(value, row)}
        >
          {value}
        </Button>
      );

    case "text":
    default:
      if (typeof value !== "string") {
        return <span>Invalid value</span>;
      }
      return <span className={baseClassName}>{value}</span>;
  }
};
