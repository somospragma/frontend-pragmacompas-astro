import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { historyTableConfig } from "../../organisms/HistoryTable/HistoryTable.styles";

export const TableLoadingState: React.FC = () => (
  <TableRow>
    <TableCell colSpan={historyTableConfig.length} className="text-center py-8 text-muted-foreground">
      Cargando...
    </TableCell>
  </TableRow>
);
