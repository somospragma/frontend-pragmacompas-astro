import { MentorshipStatus } from "@/shared/utils/enums/mentorshipStatus";
import { MentorshipType } from "../utils/enums/mentorshipType";

export interface HistoryTableConfig {
  title: string;
  emptyMessage: string;
  showActions: boolean;
  status: MentorshipStatus[];
}

export const HISTORY_PAGE_CONFIG = {
  active: {
    title: "Solicitudes y tutorías activas",
    emptyMessage: "No tienes solicitudes o tutorías activas en este momento",
    showActions: true,
    showType: true,
    status: [
      MentorshipStatus.ACTIVE,
      MentorshipStatus.PENDING,
      MentorshipStatus.AVAILABLE,
      MentorshipStatus.CONVERSING,
      MentorshipStatus.CANCELLING,
    ],
    type: [MentorshipType.REQUEST, MentorshipType.MENTORSHIP],
  },
  completed: {
    title: "Tutorías completadas",
    emptyMessage: "No tienes tutorías completadas aún",
    showActions: false,
    showType: false,
    status: [MentorshipStatus.COMPLETED, MentorshipStatus.CANCELLED],
    type: [MentorshipType.MENTORSHIP],
  },
} as const;
