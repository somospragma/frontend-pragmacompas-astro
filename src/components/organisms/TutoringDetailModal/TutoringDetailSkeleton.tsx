import React, { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * TutoringDetailSkeleton component displays a loading skeleton for tutoring details.
 * Shows placeholder elements for user info, status, skills, dates, and feedback.
 *
 * @component
 * @example
 * ```tsx
 * <TutoringDetailSkeleton />
 * ```
 */
export const TutoringDetailSkeleton: React.FC = () => {
  const containerClassName = useMemo(() => "pr-4 space-y-6 pt-4", []);

  const userSectionClassName = useMemo(() => "space-y-3", []);

  const avatarContainerClassName = useMemo(() => "flex items-center gap-4", []);

  const avatarSkeletonClassName = useMemo(() => "w-12 h-12 rounded-full", []);

  const userInfoClassName = useMemo(() => "flex-1 space-y-2", []);

  const statusSectionClassName = useMemo(() => "space-y-2", []);

  const statusContainerClassName = useMemo(() => "flex items-center gap-2", []);

  const skillsSectionClassName = useMemo(() => "space-y-2", []);

  const skillsContainerClassName = useMemo(() => "flex flex-wrap gap-2", []);

  const datesSectionClassName = useMemo(() => "space-y-2", []);

  const datesGridClassName = useMemo(() => "grid grid-cols-1 sm:grid-cols-2 gap-4", []);

  const dateItemClassName = useMemo(() => "space-y-1", []);

  const feedbackSectionClassName = useMemo(() => "space-y-4", []);

  const feedbackCardClassName = useMemo(
    () => "bg-slate-800/30 rounded-lg border border-slate-700/30 p-4 space-y-3",
    []
  );

  const feedbackHeaderClassName = useMemo(() => "flex items-center justify-between", []);

  const feedbackActionsClassName = useMemo(() => "flex items-center gap-2", []);

  return (
    <ScrollArea className="flex-1 min-h-0" role="status" aria-label="Cargando detalles de tutoría">
      <div className={containerClassName}>
        {/* User Section */}
        <section className={userSectionClassName} aria-label="Información del usuario">
          <div className={avatarContainerClassName}>
            <Skeleton className={avatarSkeletonClassName} aria-label="Cargando avatar" />
            <div className={userInfoClassName}>
              <Skeleton className="h-4 w-40" aria-label="Cargando nombre" />
              <Skeleton className="h-3 w-48" aria-label="Cargando correo" />
              <Skeleton className="h-3 w-32" aria-label="Cargando información adicional" />
            </div>
          </div>
        </section>

        {/* Status Section */}
        <section className={statusSectionClassName} aria-label="Estado de la tutoría">
          <div className={statusContainerClassName}>
            <Skeleton className="h-4 w-16" aria-label="Cargando etiqueta de estado" />
            <Skeleton className="h-6 w-24 rounded-full" aria-label="Cargando estado" />
          </div>
        </section>

        {/* Skills Section */}
        <section className={skillsSectionClassName} aria-label="Habilidades">
          <Skeleton className="h-4 w-40" aria-label="Cargando título de habilidades" />
          <div className={skillsContainerClassName}>
            <Skeleton className="h-6 w-20 rounded-full" aria-label="Cargando habilidad" />
            <Skeleton className="h-6 w-24 rounded-full" aria-label="Cargando habilidad" />
            <Skeleton className="h-6 w-28 rounded-full" aria-label="Cargando habilidad" />
          </div>
        </section>

        {/* Dates Section */}
        <section className={datesSectionClassName} aria-label="Fechas de la tutoría">
          <Skeleton className="h-4 w-36" aria-label="Cargando título de fechas" />
          <div className={datesGridClassName}>
            <div className={dateItemClassName}>
              <Skeleton className="h-3 w-32" aria-label="Cargando etiqueta de fecha" />
              <Skeleton className="h-4 w-40" aria-label="Cargando fecha" />
            </div>
            <div className={dateItemClassName}>
              <Skeleton className="h-3 w-32" aria-label="Cargando etiqueta de fecha" />
              <Skeleton className="h-4 w-40" aria-label="Cargando fecha" />
            </div>
            <div>
              <Skeleton className="h-9 w-36 rounded-md" aria-label="Cargando botón" />
            </div>
          </div>
        </section>

        {/* Feedback Section */}
        <section className={feedbackSectionClassName} aria-label="Retroalimentación">
          <Skeleton className="h-4 w-36" aria-label="Cargando título de retroalimentación" />

          <article className={feedbackCardClassName} aria-label="Cargando primera retroalimentación">
            <div className={feedbackHeaderClassName}>
              <Skeleton className="h-5 w-48" aria-label="Cargando nombre del evaluador" />
              <div className={feedbackActionsClassName}>
                <Skeleton className="h-4 w-20" aria-label="Cargando fecha" />
              </div>
            </div>
            <Skeleton className="h-16 w-full" aria-label="Cargando comentarios" />
            <Skeleton className="h-3 w-32" aria-label="Cargando puntuación" />
          </article>

          <article className={feedbackCardClassName} aria-label="Cargando segunda retroalimentación">
            <div className={feedbackHeaderClassName}>
              <Skeleton className="h-5 w-48" aria-label="Cargando nombre del evaluador" />
              <div className={feedbackActionsClassName}>
                <Skeleton className="h-4 w-20" aria-label="Cargando fecha" />
              </div>
            </div>
            <Skeleton className="h-16 w-full" aria-label="Cargando comentarios" />
            <Skeleton className="h-3 w-32" aria-label="Cargando puntuación" />
          </article>
        </section>
      </div>
    </ScrollArea>
  );
};
