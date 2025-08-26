export interface RequestsByStatus {
  Aprobada: number;
  Asignada: number;
  Finalizada: number;
  Pendiente: number;
  Cancelada: number;
  Conversando: number;
}

export interface TutoringsByStatus {
  Activa: number;
  Completada: number;
  Cancelada: number;
}

export interface ActiveTutorsByChapter {
  activeTutors: number;
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
