import { MentorshipStatus } from "@/shared/utils/enums/mentorshipStatus";

export interface Chapter {
  id: string;
  name: string;
}

export type UserRole = "Tutor" | "Tutorado" | "Administrador";
export type TutoringRequestStatus = MentorshipStatus;

export interface User {
  id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  googleUserId?: string;
  googleId?: string;
  googleClientId?: string;
  accessToken?: string;
  chapterId?: string;
  chapter: Chapter;
  rol: UserRole;
  activeTutoringLimit: number;
  slackId?: string;
  seniority: string;
  image?: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface TutoringRequest {
  id: string;
  tutee: User;
  skills: Skill[];
  needsDescription: string;
  requestStatus: TutoringRequestStatus;
  requestDate: string;
}

export interface TutoringSession {
  id: string;
  tutor: User;
  tutee: User;
  skills: Skill[];
  startDate: string;
  expectedEndDate: string;
  status: TutoringRequestStatus;
  objectives: string;
}

export interface Session {
  id: string;
  datetime: string;
  durationMinutes: number;
  locationLink: string;
  topicsCovered: string;
  notes: string;
}

export interface Feedback {
  id: string;
  evaluator: User;
  evaluationDate: string;
  tutoring: { id: string; tutor: User; tutee: User; skills: Skill[] };
  score: string;
  comments: string;
}

export interface MyRequestsResponse {
  requests: TutoringRequest[];
  tutoringsAsTutor: TutoringSession[];
  tutoringsAsTutee: TutoringSession[];
}
