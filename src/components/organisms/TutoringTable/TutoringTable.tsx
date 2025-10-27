import { TUTORING_STATE_FILTERS } from "@/shared/utils/enums/mentorshipsStateFilter";
import { useModalState } from "@/shared/hooks/useModalState";
import TutoringDetailModal from "../TutoringDetailModal";
import type { Tutoring } from "@/infrastructure/models/Tutoring";
import { useTutoringFilters } from "@/shared/hooks/useTutoringFilters";
import { MentorshipStatus } from "@/shared/utils/enums/mentorshipStatus";
import { useState } from "react";
import { UserRole } from "@/shared/utils/enums/role";
import MentorshipItemCard from "@/components/molecules/MentorshipItemCard";

interface Props {
  data: Tutoring[];
  title: string;
  refetch?: () => void;
}

const TutoringTable: React.FC<Props> = ({ data, title }) => {
  const { searchTerm, setSearchTerm, selectedStatus, setSelectedStatus, filteredData } = useTutoringFilters(data);
  const { isOpen, openModal, closeModal } = useModalState<Tutoring>();
  const [selectedTutoringId, setSelectedTutoringId] = useState<string | null>(null);

  const handleModal = (tutoring: Tutoring) => {
    if (tutoring.status === MentorshipStatus.COMPLETED || tutoring.status === MentorshipStatus.CANCELLED) {
      setSelectedTutoringId(tutoring.id);
      openModal(tutoring);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-4 md:flex-row">
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <div className="flex flex-col gap-4 w-full md:flex-row md:justify-end flex-1">
          <input
            className="bg-input rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            type="text"
            placeholder="Buscar tutorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="bg-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option>Todos los estados</option>
            {TUTORING_STATE_FILTERS.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredData.map((request) => (
          <MentorshipItemCard
            key={request.id}
            id={request.id}
            user={request.tutor}
            status={request.status}
            description={request.objectives}
            skills={request.skills}
            additionalInfo={UserRole.TUTOR}
            onClick={() => handleModal(request)}
          />
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No se encontraron tutorías que coincidan con los filtros.</p>
        </div>
      )}

      <TutoringDetailModal isOpen={isOpen} onClose={closeModal} tutoringId={selectedTutoringId} />
    </div>
  );
};

export default TutoringTable;
