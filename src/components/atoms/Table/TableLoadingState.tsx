import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { historyTableConfig } from "@/shared/config/historyTableConfig";

export const TableLoadingState: React.FC = () => (
  <TableRow>
    <TableCell colSpan={historyTableConfig?.length} className="text-center py-8 text-muted-foreground">
      Cargando...
    </TableCell>
  </TableRow>
);
