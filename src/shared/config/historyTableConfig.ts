export interface MentorshipData {
  id: string;
  type: string;
  role: string;
  tutee: string;
  tutor: string;
  status: string;
  startDate: string;
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

export const HISTORY_TABLE_CONFIG: TableColumn[] = [
  {
    key: "tutor",
    label: "Tutor",
    className: "font-medium",
    cellType: "text",
  },
  {
    key: "tutee",
    label: "Tutorado",
    className: "font-medium",
    cellType: "text",
  },
  {
    key: "role",
    label: "Mi Rol",
    cellType: "text",
  },
  {
    key: "startDate",
    label: "Fecha Inicio",
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
    key: "status",
    label: "Estado",
    cellType: "badge",
  },
  {
    key: "action",
    label: "Acción",
    cellType: "button",
  },
];
