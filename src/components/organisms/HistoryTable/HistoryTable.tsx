import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  historyTableStyles,
  historyTableConfig,
  getStatusBadgeClasses,
  getVariantButtonClasses,
  type MentorshipData,
  type TableColumn,
  type CellValue,
} from "./HistoryTable.styles";

interface Props {
  data: MentorshipData[];
  title?: string;
  isLoading?: boolean;
  emptyMessage?: string;
}

interface CellRendererProps {
  value: CellValue;
  column: TableColumn;
  row: MentorshipData;
}

const CellRenderer: React.FC<CellRendererProps> = ({ value, column, row }) => {
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

const TableHeaderRow: React.FC = () => (
  <TableRow className={historyTableStyles.header.row}>
    {historyTableConfig.map((column) => (
      <TableHead key={column.key} className={historyTableStyles.header.cell} scope="col">
        {column.label}
      </TableHead>
    ))}
  </TableRow>
);

const TableDataRow: React.FC<{ row: MentorshipData; index: number }> = ({ row, index }) => (
  <TableRow key={`${row.participant}-${index}`} className={historyTableStyles.body.row}>
    {historyTableConfig.map((column) => {
      const value = row[column.key];

      const getCellClassName = (): string => {
        if (column.cellType === "skills" || column.cellType === "button") {
          return historyTableStyles.body.skillsCell;
        }

        if (column.cellType === "text" && column.className?.includes("font-medium")) {
          return historyTableStyles.body.cellMedium;
        }

        return historyTableStyles.body.cell;
      };

      return (
        <TableCell key={column.key} className={getCellClassName()}>
          <CellRenderer value={value} column={column} row={row} />
        </TableCell>
      );
    })}
  </TableRow>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <TableRow>
    <TableCell colSpan={historyTableConfig.length} className="text-center py-8 text-muted-foreground">
      {message}
    </TableCell>
  </TableRow>
);

const LoadingState: React.FC = () => (
  <TableRow>
    <TableCell colSpan={historyTableConfig.length} className="text-center py-8 text-muted-foreground">
      Cargando...
    </TableCell>
  </TableRow>
);

const HistoryTable: React.FC<Props> = ({
  data,
  title,
  isLoading = false,
  emptyMessage = "No hay mentorías disponibles",
}) => {
  const shouldShowEmpty = !isLoading && data.length === 0;
  const shouldShowData = !isLoading && data.length > 0;

  return (
    <div className="space-y-4">
      {title && <h2 className="text-xl font-semibold text-foreground">{title}</h2>}

      <div className={historyTableStyles.container}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableHeaderRow />
            </TableHeader>
            <TableBody>
              {isLoading && <LoadingState />}
              {shouldShowEmpty && <EmptyState message={emptyMessage} />}
              {shouldShowData &&
                data.map((row, index) => <TableDataRow key={`${row.participant}-${index}`} row={row} index={index} />)}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default HistoryTable;
