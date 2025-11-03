import { useEffect, useState, useCallback, useMemo } from "react";
import { userStore } from "@/store/userStore";
import { TUTORING_STATE_FILTERS } from "@/shared/utils/enums/mentorshipsStateFilter";
import { MentorshipStatus } from "@/shared/utils/enums/mentorshipStatus";
import { useStore } from "@nanostores/react";
import TutoringTable from "@/components/organisms/TutoringTable";
import { getTutoring } from "@/infrastructure/services/getTutorings";
import type { Tutoring } from "@/infrastructure/models/Tutoring";
import StatCard from "@/components/atoms/StatCard";
import SectionHeader from "@/components/atoms/SectionHeader";
import { toast } from "sonner";
import { logger } from "@/shared/utils/logger";
import { getErrorMessage } from "@/shared/types/error.types";
import { useAccessibilityAnnouncer } from "@/shared/hooks/useAccessibilityAnnouncer";
import { AccessibilityAnnouncer } from "@/components/atoms/AccessibilityAnnouncer";

const TutoringPage: React.FC = () => {
  const user = useStore(userStore);
  const [tutoringData, setTutoringData] = useState<Tutoring[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { announce, message: announceMessage } = useAccessibilityAnnouncer();

  /**
   * Loads tutoring data for the current chapter
   */
  const loadTutoringData = useCallback(async () => {
    if (!user.chapterId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const response = await getTutoring({ chapterId: user.chapterId });
      setTutoringData(response.data);

      announce(`Tutorías cargadas: ${response.data.length} registros encontrados.`);
    } catch (error) {
      logger.error("Error loading tutoring data", error as Error, {
        chapterId: user.chapterId,
        userId: user.userId,
      });

      const errorMessage = getErrorMessage(error);
      announce(`Error al cargar tutorías: ${errorMessage}`);

      toast.error("Error al cargar tutorías", {
        description: errorMessage || "No se pudieron cargar las tutorías. Por favor, intenta nuevamente.",
      });

      setTutoringData([]);
    } finally {
      setIsLoading(false);
    }
  }, [user.chapterId, user.userId, announce]);

  useEffect(() => {
    if (user.chapterId) {
      loadTutoringData();
    }
  }, [user.chapterId, loadTutoringData]);

  // Memoize statistics to avoid recalculation on every render
  const statistics = useMemo(
    () => ({
      total: tutoringData.filter((tutoring) => TUTORING_STATE_FILTERS.includes(tutoring.status)).length,
      completed: tutoringData.filter((tutoring) => tutoring.status === MentorshipStatus.COMPLETED).length,
      cancelled: tutoringData.filter((tutoring) => tutoring.status === MentorshipStatus.CANCELLED).length,
    }),
    [tutoringData]
  );

  return (
    <div className="space-y-10">
      <SectionHeader description="Historial y seguimiento de tutorías" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          value={statistics.total}
          label="Total Tutorías"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
          iconBgColor="bg-primary/10"
          iconColor="text-primary"
        />

        <StatCard
          value={statistics.completed}
          label="Completadas"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          }
          iconBgColor="bg-green-500/10"
          iconColor="text-green-500"
        />

        <StatCard
          value={statistics.cancelled}
          label="Canceladas"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
          }
          iconBgColor="bg-red-500/10"
          iconColor="text-red-500"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64" role="status" aria-live="polite">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span className="sr-only">Cargando tutorías...</span>
        </div>
      ) : (
        <TutoringTable title="Tutorías" data={tutoringData} refetch={loadTutoringData} />
      )}

      <AccessibilityAnnouncer message={announceMessage} />
    </div>
  );
};

export default TutoringPage;
