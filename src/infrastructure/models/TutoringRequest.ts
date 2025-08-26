export interface Chapter {
  id: string;
  name: string;
}

export type UserRole = "Tutor" | "Tutorado" | "Administrador";
export type TutoringRequestStatus = "Enviada" | "Aprobada" | "Asignada" | "Rechazada";

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  googleUserId: string;
  chapterId?: string;
  rol?: UserRole;
  activeTutoringLimit?: number;
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
