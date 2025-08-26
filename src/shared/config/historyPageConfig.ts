import { Status } from "@/shared/utils/enums/status";

export interface HistoryTableConfig {
  title: string;
  emptyMessage: string;
  showActions: boolean;
  status: Status[];
}

export const HISTORY_PAGE_CONFIG = {
  active: {
    title: "Mentorías activas",
    emptyMessage: "No tienes mentorías activas en este momento",
    showActions: true,
    status: [Status.Activa],
  },
  completed: {
    title: "Mentorías completadas",
    emptyMessage: "No tienes mentorías completadas aún",
    showActions: false,
    status: [Status.Completada],
  },
} as const;
