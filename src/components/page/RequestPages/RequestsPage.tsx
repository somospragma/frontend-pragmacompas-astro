import React, { useState, useEffect } from "react";
import { getTutoringRequests, type GetTutoringRequestsParams } from "@/infrastructure/services/getTutoringRequests";
import type { TutoringRequest } from "@/infrastructure/models/TutoringRequest";
import type { SessionUser } from "auth.config";
import MentorshipTable from "@/components/organisms/MentorShipTable/MentorShipTable";

// Types
interface MentorshipRequest {
  id: string;
  tutee: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    chapter: {
      id: string;
      name: string;
    };
    rol: string;
  };
  skills: {
    id: string;
    name: string;
  }[];
  needsDescription: string;
  requestStatus: string;
}

interface RequestWithMappedStatus {
  id: string;
  status: "pending" | "approved" | "assigned" | "rejected";
  mentor?: string | null;
  mentee: string;
  description: string;
  date: string;
  skills: string[];
}

type FilterType = "all" | "pending" | "approved" | "assigned" | "rejected";

interface TabCounts {
  all: number;
  pending: number;
  approved: number;
  assigned: number;
  rejected: number;
}

// Status mappings
const statusMapping = {
  Enviada: "pending" as const,
  Aprobada: "approved" as const,
  Asignada: "assigned" as const,
  Rechazada: "rejected" as const,
};

const reverseStatusMapping = {
  pending: "Enviada" as const,
  approved: "Aprobada" as const,
  assigned: "Asignada" as const,
  rejected: "Finalizada" as const,
};

export default function RequestsPage({ session }: { session: SessionUser }) {
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [counts, setCounts] = useState<TabCounts>({
    all: 0,
    pending: 0,
    approved: 0,
    assigned: 0,
    rejected: 0,
  });

  // Load requests from API
  const loadRequests = async (filter: FilterType = "all") => {
    try {
      setIsLoading(true);

      const params: GetTutoringRequestsParams = {};

      // Always include chapterId from session
      const chapterId = session.user.chapterId;
      if (chapterId) {
        params.chapterId = chapterId;
      }

      if (filter !== "all") {
        params.status = reverseStatusMapping[filter];
      }

      const response = await getTutoringRequests(params);

      // Map TutoringRequest data to MentorshipRequest format
      const mappedMentorshipRequests: MentorshipRequest[] = response.data.map((request: TutoringRequest) => ({
        id: request.id,
        tutee: {
          id: request.tutee.id || "",
          firstName: request.tutee.firstName,
          lastName: request.tutee.lastName,
          email: request.tutee.email,
          chapter: {
            id: request.tutee.chapterId || "",
            name: "Chapter", // You may need to fetch this from another source
          },
          rol: request.tutee.rol || "Tutorado",
        },
        skills: request.skills,
        needsDescription: request.needsDescription,
        requestStatus: request.requestStatus,
      }));

      setMentorshipRequests(mappedMentorshipRequests);

      // Keep mapped data for stats
      const mappedRequests = response.data.map((request: TutoringRequest) => ({
        ...request,
        status:
          statusMapping[request.requestStatus as keyof typeof statusMapping] ||
          (request.requestStatus.toLowerCase() as "pending"),
        mentee: `${request.tutee.firstName} ${request.tutee.lastName}`,
        description: request.needsDescription,
        skills: request.skills.map((skill) => skill.name),
        date: new Date().toLocaleDateString(), // You may want to add actual date from API
      })) as RequestWithMappedStatus[];

      return mappedRequests;
    } catch (error) {
      console.error("Error loading requests:", error);
      setMentorshipRequests([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Update counts
  const updateCounts = (requests: RequestWithMappedStatus[]) => {
    const newCounts = {
      all: requests.length,
      pending: requests.filter((r) => r.status === "pending").length,
      approved: requests.filter((r) => r.status === "approved").length,
      assigned: requests.filter((r) => r.status === "assigned").length,
      rejected: requests.filter((r) => r.status === "rejected").length,
    };
    setCounts(newCounts);
  };

  // Handle tab click
  const handleTabClick = async (filter: FilterType) => {
    setActiveFilter(filter);
    const requests = await loadRequests(filter);
    updateCounts(requests);
  };

  // Initialize component
  useEffect(() => {
    const init = async () => {
      const requests = await loadRequests("all");
      updateCounts(requests);
    };
    init();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Gestión de Solicitudes</h1>
          <p className="text-gray-600 dark:text-gray-300">Administra las solicitudes de mentoría del capítulo</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{counts.pending}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Pendientes</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{counts.approved}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Aprobadas</p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{counts.assigned}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Asignadas</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{counts.rejected}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Rechazadas</p>
              </div>
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: "all", label: "Todas", count: counts.all },
                { key: "approved", label: "Aprobadas", count: counts.approved },
                { key: "assigned", label: "Asignadas", count: counts.assigned },
                { key: "rejected", label: "Finalizadas", count: counts.rejected },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleTabClick(tab.key as FilterType)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeFilter === tab.key
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 py-0.5 px-2.5 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Mentorship Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {isLoading ? (
            <div className="flex flex-col items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">Cargando solicitudes...</p>
            </div>
          ) : (
            <MentorshipTable mentorshipRequests={mentorshipRequests} title="Solicitudes de Mentoría" />
          )}
        </div>
      </div>
    </div>
  );
}
