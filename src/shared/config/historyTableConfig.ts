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
