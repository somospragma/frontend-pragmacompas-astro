import { useEffect, useState } from "react";
import { userStore } from "@/store/userStore";
import { TUTORING_STATE_FILTERS } from "@/shared/utils/enums/mentorshipsStateFilter";
import { MentorshipStatus } from "@/shared/utils/enums/mentorshipStatus";
import { useStore } from "@nanostores/react";
import TutoringTable from "@/components/organisms/TutoringTable";
import { getTutoring } from "@/infrastructure/services/getTutorings";
import type { Tutoring } from "@/infrastructure/models/Tutoring";
import StatCard from "@/components/atoms/StatCard";
import SectionHeader from "@/components/atoms/SectionHeader";

const TutoringPage: React.FC = () => {
  const user = useStore(userStore);
  const [tutoringData, setTutoringData] = useState<Tutoring[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadTutoringData = async () => {
    if (!user.chapterId) return;

    setIsLoading(true);

    try {
      const response = await getTutoring({ chapterId: user.chapterId });
      setTutoringData(response.data);
    } catch (error) {
      console.error("Error loading tutoring data:", error);
      setTutoringData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user.chapterId) {
      loadTutoringData();
    }
  }, [user.chapterId]);

  return (
    <div className="space-y-10">
      <SectionHeader description="Historial y seguimiento de tutorías" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          value={tutoringData.filter((request) => TUTORING_STATE_FILTERS.includes(request.status)).length}
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
          value={tutoringData.filter((request) => request.status === MentorshipStatus.COMPLETED).length}
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
          value={tutoringData.filter((request) => request.status === MentorshipStatus.CANCELLED).length}
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
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <TutoringTable title="Tutorías" data={tutoringData} refetch={loadTutoringData} />
      )}
    </div>
  );
};

export default TutoringPage;
