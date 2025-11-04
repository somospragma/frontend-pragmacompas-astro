import { TUTORING_STATE_FILTERS } from "@/shared/utils/enums/mentorshipsStateFilter";
import { useModalState } from "@/shared/hooks/useModalState";
import TutoringDetailModal from "../TutoringDetailModal";
import type { Tutoring } from "@/infrastructure/models/Tutoring";
import { useTutoringFilters } from "@/shared/hooks/useTutoringFilters";
import { MentorshipStatus } from "@/shared/utils/enums/mentorshipStatus";
import { useState, useCallback, useMemo } from "react";
import { UserRole } from "@/shared/utils/enums/role";
import MentorshipItemCard from "@/components/molecules/MentorshipItemCard";
import { useAccessibilityAnnouncer } from "@/shared/hooks/useAccessibilityAnnouncer";
import { AccessibilityAnnouncer } from "@/components/atoms/AccessibilityAnnouncer";

interface Props {
  readonly data: Tutoring[];
  readonly title: string;
  readonly refetch?: () => void;
}

/**
 * TutoringTable component displays a filterable list of tutoring sessions
 * @param data - Array of tutoring sessions
 * @param title - Title for the table section
 * @param refetch - Optional callback to refresh data
 */
const TutoringTable: React.FC<Props> = ({ data, title }) => {
  const { searchTerm, setSearchTerm, selectedStatus, setSelectedStatus, filteredData } = useTutoringFilters(data);
  const { isOpen, openModal, closeModal } = useModalState<Tutoring>();
  const [selectedTutoringId, setSelectedTutoringId] = useState<string | null>(null);
  const { announce, message: announceMessage } = useAccessibilityAnnouncer();

  // Memoize modal-openable status check
  const isModalOpenable = useCallback(
    (status: MentorshipStatus) => status === MentorshipStatus.COMPLETED || status === MentorshipStatus.CANCELLED,
    []
  );

  // Memoize modal handler
  const handleModal = useCallback(
    (tutoring: Tutoring) => {
      if (isModalOpenable(tutoring.status)) {
        setSelectedTutoringId(tutoring.id);
        openModal(tutoring);
        announce(`Modal abierto para tutoría: ${tutoring.objectives}`);
      }
    },
    [isModalOpenable, openModal, announce]
  );

  // Memoize search change handler
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      announce(`Buscando tutorías: ${e.target.value || "todos"}`);
    },
    [setSearchTerm, announce]
  );

  // Memoize status change handler
  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedStatus(e.target.value);
      announce(`Filtrado por estado: ${e.target.value}`);
    },
    [setSelectedStatus, announce]
  );

  // Memoize filtered count announcement
  useMemo(() => {
    if (filteredData.length === 0) {
      announce("No se encontraron tutorías con los filtros aplicados");
    } else {
      announce(`${filteredData.length} tutorías encontradas`);
    }
  }, [filteredData.length, announce]);

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
            onChange={handleSearchChange}
            aria-label="Buscar tutorías"
            aria-describedby="search-description"
          />
          <span id="search-description" className="sr-only">
            Escribe para buscar tutorías por nombre, habilidad u objetivo
          </span>
          <select
            className="bg-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            value={selectedStatus}
            onChange={handleStatusChange}
            aria-label="Filtrar por estado"
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

      <div className="space-y-4" role="list" aria-label="Lista de tutorías">
        {filteredData.map((request) => (
          <div key={request.id} role="listitem">
            <MentorshipItemCard
              id={request.id}
              user={request.tutor}
              status={request.status}
              description={request.objectives}
              skills={request.skills}
              additionalInfo={UserRole.TUTOR}
              onClick={() => handleModal(request)}
            />
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-8" role="status" aria-live="polite">
          <p className="text-muted-foreground">No se encontraron tutorías que coincidan con los filtros.</p>
        </div>
      )}

      <TutoringDetailModal isOpen={isOpen} onClose={closeModal} tutoringId={selectedTutoringId} />
      <AccessibilityAnnouncer message={announceMessage} />
    </div>
  );
};

export default TutoringTable;
