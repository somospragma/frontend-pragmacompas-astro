import React from "react";
import { Table, TableBody, TableHeader } from "@/components/ui/table";
import { TableHeaderRow } from "@/components/molecules/Table/TableHeaderRow";
import { TableDataRow } from "@/components/molecules/Table/TableDataRow";
import { TableEmptyState } from "@/components/atoms/Table/TableEmptyState";
import { TableLoadingState } from "@/components/atoms/Table/TableLoadingState";
import { historyTableStyles } from "../HistoryTable/HistoryTable.styles";
import type { MentorshipData, TableColumn } from "../HistoryTable/HistoryTable.styles";

interface DataTableProps {
  title?: string;
  columns: TableColumn[];
  data: MentorshipData[];
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  title,
  columns,
  data,
  emptyMessage = "No hay datos disponibles",
  loading = false,
  className = "",
}) => {
  const shouldShowEmpty = !loading && data.length === 0;
  const shouldShowData = !loading && data.length > 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {title && <h2 className="text-xl font-semibold text-foreground">{title}</h2>}

      <div className={historyTableStyles.container}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableHeaderRow columns={columns} />
            </TableHeader>
            <TableBody>
              {loading && <TableLoadingState />}
              {shouldShowEmpty && <TableEmptyState message={emptyMessage} />}
              {shouldShowData &&
                data.map((row, index) => (
                  <TableDataRow key={`${row.participant}-${index}`} row={row} index={index} columns={columns} />
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
