import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { MentorshipState } from "@/shared/entities/mentorshipState";
import MentorshipActionModal from "./MentorshipActionModal/MentorshipActionModal";
import {
  ADMIN_MENTORSHIP_STATE_FILTERS,
  TUTOR_MENTORSHIP_STATE_FILTERS,
} from "@/shared/utils/enums/mentorshipsStateFilter";
import type MentorshipRequest from "@/components/page/MentoShipRequest/MentorshipRequest";
interface Props {
  mentorshipRequests: MentorshipRequest[];
  title?: string;
  isDashboard?: boolean;
  refetch?: () => void;
}

export const renderState = (state?: MentorshipState) => {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs ${
        state === MentorshipState.PENDING || state === MentorshipState.CONVERSING
          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
          : state === MentorshipState.COMPLETED || state === MentorshipState.APPROVED
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            : state === MentorshipState.CANCELLED || state === MentorshipState.CANCELLING
              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      }`}
    >
      {state}
    </span>
  );
};

export default function MentorshipTable({
  mentorshipRequests,
  title = "Solicitudes de Mentoría",
  isDashboard,
  refetch,
}: Props) {
  const [selectedRequest, setSelectedRequest] = useState<MentorshipRequest>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos los estados");

  const handleRequestClick = (request: MentorshipRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const filteredRequests = mentorshipRequests.filter((request) => {
    const fullName = `${request.tutee.firstName} ${request.tutee.lastName}`;
    const matchesSearch =
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.tutee.chapter.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === "Todos los estados" || request.requestStatus === selectedStatus;
    const matchesByRol = isDashboard
      ? ADMIN_MENTORSHIP_STATE_FILTERS.some((state) => state === request.requestStatus)
      : TUTOR_MENTORSHIP_STATE_FILTERS.some((state) => state === request.requestStatus);

    return matchesSearch && matchesStatus && matchesByRol;
  });

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <div className="flex gap-4">
            <input
              className="bg-input rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              type="text"
              placeholder="Buscar solicitudes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {!isDashboard && (
              <select
                className="bg-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option>Todos los estados</option>
                {TUTOR_MENTORSHIP_STATE_FILTERS.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card
              key={request.id}
              className="bg-card border border-border cursor-pointer hover:bg-accent transition-colors"
              onClick={() => handleRequestClick(request)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {request.tutee?.firstName ? request.tutee.firstName.charAt(0) : "?"}
                        {request.tutee?.lastName ? request.tutee.lastName.charAt(0) : "?"}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-foreground font-semibold">
                        {request.tutee?.firstName} {request.tutee?.lastName}
                      </h3>
                      <p className="text-muted-foreground text-xs">{request.tutee?.chapter?.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {request.needsDescription} - Skills:{request.skills.map((skill) => skill.name).join(", ")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">{renderState(request.requestStatus)}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No se encontraron solicitudes que coincidan con los filtros.</p>
          </div>
        )}
      </div>
      {selectedRequest && (
        <MentorshipActionModal
          key={`modal-${selectedRequest?.id}`}
          isOpen={isModalOpen}
          selectedRequest={selectedRequest}
          onOpenChange={() => {
            setIsModalOpen(false);
            refetch?.();
          }}
        />
      )}
    </>
  );
}
