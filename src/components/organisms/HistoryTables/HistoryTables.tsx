import React, { useMemo } from "react";
import { HISTORY_TABLE_CONFIG, type MentorshipData } from "@/shared/config/historyTableConfig";
import DataTable from "../DataTable/DataTable";
import { HISTORY_PAGE_CONFIG } from "@/shared/config/historyPageConfig";
import FeedbackModal from "../FeedbackModal/FeedbackModal";
import { useHistoryTables } from "@/shared/hooks/useHistoryTables";
import { useModalState } from "@/shared/hooks/useModalState";
import type { UserRole } from "@/infrastructure/models/TutoringRequest";

interface HistoryTablesProps {
  role?: UserRole;
}

const HistoryTables: React.FC<HistoryTablesProps> = ({ role }) => {
  const { data, isLoading } = useHistoryTables();
  const { isOpen, selectedItem, openModal, closeModal } = useModalState<MentorshipData>();

  const feedbackModalData = useMemo(() => {
    if (!selectedItem || !role) return null;

    const isTutor = role === "Tutor";

    return {
      participant: isTutor ? selectedItem.tutee : selectedItem.tutor,
      role: isTutor ? "Tutorado" : "Tutor",
      skills: selectedItem.skills,
    };
  }, [selectedItem, role]);

  const handleActionClick = (action: string, mentorship: MentorshipData) => {
    if (action === "Cancelar") {
      openModal(mentorship);
    }
  };

  return (
    <div className="flex flex-col gap-12">
      {Object.entries(HISTORY_PAGE_CONFIG).map(([key, config]) => {
        const columns = config.showActions
          ? HISTORY_TABLE_CONFIG
          : HISTORY_TABLE_CONFIG.filter((col) => col.key !== "action");

        const filteredData = data.filter((item) => config.status.some((status) => status === item.status));

        return (
          <DataTable
            key={key}
            title={config.title}
            columns={columns}
            data={filteredData}
            emptyMessage={config.emptyMessage}
            loading={isLoading}
            onActionClick={handleActionClick}
          />
        );
      })}

      {feedbackModalData && <FeedbackModal isOpen={isOpen} onClose={closeModal} mentorship={feedbackModalData} />}
    </div>
  );
};

export default HistoryTables;
