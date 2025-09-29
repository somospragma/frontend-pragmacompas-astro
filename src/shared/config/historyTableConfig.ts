import type { UserRole } from "@/infrastructure/models/TutoringRequest";

export interface MentorshipData {
  id: string;
  type: string;
  myRole: UserRole;
  tutee: {
    name: string;
    email?: string;
    role: UserRole;
    id: string;
  };
  tutor: {
    name: string;
    email?: string;
    role: UserRole;
    id: string;
  };
  status: string;
  startDate: string;
  chapter: string;
  skills: string[];
  action: string[];
}

export type CellValue = string | string[];

export interface TableColumn {
  key: string;
  label: string;
  className?: string;
  cellType?: "text" | "badge" | "skills" | "button";
}

export const HISTORY_TABLE_CONFIG: TableColumn[] = [
  {
    key: "tutor.name",
    label: "Tutor",
    className: "font-medium",
    cellType: "text",
  },
  {
    key: "tutee.name",
    label: "Tutorado",
    className: "font-medium",
    cellType: "text",
  },
  {
    key: "myRole",
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
    key: "type",
    label: "Tipo",
    cellType: "text",
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
