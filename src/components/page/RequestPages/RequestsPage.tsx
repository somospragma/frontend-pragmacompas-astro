import React, { useState, useEffect } from "react";
import { getTutoringRequests, type GetTutoringRequestsParams } from "@/infrastructure/services/getTutoringRequests";
import type { TutoringRequest } from "@/infrastructure/models/TutoringRequest";
import type { SessionUser } from "auth.config";

// Types
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
  rejected: "Rechazada" as const,
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  assigned: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const statusLabels = {
  pending: "Pendiente",
  approved: "Aprobada",
  assigned: "Asignada",
  rejected: "Rechazada",
};

export default function RequestsPage({ session }: { session: SessionUser }) {
  const [allRequests, setAllRequests] = useState<RequestWithMappedStatus[]>([]);
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

      setAllRequests(mappedRequests);
      return mappedRequests;
    } catch (error) {
      console.error("Error loading requests:", error);
      setAllRequests([]);
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

  // Loading state component
  const LoadingState = () => (
    <tr>
      <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg font-medium text-gray-900 dark:text-white">Cargando solicitudes...</p>
        </div>
      </td>
    </tr>
  );

  // Empty state component
  const EmptyState = () => (
    <tr>
      <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
        <div className="flex flex-col items-center">
          <svg
            className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            ></path>
          </svg>
          <p className="text-lg font-medium text-gray-900 dark:text-white">No hay solicitudes</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Las solicitudes de mentoría aparecerán aquí</p>
        </div>
      </td>
    </tr>
  );

  // Request row component
  const RequestRow = ({ request }: { request: RequestWithMappedStatus }) => (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900 dark:text-white">{request.mentee}</div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1">
          {request.skills?.map((skill: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 dark:text-white">{request.description}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{request.date}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[request.status]}`}
        >
          {statusLabels[request.status]}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{request.mentor || "-"}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
          Ver
        </button>
        <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3">
          Asignar
        </button>
        <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Rechazar</button>
      </td>
    </tr>
  );

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
                { key: "pending", label: "Pendientes", count: counts.pending },
                { key: "approved", label: "Aprobadas", count: counts.approved },
                { key: "assigned", label: "Asignadas", count: counts.assigned },
                { key: "rejected", label: "Finalizadas/Rechazadas", count: counts.rejected },
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

        {/* Action Buttons */}
        <div className="mb-6 flex flex-wrap gap-4">
          <button
            onClick={() => handleTabClick(activeFilter)}
            className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            🔄 Actualizar
          </button>
          <button className="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors">
            📊 Exportar Reporte
          </button>
          <button className="bg-purple-600 dark:bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors">
            📧 Notificar Mentores
          </button>
        </div>

        {/* Requests Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Solicitudes de Mentoría</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Mentee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Habilidades
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Mentor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {isLoading ? (
                  <LoadingState />
                ) : allRequests.length === 0 ? (
                  <EmptyState />
                ) : (
                  allRequests.map((request, index) => <RequestRow key={request.id || index} request={request} />)
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
