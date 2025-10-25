import { useState } from "react";
import MentorshipActionModal from "./MentorshipActionModal/MentorshipActionModal";
import {
  ADMIN_MENTORSHIP_STATE_FILTERS,
  TUTOR_MENTORSHIP_STATE_FILTERS,
} from "@/shared/utils/enums/mentorshipsStateFilter";
import MentorshipRequest from "@/components/page/MentoShipRequest/MentorshipRequest";
import MentorshipItemCard from "@/components/molecules/MentorshipItemCard";
interface Props {
  mentorshipRequests: MentorshipRequest[];
  title?: string;
  isDashboard?: boolean;
  refetch?: () => void;
}

const MentorshipTable = ({ mentorshipRequests, title = "Solicitudes de Tutoría", isDashboard, refetch }: Props) => {
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
        <div className="flex flex-col items-start gap-4 md:flex-row">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <div className="flex flex-col gap-4 w-full md:flex-row md:justify-end flex-1">
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
            <MentorshipItemCard
              key={request.id}
              id={request.id}
              user={request.tutee}
              status={request.requestStatus}
              description={request.needsDescription}
              skills={request.skills}
              onClick={() => handleRequestClick(request)}
            />
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
          }}
          onRefetch={() => {
            refetch?.();
          }}
        />
      )}
    </>
  );
};

export default MentorshipTable;
