import type { DashboardStatistics } from "@/infrastructure/models/DashboardStatistics";
import { getDashboardStatistics } from "@/infrastructure/services/getDashboardStatistics";
import { useCallback, useEffect, useMemo, useState } from "react";
import StatCard from "@/components/atoms/StatCard";

/**
 * DashboardStats component displays key statistics for the dashboard
 * including pending requests, completed sessions, and cancelled requests
 *
 * @component
 * @example
 * ```tsx
 * <DashboardStats chapterId="chapter-123" />
 * ```
 */

interface Props {
  readonly chapterId: string;
}

export default function DashboardStats({ chapterId }: Props) {
  const [statistics, setStatistics] = useState<DashboardStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles navigation to pending requests page
   */
  const handlePendingRequestsClick = useCallback(() => {
    window.location.href = "/dashboard/requests";
  }, []);

  /**
   * Memoized loading skeleton array
   */
  const loadingSkeletons = useMemo(() => [...Array(3)], []);

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
      <section
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        aria-busy="true"
        aria-label="Cargando estadísticas"
      >
        {loadingSkeletons.map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse" role="status">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-muted rounded w-1/2"></div>
            <span className="sr-only">Cargando estadísticas...</span>
          </div>
        ))}
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-8"
        role="alert"
        aria-live="assertive"
      >
        <p className="text-destructive">⚠️ {error}</p>
      </section>
    );
  }

  if (!statistics) {
    return null;
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" aria-label="Estadísticas del dashboard">
      {/* Solicitudes Pendientes */}
      <StatCard
        value={statistics.requestsByStatus.Pendiente}
        label="Solicitudes Pendientes"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
        iconBgColor="bg-yellow-500/10"
        iconColor="text-yellow-500"
        subtitle="Requieren atención"
        subtitleColor="text-yellow-600"
        onClick={handlePendingRequestsClick}
      />

      {/* Sesiones Completadas */}
      <StatCard
        value={statistics.tutoringsByStatus.Completada}
        label="Sesiones Completadas"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
        iconBgColor="bg-purple-500/10"
        iconColor="text-purple-500"
        subtitle="Este mes"
        subtitleColor="text-green-600"
      />

      {/* Solicitudes Canceladas */}
      <StatCard
        value={statistics.requestsByStatus.Cancelada}
        label="Solicitudes Canceladas"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
        iconBgColor="bg-red-500/10"
        iconColor="text-red-500"
        subtitleColor="text-red-600"
      />
    </section>
  );
}
