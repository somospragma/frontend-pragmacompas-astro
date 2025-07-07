import type { Skill, User } from "./TutoringRequest";

export type TutoringStatus = "Activa" | "Completada" | "Cancelada";

export interface Tutoring {
  id: string;
  tutor: User;
  tutee: User;
  skills: Skill[];
  startDate: string;
  expectedEndDate: string;
  status: TutoringStatus;
  objectives: string;
}
