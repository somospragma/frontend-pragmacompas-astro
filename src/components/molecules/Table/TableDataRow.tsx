/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { TableCellRenderer } from "../../atoms/Table/TableCellRenderer";
import type { MentorshipData, TableColumn } from "@/shared/config/historyTableConfig";

/**
 * Props para el componente TableDataRow
 */
interface TableDataRowProps {
  /** Datos de la mentoría para renderizar en la fila */
  row: MentorshipData;
  /** Índice de la fila en la tabla */
  index: number;
  /** Configuración de las columnas de la tabla */
  columns?: TableColumn[];
  /** Callback para manejar clicks en acciones de la fila */
  onActionClick?: (action: string, mentorship: MentorshipData) => void;
}

/**
 * Sanitiza texto para prevenir XSS removiendo caracteres peligrosos
 * @param text - Texto a sanitizar
 * @returns Texto sanitizado
 */
const sanitizeText = (text: string): string => {
  if (typeof text !== "string") return "";
  return text
    .replace(/[<>]/g, "") // Remover < y >
    .replace(/javascript:/gi, "") // Remover javascript:
    .replace(/on\w+=/gi, "") // Remover event handlers
    .trim();
};

/**
 * Obtiene un valor anidado de un objeto usando notación de punto de forma segura
 * @param obj - Objeto del cual extraer el valor
 * @param path - Ruta al valor usando notación de punto (ej: "user.name")
 * @returns Valor encontrado o undefined si no existe
 */
const getNestedValue = (obj: any, path: string): any => {
  try {
    if (!obj || typeof path !== "string" || path.includes("__proto__") || path.includes("constructor")) {
      return undefined;
    }

    return path.split(".").reduce((acc, key) => {
      return acc && typeof acc === "object" ? acc[key] : undefined;
    }, obj);
  } catch (error) {
    console.warn(`Error accessing nested value at path "${path}":`, error);
    return undefined;
  }
};

/**
 * Componente que renderiza una fila de datos en una tabla
 * Proporciona accesibilidad completa y manejo seguro de datos
 *
 * @param props - Props del componente
 * @returns JSX Element representando una fila de tabla
 */
export const TableDataRow: React.FC<TableDataRowProps> = ({ row, index, columns = [], onActionClick }) => {
  // Validación de inputs
  if (!row || !row.id) {
    console.warn("TableDataRow: Invalid row data provided");
    return null;
  }

  if (!Array.isArray(columns)) {
    console.warn("TableDataRow: columns should be an array");
    return null;
  }

  const rowId = `table-row-${row.id}-${index}`;
  const hasActions = columns.some((col) => col.cellType === "button");

  return (
    <TableRow
      key={`${row.id}-${index}`}
      className="border-border hover:bg-accent transition-colors focus-within:bg-accent"
      role="row"
      aria-labelledby={rowId}
      tabIndex={hasActions ? 0 : -1}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          // Trigger first action if available
          const firstAction = columns.find((col) => col.cellType === "button");
          if (firstAction && onActionClick) {
            e.preventDefault();
            onActionClick("primary", row);
          }
        }
      }}
    >
      {columns.map((column, columnIndex) => {
        const rawValue = getNestedValue(row, column.key);

        // Sanitizar valor si es texto
        const value = typeof rawValue === "string" ? sanitizeText(rawValue) : rawValue;

        const getCellClassName = (): string => {
          if (column.cellType === "skills" || column.cellType === "button") {
            return "py-6 px-6";
          }

          if (column.cellType === "text" && column.className?.includes("font-medium")) {
            return "text-foreground font-medium py-6 px-6";
          }

          return "text-foreground py-6 px-6";
        };

        const cellId = `${rowId}-cell-${columnIndex}`;

        return (
          <TableCell
            key={column.key}
            className={getCellClassName()}
            role="gridcell"
            aria-labelledby={cellId}
            aria-describedby={column.cellType === "button" ? `${cellId}-actions` : undefined}
          >
            <div id={cellId} className="sr-only">
              {`${column.key} column, row ${index + 1}`}
            </div>
            <TableCellRenderer value={value} column={column} row={row} onActionClick={onActionClick} />
          </TableCell>
        );
      })}
    </TableRow>
  );
};
