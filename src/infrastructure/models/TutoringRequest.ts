export interface Chapter {
  id: string;
  name: string;
}

export type UserRole = "Tutor" | "Tutorado" | "Administrador";
export type TutoringRequestStatus = "Enviada" | "Aprobada" | "Asignada" | "Rechazada";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  chapter: Chapter;
  rol: UserRole;
  activeTutoringLimit: number;
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
}
