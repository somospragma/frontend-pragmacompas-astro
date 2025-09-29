import React, { useMemo } from "react";
import { HISTORY_TABLE_CONFIG, type MentorshipData } from "@/shared/config/historyTableConfig";
import DataTable from "../DataTable/DataTable";
import { HISTORY_PAGE_CONFIG } from "@/shared/config/historyPageConfig";
import FeedbackModal from "../FeedbackModal/FeedbackModal";
import CancellationModal from "../CancellationModal/CancellationModal";
import { useHistoryTables } from "@/shared/hooks/useHistoryTables";
import { useModalState } from "@/shared/hooks/useModalState";
import { createFeedback, type CreateFeedbackBody } from "@/infrastructure/services/createFeedback";
import { cancelTutoring } from "@/infrastructure/services/cancelTutoring";
import { UserRole } from "@/shared/utils/enums/role";
import { MentorshipAction } from "@/shared/utils/enums/mentorshipAction";
import { updateTutoringRequestStatus } from "@/infrastructure/services/updateTutoringRequestStatus";
import { MentorshipStatus } from "@/shared/utils/enums/mentorshipStatus";
import { MentorshipType } from "@/shared/utils/enums/mentorshipType";
import { completeTutoring, type CompleteTutoringBody } from "@/infrastructure/services/completeTutoring";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { userStore } from "@/store/userStore";

const HistoryTables: React.FC = () => {
  const { data, isLoading, refetch } = useHistoryTables();
  const user = userStore.get();
  const permissions = usePermissions(user.rol as string);
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
    if (!selectedFeedbackItem || !user.rol) return null;
    const isTutor = selectedFeedbackItem.myRole === UserRole.TUTOR;
    return {
      participant: isTutor ? selectedFeedbackItem.tutee.name : selectedFeedbackItem.tutor.name,
      myRole: selectedFeedbackItem.myRole,
      skills: selectedFeedbackItem.skills,
      email: isTutor ? selectedFeedbackItem.tutor.email : selectedFeedbackItem.tutee.email,
    };
  }, [selectedFeedbackItem, user]);

  const cancellationModalData = useMemo(() => {
    if (!selectedCancellationItem || !user.rol) return null;

    const isTutor = user.rol === UserRole.TUTOR;

    return {
      participant: isTutor ? selectedCancellationItem.tutee : selectedCancellationItem.tutor,
      role: isTutor ? UserRole.TUTEE : UserRole.TUTOR,
    };
  }, [selectedCancellationItem, user]);

  const handleActionClick = (action: string, mentorship: MentorshipData) => {
    if (action === MentorshipAction.CANCEL) {
      openCancellationModal(mentorship);
    } else if (action === MentorshipAction.COMPLETE) {
      openFeedbackModal(mentorship);
    }
  };

  const handleSubmitFeedback = async (score: number, comments: string, finalActUrl?: string) => {
    if (!selectedFeedbackItem?.id) {
      return;
    }
    try {
      const feedbackData: CreateFeedbackBody = {
        tutoringId: selectedFeedbackItem?.id,
        score: score.toString(),
        comments,
        evaluatorId: selectedFeedbackItem.tutor.id,
      };

      await createFeedback(feedbackData);

      if (permissions.canCompleteTutoring() && finalActUrl?.trim()) {
        const completeTutoringData: CompleteTutoringBody = {
          userId: selectedFeedbackItem.tutor.id,
          finalActUrl,
        };

        await completeTutoring(selectedFeedbackItem.id, completeTutoringData);
      }

      closeFeedbackModal();
      await refetch();
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  const handleCancellation = async (comments: string): Promise<void> => {
    if (!selectedCancellationItem?.id) {
      return;
    }

    try {
      switch (selectedCancellationItem.type) {
        case MentorshipType.REQUEST:
          await updateTutoringRequestStatus(selectedCancellationItem.id, {
            status: MentorshipStatus.CANCELLED,
          });
          break;

        case MentorshipType.MENTORSHIP:
          await cancelTutoring(selectedCancellationItem.id, {
            userId: user.userId,
            comments,
          });
          break;

        default:
          return;
      }

      closeCancellationModal();
      await refetch();
    } catch (error) {
      console.error("Error cancelling:", error);
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
          onSubmitCancellation={handleCancellation}
          type={selectedCancellationItem?.type ?? MentorshipType.MENTORSHIP}
        />
      )}
    </div>
  );
};

export default HistoryTables;
