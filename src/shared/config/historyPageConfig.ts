import { MentorshipStatus } from "@/shared/utils/enums/mentorshipStatus";

export interface HistoryTableConfig {
  title: string;
  emptyMessage: string;
  showActions: boolean;
  status: MentorshipStatus[];
}

export const HISTORY_PAGE_CONFIG = {
  active: {
    title: "Tutorías activas",
    emptyMessage: "No tienes solicitudes o tutorías activas en este momento",
    showActions: true,
    status: [
      MentorshipStatus.ACTIVE,
      MentorshipStatus.PENDING,
      MentorshipStatus.AVAILABLE,
      MentorshipStatus.CONVERSING,
      MentorshipStatus.CANCELLING,
    ],
  },
  completed: {
    title: "Tutorías completadas",
    emptyMessage: "No tienes tutorías completadas aún",
    showActions: false,
    status: [MentorshipStatus.COMPLETED, MentorshipStatus.CANCELLED],
  },
} as const;
