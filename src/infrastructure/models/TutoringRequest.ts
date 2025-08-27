import type { MentorshipState } from "@/shared/entities/mentorshipState";

export interface Chapter {
  id: string;
  name: string;
}

export type UserRole = "Tutor" | "Tutorado" | "Administrador";
export type TutoringRequestStatus = MentorshipState;

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  googleUserId: string;
  chapterId?: string;
  rol?: UserRole;
  activeTutoringLimit?: number;
  slackId?: string;
  seniority?: string;
}

export interface Skill {
  id: string;
  name: string;
  categories: SkillCategory[];
}

export interface SkillCategory {
  id: string;
}

export interface TutoringRequest {
  id: string;
  tutee: User;
  skills: Skill[];
  needsDescription: string;
  requestStatus: TutoringRequestStatus;
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

export interface MyRequestsResponse {
  requests: TutoringRequest[];
  tutoringsAsTutor: TutoringSession[];
  tutoringsAsTutee: TutoringSession[];
}
