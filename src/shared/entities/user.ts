export enum SENIORITY {
  TRAINEE,
  JUNIOR,
  MID,
  SENIOR,
  MASTER,
}

export interface User {
  id: string;
  name: string;
  seniority: SENIORITY;
  accountId: number;
  avatar: string;
  skills: string[];
  location: string;
  email: string;
  startDate: Date;
  aiTools: string[];
  birthday: Date;
}
