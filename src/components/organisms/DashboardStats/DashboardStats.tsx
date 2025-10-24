import type { DashboardStatistics } from "@/infrastructure/models/DashboardStatistics";
import { getDashboardStatistics } from "@/infrastructure/services/getDashboardStatistics";
import { useEffect, useState } from "react";

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[...Array(3)].map((_, i) => (
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

  const handlePendingRequestsClick = () => {
    window.location.href = "/dashboard/requests";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Solicitudes Pendientes */}
      <div
        className="bg-card border border-border rounded-lg p-6 cursor-pointer hover:bg-card/80 transition-colors duration-200"
        onClick={handlePendingRequestsClick}
      >
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

      {/* Solicitudes Canceladas */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">{statistics.requestsByStatus.Cancelada}</p>
            <p className="text-muted-foreground text-sm">Solicitudes Canceladas</p>
          </div>
          <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div className="mt-2 text-xs text-red-600"></div>
      </div>
    </div>
  );
}
