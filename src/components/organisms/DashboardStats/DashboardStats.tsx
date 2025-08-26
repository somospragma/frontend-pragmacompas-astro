import { useEffect, useState } from "react";
import { getDashboardStatistics } from "@/infrastructure/services/getDashboardStatistics";
import type { DashboardStatistics } from "@/infrastructure/models/DashboardStatistics";

interface Props {
  chapterId: string;
}

export default function DashboardStats({ chapterId }: Props) {
  const [statistics, setStatistics] = useState<DashboardStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getDashboardStatistics({ chapterId });

        if (response.data) {
          setStatistics(response.data);
        } else if (response.message) {
          setError(response.message);
        }
      } catch (err) {
        setError("Error al cargar las estadísticas");
        console.error("Error fetching dashboard statistics:", err);
      } finally {
        setLoading(false);
      }
    };

    if (chapterId) {
      fetchStatistics();
    }
  }, [chapterId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-muted rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-8">
        <p className="text-destructive">⚠️ {error}</p>
      </div>
    );
  }

  if (!statistics) {
    return null;
  }

  const totalRequests = Object.values(statistics.requestsByStatus).reduce((sum, count) => sum + count, 0);
  const totalActiveTutors = statistics.activeTutorsByChapter.activeTutors;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Mentores */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">{totalActiveTutors}</p>
            <p className="text-muted-foreground text-sm">Total Mentores</p>
          </div>
          <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
          </div>
        </div>
        <div className="mt-2 text-xs text-green-600">
          {statistics.activeTutorsByChapter.activeTutors > 0 ? "Activos" : "Sin actividad"}
        </div>
      </div>

      {/* Total Mentees */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">{totalRequests}</p>
            <p className="text-muted-foreground text-sm">Total Mentees</p>
          </div>
          <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  "M17 20h5v-2a3 3 0 00-5.356-1.857 M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857 " +
                  "M7 20H2v-2a3 3 0 015.356-1.857 M7 20v-2c0-.656.126-1.283.356-1.857 m0 0a5.002 5.002 0 019.288 0 " +
                  "M15 7a3 3 0 11-6 0 3 3 0 016 0 zm6 3a2 2 0 11-4 0 2 2 0 014 0z M7 10a2 2 0 11-4 0 2 2 0 014 0z"
                }
              />
            </svg>
          </div>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          {Math.round((statistics.requestsByStatus.Finalizada / totalRequests) * 100) || 0}% finalizadas
        </div>
      </div>

      {/* Solicitudes Pendientes */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">{statistics.requestsByStatus.Pendiente}</p>
            <p className="text-muted-foreground text-sm">Solicitudes Pendientes</p>
          </div>
          <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div className="mt-2 text-xs text-yellow-600">Requieren atención</div>
      </div>

      {/* Sesiones Completadas */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">{statistics.tutoringsByStatus.Completada}</p>
            <p className="text-muted-foreground text-sm">Sesiones Completadas</p>
          </div>
          <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div className="mt-2 text-xs text-green-600">Este mes</div>
      </div>
    </div>
  );
}
