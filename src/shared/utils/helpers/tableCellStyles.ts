import { Status } from "@/shared/utils/enums/status";

export const getStatusBadgeClasses = (status: string): string => {
  const statusClasses: Record<string, string> = {
    [Status.Enviada]: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-foreground",
    [Status.Aprobada]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-foreground",
    [Status.Rechazada]: "bg-error-50 text-error-700 dark:bg-error-900 dark:text-foreground",
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
