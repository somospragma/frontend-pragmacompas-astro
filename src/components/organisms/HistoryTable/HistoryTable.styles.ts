export interface MentorshipData {
  participant: string;
  role: string;
  status: string;
  scheduledDate: string;
  chapter: string;
  skills: string[];
  action: string;
}

export type CellValue = string | string[];

export interface TableColumn {
  key: keyof MentorshipData;
  label: string;
  className?: string;
  cellType?: "text" | "badge" | "skills" | "button";
}

// Table configuration
export const historyTableConfig: TableColumn[] = [
  {
    key: "participant",
    label: "Participante",
    className: "font-medium",
    cellType: "text",
  },
  {
    key: "role",
    label: "Rol",
    cellType: "text",
  },
  {
    key: "status",
    label: "Estado",
    cellType: "badge",
  },
  {
    key: "scheduledDate",
    label: "Fecha Programada",
    cellType: "text",
  },
  {
    key: "chapter",
    label: "Chapter",
    cellType: "text",
  },
  {
    key: "skills",
    label: "Habilidades",
    cellType: "skills",
  },
  {
    key: "action",
    label: "Acción",
    cellType: "button",
  },
];

export const historyTableStyles = {
  container: "bg-table rounded-xl border border-border overflow-hidden",
  header: {
    row: "border-border bg-primary/10",
    cell: "text-foreground font-semibold py-4 px-6",
  },
  body: {
    row: "border-border hover:bg-accent transition-colors",
    cell: "text-foreground py-6 px-6",
    cellMedium: "text-foreground font-medium py-6 px-6",
    skillsCell: "py-6 px-6",
  },
  badge: {
    base: "font-medium px-3 py-1 rounded-full text-xs",
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-foreground",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-foreground",
    rejected: "bg-error-50 text-error-700 dark:bg-error-900 dark:text-foreground",
  },
};

export const getStatusBadgeClasses = (status: string): string => {
  // TODO: Mejorar esto
  const statusClasses: Record<string, string> = {
    ["Enviada"]: historyTableStyles.badge.active,
    ["Aprobada"]: historyTableStyles.badge.pending,
    ["Rechazada"]: historyTableStyles.badge.rejected,
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
