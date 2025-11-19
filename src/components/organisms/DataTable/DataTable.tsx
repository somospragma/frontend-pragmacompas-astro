import React, { useMemo, useId } from "react";
import { Table, TableBody, TableHeader } from "@/components/ui/table";
import { TableHeaderRow } from "@/components/molecules/Table/TableHeaderRow";
import { TableDataRow } from "@/components/molecules/Table/TableDataRow";
import { TableEmptyState } from "@/components/atoms/Table/TableEmptyState";
import { TableLoadingState } from "@/components/atoms/Table/TableLoadingState";
import type { MentorshipData, TableColumn } from "@/shared/config/historyTableConfig";

interface DataTableProps {
  readonly title?: string;
  readonly columns: TableColumn[];
  readonly data: MentorshipData[];
  readonly emptyMessage?: string;
  readonly loading?: boolean;
  readonly className?: string;
  readonly onActionClick?: (action: string, mentorship: MentorshipData) => void;
}

/**
 * Reusable table to display mentorship data with loading, empty states, and custom actions
 *
 * @example
 * <DataTable
 *   title="My Mentorships"
 *   columns={HISTORY_TABLE_CONFIG}
 *   data={mentorships}
 *   loading={isLoading}
 *   onActionClick={handleAction}
 * />
 */
const DataTable: React.FC<DataTableProps> = ({
  title,
  columns,
  data,
  emptyMessage = "No hay datos disponibles",
  loading = false,
  className = "",
  onActionClick,
}) => {
  const titleId = useId();

  const shouldShowEmpty = useMemo(() => !loading && data.length === 0, [loading, data.length]);
  const shouldShowData = useMemo(() => !loading && data.length > 0, [loading, data.length]);
  const containerClassName = useMemo(() => `space-y-4 ${className}`, [className]);
  const tableAriaLabel = useMemo(() => title || "Tabla de datos", [title]);

  const srText = useMemo(() => {
    if (loading) return "Cargando datos de la tabla...";
    if (data.length === 0) return "No hay datos disponibles en la tabla";
    return `Tabla con ${data.length} ${data.length === 1 ? "registro" : "registros"}`;
  }, [loading, data.length]);

  return (
    <section className={containerClassName} role="region" aria-labelledby={title ? titleId : undefined}>
      {title && (
        <h2 id={titleId} className="text-xl font-semibold text-foreground">
          {title}
        </h2>
      )}

      <div
        className="bg-table rounded-xl border border-border overflow-hidden"
        role="table"
        aria-busy={loading}
        aria-label={tableAriaLabel}
      >
        <span className="sr-only">{srText}</span>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableHeaderRow columns={columns} />
            </TableHeader>
            <TableBody>
              {loading && <TableLoadingState columns={columns} />}
              {shouldShowEmpty && <TableEmptyState message={emptyMessage} />}
              {shouldShowData &&
                data.map((row) => (
                  <TableDataRow
                    key={row.id}
                    row={row}
                    index={data.indexOf(row)}
                    columns={columns}
                    onActionClick={onActionClick}
                  />
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default DataTable;
