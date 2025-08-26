import MentorshipTable from "@/components/organisms/MentorShipTable/MentorShipTable";
import { getTutoringRequests } from "@/infrastructure/services/getTutoringRequests";
import type { TutoringRequest } from "@/infrastructure/models/TutoringRequest";
import { useEffect, useState } from "react";

// Transform TutoringRequest to match MentorshipTable's expected interface
type MentorshipRequest = Omit<TutoringRequest, "tutee"> & {
  tutee: TutoringRequest["tutee"] & {
    id: string; // Make id required
    rol: string; // Make rol required
    chapter: {
      id: string;
      name: string;
    };
  };
};

const MentorshipRequest = () => {
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([]);

  useEffect(() => {
    const handleGetTutoringRequests = () => {
      getTutoringRequests({}).then((data) => {
        // Transform TutoringRequest[] to match MentorshipRequest interface
        const transformedData: MentorshipRequest[] = data.data.map((request) => ({
          ...request,
          tutee: {
            ...request.tutee,
            id: request.tutee.id || "", // Ensure id is always a string
            rol: request.tutee.rol || "Tutorado", // Provide default role
            chapter: {
              id: request.tutee.chapterId || "",
              name: "Chapter Name", // You might want to fetch this from another API
            },
          },
        }));
        setMentorshipRequests(transformedData);
      });
    };

    handleGetTutoringRequests();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">5</p>
              <p className="text-muted-foreground text-sm">Total Solicitudes</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">2</p>
              <p className="text-muted-foreground text-sm">Pendientes</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">1</p>
              <p className="text-muted-foreground text-sm">Aprobadas</p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <MentorshipTable title="Solicitudes de Mentoría" mentorshipRequests={mentorshipRequests} />
    </div>
  );
};

export default MentorshipRequest;
