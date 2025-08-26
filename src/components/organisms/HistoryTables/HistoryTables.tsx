import React, { useMemo } from "react";
import { HISTORY_TABLE_CONFIG, type MentorshipData } from "@/shared/config/historyTableConfig";
import DataTable from "../DataTable/DataTable";
import { HISTORY_PAGE_CONFIG } from "@/shared/config/historyPageConfig";
import FeedbackModal from "../FeedbackModal/FeedbackModal";
import { useHistoryTables } from "@/shared/hooks/useHistoryTables";
import { useModalState } from "@/shared/hooks/useModalState";
import type { UserRole } from "@/infrastructure/models/TutoringRequest";
import { createFeedback, type CreateFeedbackBody } from "@/infrastructure/services/createFeedback";

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

  const handleSubmitFeedback = async (score: number, comments: string) => {
    // if (!selectedItem || !user.id) {
    //   console.error("Missing selectedItem or user ID");
    //   return;
    // }

    try {
      const feedbackData: CreateFeedbackBody = {
        tutoringId: "1a39382d-21b6-432f-93cc-a630e416311b",
        score: score.toString(),
        comments,
        evaluatorId: "tutor-1",
      };

      await createFeedback(feedbackData);
      console.log("Feedback submitted successfully");
      closeModal();
    } catch (error) {
      console.error("Error submitting feedback:", error);
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

      {feedbackModalData && (
        <FeedbackModal
          isOpen={isOpen}
          onClose={closeModal}
          mentorship={feedbackModalData}
          onSubmitFeedback={handleSubmitFeedback}
        />
      )}
    </div>
  );
};

export default HistoryTables;
