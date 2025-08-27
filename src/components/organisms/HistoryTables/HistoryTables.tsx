import React, { useMemo } from "react";
import { HISTORY_TABLE_CONFIG, type MentorshipData } from "@/shared/config/historyTableConfig";
import DataTable from "../DataTable/DataTable";
import { HISTORY_PAGE_CONFIG } from "@/shared/config/historyPageConfig";
import FeedbackModal from "../FeedbackModal/FeedbackModal";
import CancellationModal from "../CancellationModal/CancellationModal";
import { useHistoryTables } from "@/shared/hooks/useHistoryTables";
import { useModalState } from "@/shared/hooks/useModalState";
import type { UserRole } from "@/infrastructure/models/TutoringRequest";
import { createFeedback, type CreateFeedbackBody } from "@/infrastructure/services/createFeedback";

interface HistoryTablesProps {
  role?: UserRole;
}

const HistoryTables: React.FC<HistoryTablesProps> = ({ role }) => {
  const { data, isLoading } = useHistoryTables();

  const {
    isOpen: isFeedbackModalOpen,
    selectedItem: selectedFeedbackItem,
    openModal: openFeedbackModal,
    closeModal: closeFeedbackModal,
  } = useModalState<MentorshipData>();

  const {
    isOpen: isCancellationModalOpen,
    selectedItem: selectedCancellationItem,
    openModal: openCancellationModal,
    closeModal: closeCancellationModal,
  } = useModalState<MentorshipData>();

  const feedbackModalData = useMemo(() => {
    if (!selectedFeedbackItem || !role) return null;

    const isTutor = role === "Tutor";

    return {
      participant: isTutor ? selectedFeedbackItem.tutee : selectedFeedbackItem.tutor,
      role: isTutor ? "Tutorado" : "Tutor",
      skills: selectedFeedbackItem.skills,
    };
  }, [selectedFeedbackItem, role]);

  const cancellationModalData = useMemo(() => {
    console.log("Selected Cancellation Item:", selectedCancellationItem);
    if (!selectedCancellationItem || !role) return null;

    const isTutor = role === "Tutor";

    return {
      participant: isTutor ? selectedCancellationItem.tutee : selectedCancellationItem.tutor,
      role: isTutor ? "Tutorado" : "Tutor",
      skills: selectedCancellationItem.skills,
    };
  }, [selectedCancellationItem, role]);

  const handleActionClick = (action: string, mentorship: MentorshipData) => {
    console.log("Action clicked:", action, mentorship);
    if (action === "Cancelar") {
      openCancellationModal(mentorship);
    } else if (action === "Finalizar") {
      openFeedbackModal(mentorship);
    }
  };

  const handleSubmitFeedback = async (score: number, comments: string) => {
    try {
      const feedbackData: CreateFeedbackBody = {
        tutoringId: "1a39382d-21b6-432f-93cc-a630e416311b",
        score: score.toString(),
        comments,
        evaluatorId: "tutor-1",
      };

      await createFeedback(feedbackData);
      console.log("Feedback submitted successfully");
      closeFeedbackModal();
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  const handleCancellation = async (reason: string) => {
    try {
      // Aquí harías la llamada a tu API para cancelar la mentoría
      // await cancelTutoring({
      //   tutoringId: selectedCancellationItem.id,
      //   reason: reason
      // });

      console.log("Mentoría cancelada con razón:", reason);
      closeCancellationModal();
    } catch (error) {
      console.error("Error cancelling mentorship:", error);
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
          isOpen={isFeedbackModalOpen}
          onClose={closeFeedbackModal}
          mentorship={feedbackModalData}
          onSubmitFeedback={handleSubmitFeedback}
        />
      )}

      {cancellationModalData && (
        <CancellationModal
          isOpen={isCancellationModalOpen}
          onClose={closeCancellationModal}
          mentorship={cancellationModalData}
          onSubmitCancellation={handleCancellation}
        />
      )}
    </div>
  );
};

export default HistoryTables;
