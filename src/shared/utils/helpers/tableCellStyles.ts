import { historyTableStyles } from "@/components/organisms/HistoryTable/HistoryTable.styles";
import { Status } from "@/shared/utils/enums/status";

export const getStatusBadgeClasses = (status: string): string => {
  const statusClasses: Record<string, string> = {
    [Status.Enviada]: historyTableStyles.badge.active,
    [Status.Aprobada]: historyTableStyles.badge.pending,
    [Status.Rechazada]: historyTableStyles.badge.rejected,
  };
  return statusClasses[status] || "";
};

export const getVariantButtonClasses = (
  action: string
): "default" | "link" | "destructive" | "secondary" | "outline" | "ghost" => {
  const actionClasses: Record<string, "default" | "link" | "destructive" | "secondary" | "outline" | "ghost"> = {
    ["Cancelar"]: "destructive",
  };
  return actionClasses[action] || "default";
};
