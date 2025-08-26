import { Status } from "@/shared/utils/enums/status";

export interface HistoryTableConfig {
  title: string;
  emptyMessage: string;
  showActions: boolean;
  status: Status[];
}

export const HISTORY_TABLE_CONFIGS: Record<"active" | "completed", HistoryTableConfig> = {
  active: {
    title: "Mentorías activas",
    emptyMessage: "No tienes solicitudes ni tutorías activas",
    showActions: true,
    status: [Status.Activa],
  },
  completed: {
    title: "Mentorías completadas",
    emptyMessage: "No tienes tutorías completadas",
    showActions: false,
    status: [Status.Completada],
  },
} as const;
