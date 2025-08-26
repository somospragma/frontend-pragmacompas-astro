export interface Chapter {
  id: string;
  name: string;
}

export type UserRole = "Tutor" | "Tutorado" | "Administrador";
export type TutoringRequestStatus =
  | "Pendiente"
  | "Enviada"
  | "Aprobada"
  | "Asignada"
  | "Conversando"
  | "Rechazada"
  | "Finalizada";

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  chapter?: Chapter;
  rol?: UserRole;
  activeTutoringLimit: number;
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
