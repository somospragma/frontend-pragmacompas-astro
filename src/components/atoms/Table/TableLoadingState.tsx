import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { HISTORY_TABLE_CONFIG } from "@/shared/config/historyTableConfig";

export const TableLoadingState: React.FC = () => (
  <TableRow>
    <TableCell colSpan={HISTORY_TABLE_CONFIG?.length} className="text-center py-8 text-muted-foreground">
      Cargando...
    </TableCell>
  </TableRow>
);
