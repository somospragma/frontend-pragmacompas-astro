import type { MentorshipStatus } from "@/shared/utils/enums/mentorshipStatus";
import type { Feedback, Session, Skill, User } from "./TutoringRequest";

export interface TutoringSummary {
  id: string;
  tutor: User;
  tutee: User;
  skills: Skill[];
  startDate: string;
  expectedEndDate: string;
  status: MentorshipStatus;
  objectives: string;
  finalActUrl: string;
  createdAt: string;
  updatedAt: string;
  sessions: Session[];
  feedbacks: Feedback[];
}
