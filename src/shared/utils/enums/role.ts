export enum UserRole {
  TUTOR = "Tutor",
  TUTEE = "Tutorado",
  ADMINISTRADOR = "Administrador",
}

export const ROLE_HIERARCHY = {
  [UserRole.ADMINISTRADOR]: 1,
  [UserRole.TUTOR]: 2,
  [UserRole.TUTEE]: 3,
} as const;
