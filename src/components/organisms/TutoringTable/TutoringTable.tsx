import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { ADMIN_MENTORSHIP_STATE_FILTERS, TUTORING_STATE_FILTERS } from "@/shared/utils/enums/mentorshipsStateFilter";
import { useModalState } from "@/shared/hooks/useModalState";
import TutoringDetailModal from "../TutoringDetailModal";
import type TutoringPage from "@/components/page/TutoringPage/TutoringPage";
import { renderState } from "@/shared/utils/helpers/renderState";

interface Props {
  data: TutoringPage[];
  title: string;
  refetch?: () => void;
}

const TutoringTable: React.FC<Props> = ({ data, title }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos los estados");
  const { isOpen, openModal, closeModal } = useModalState();

  const filteredData = data.filter((item) => {
    const fullName = `${item.tutee.firstName} ${item.tutee.lastName}`;
    const matchesSearch =
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tutee.chapter.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === "Todos los estados" || item.requestStatus === selectedStatus;
    const matchesByRol = ADMIN_MENTORSHIP_STATE_FILTERS.some((state) => state === item.requestStatus);

    return matchesSearch && matchesStatus && matchesByRol;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <div className="flex gap-4">
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
          <Card
            key={request.id}
            className="bg-card border border-border cursor-pointer hover:bg-accent transition-colors"
            onClick={() => openModal(request)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 min-w-12 rounded-full bg-primary/10 flex items-center justify-center">
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
                      {request.needsDescription} - Habilidades:&nbsp;
                      {request.skills.map((skill: { name: string }) => skill.name).join(", ")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">{renderState(request.requestStatus)}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No se encontraron solicitudes que coincidan con los filtros.</p>
        </div>
      )}

      <TutoringDetailModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
};

export default TutoringTable;
