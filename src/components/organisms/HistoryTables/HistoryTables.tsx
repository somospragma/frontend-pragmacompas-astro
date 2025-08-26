import React from "react";
import type { User } from "@auth/core/types";
import { HISTORY_TABLE_CONFIG, type MentorshipData } from "@/shared/config/historyTableConfig";
import DataTable from "../DataTable/DataTable";
import { HISTORY_PAGE_CONFIG } from "@/shared/config/historyPageConfig";
import FeedbackModal from "../FeedbackModal/FeedbackModal";
import { useHistoryTables } from "@/shared/hooks/useHistoryTables";
import { useModalState } from "@/shared/hooks/useModalState";

interface HistoryTablesProps {
  user?: User;
}

const HistoryTables: React.FC<HistoryTablesProps> = ({ user }) => {
  const { data, isLoading } = useHistoryTables(user);
  const { isOpen, selectedItem, openModal, closeModal } = useModalState<MentorshipData>();

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

      {selectedItem && (
        <FeedbackModal
          isOpen={isOpen}
          onClose={closeModal}
          mentorship={{
            participant: selectedItem.tutee,
            role: selectedItem.role,
            chapter: selectedItem.chapter,
            skills: selectedItem.skills,
          }}
        />
      )}
    </div>
  );
};

export default HistoryTables;
