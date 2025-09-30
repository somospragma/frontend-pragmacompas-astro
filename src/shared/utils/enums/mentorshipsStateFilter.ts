import { MentorshipStatus } from "./mentorshipStatus";
export const ADMIN_MENTORSHIP_STATE_FILTERS = [
  MentorshipStatus.PENDING,
  MentorshipStatus.COMPLETED,
  MentorshipStatus.CANCELLED,
  MentorshipStatus.CANCELLING,
];

export const TUTOR_MENTORSHIP_STATE_FILTERS = [MentorshipStatus.AVAILABLE, MentorshipStatus.CONVERSING];

export const TUTORING_STATE_FILTERS = [
  MentorshipStatus.COMPLETED,
  MentorshipStatus.CANCELLED,
  MentorshipStatus.CANCELLING,
];
