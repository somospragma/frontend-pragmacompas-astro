import { Status } from "@/shared/utils/enums/status";
import { MentorshipState } from "../entities/mentorshipState";

export interface HistoryTableConfig {
  title: string;
  emptyMessage: string;
  showActions: boolean;
  status: Status[];
}

export const HISTORY_PAGE_CONFIG = {
  active: {
    title: "Tutorías activas",
    emptyMessage: "No tienes tutorías activas en este momento",
    showActions: true,
    status: [Status.Activa, MentorshipState.PENDING, MentorshipState.APPROVED],
  },
  completed: {
    title: "Tutorías completadas",
    emptyMessage: "No tienes tutorías completadas aún",
    showActions: false,
    status: [Status.Completada],
  },
} as const;
