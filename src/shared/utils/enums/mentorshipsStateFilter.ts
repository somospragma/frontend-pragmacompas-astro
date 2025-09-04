import { MentorshipState } from "@/shared/entities/mentorshipState";

export const ADMIN_MENTORSHIP_STATE_FILTERS = [MentorshipState.PENDING, MentorshipState.CANCELLING];

export const TUTOR_MENTORSHIP_STATE_FILTERS = [MentorshipState.APPROVED, MentorshipState.CONVERSING];
