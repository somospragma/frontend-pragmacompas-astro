import MentorshipTable from "@/components/organisms/MentorShipTable/MentorShipTable";
import type { TutoringRequest } from "@/infrastructure/models/TutoringRequest";
import { useEffect, useState } from "react";
import { userStore } from "@/store/userStore";
import { TUTORING_STATE_FILTERS } from "@/shared/utils/enums/mentorshipsStateFilter";
import { MentorshipStatus } from "@/shared/utils/enums/mentorshipStatus";
import { useStore } from "@nanostores/react";

type TutoringPage = Omit<TutoringRequest, "tutee"> & {
  tutee: TutoringRequest["tutee"] & {
    id: string;
    rol: string;
    chapter: {
      id: string;
      name: string;
    };
    slackId?: string;
  };
};

const TutoringPage = () => {
  const user = useStore(userStore);
  const [mentorshipRequests, setMentorshipRequests] = useState<TutoringPage[]>([]);

  const handleGetTutoringRequests = () => {
    const data = {
      data: [
        {
          id: "1",
          requestStatus: MentorshipStatus.COMPLETED,
          requestDate: "2023-10-01T00:00:00Z",
          skills: [{ name: "JavaScript" }, { name: "React" }],
          needsDescription: "Necesito ayuda con React",
          tutee: {
            id: "t1",
            firstName: "Juan",
            lastName: "Pérez",
            email: "juan.perez@example.com",
            rol: "Tutorado",
            slackId: "U123456",
            chapter: {
              id: "c1",
              name: "Capítulo 1",
            },
          },
        },
      ],
    };
    const transformedData = data.data.map((request) => ({
      ...request,
      needsDescription: request.needsDescription || "",
      tutee: {
        ...request.tutee,
        id: request.tutee.id || "",
        rol: request.tutee.rol || "Tutorado",
        chapter: {
          id: request.tutee?.chapter ? request.tutee.chapter.id : "",
          name: request.tutee?.chapter ? request.tutee.chapter.name : "",
        },
        slackId: request.tutee.slackId || "",
      },
    })) as TutoringPage[];

    setMentorshipRequests(transformedData);
  };

  useEffect(() => {
    if (user.chapterId) {
      handleGetTutoringRequests();
    }
  }, [user.chapterId]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">
                {mentorshipRequests.filter((request) => TUTORING_STATE_FILTERS.includes(request.requestStatus)).length}
              </p>
              <p className="text-muted-foreground text-sm">Total Tutorías</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">
                {mentorshipRequests.filter((request) => request.requestStatus === MentorshipStatus.COMPLETED).length}
              </p>
              <p className="text-muted-foreground text-sm">Completadas</p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">
                {mentorshipRequests.filter((request) => request.requestStatus === MentorshipStatus.CANCELLED).length}
              </p>
              <p className="text-muted-foreground text-sm">Canceladas</p>
            </div>
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <MentorshipTable
        isDashboard={true}
        title="Tutorías"
        mentorshipRequests={mentorshipRequests}
        refetch={handleGetTutoringRequests}
      />
    </div>
  );
};

export default TutoringPage;
