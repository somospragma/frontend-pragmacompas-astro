export interface RequestsByStatus {
  Enviada: number;
  Aprobada: number;
  Asignada: number;
  Rechazada: number;
}

export interface TutoringsByStatus {
  Activa: number;
  Completada: number;
  Cancelada: number;
}

export interface ActiveTutorsByChapter {
  [chapterName: string]: number;
}

export interface DashboardStatistics {
  requestsByStatus: RequestsByStatus;
  tutoringsByStatus: TutoringsByStatus;
  activeTutorsByChapter: ActiveTutorsByChapter;
}

export interface DashboardStatisticsResponse {
  data?: DashboardStatistics;
  message?: string;
  timestamp?: string;
}
