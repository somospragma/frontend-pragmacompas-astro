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
  const myRole = selectedFeedbackItem?.myRole;
  const permissions = usePermissions(myRole as string);
  const isTutor = myRole === UserRole.TUTOR;

  const feedbackModalData = useMemo(() => {
    if (!selectedFeedbackItem) return null;
    return {
      participant: isTutor ? selectedFeedbackItem.tutee.name : selectedFeedbackItem.tutor.name,
      participantRole: isTutor ? selectedFeedbackItem.tutee.role : selectedFeedbackItem.tutor.role,
      myRole: myRole as string,
      skills: selectedFeedbackItem.skills,
      email: isTutor ? selectedFeedbackItem.tutor.email : selectedFeedbackItem.tutee.email,
    };
  }, [selectedFeedbackItem]);

  const cancellationModalData = useMemo(() => {
    if (!selectedCancellationItem) return null;
    return {
      participant: isTutor ? selectedCancellationItem.tutee : selectedCancellationItem.tutor,
      role: isTutor ? UserRole.TUTEE : UserRole.TUTOR,
    };
  }, [selectedCancellationItem]);

  const handleModal = (action: string, mentorship: MentorshipData) => {
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

  const getColumns = (config: { showActions: boolean; showType: boolean }) => {
    let cols = [...HISTORY_TABLE_CONFIG];
    if (!config.showActions) {
      cols = cols.filter((col) => col.key !== "action");
    }
    if (!config.showType) {
      cols = cols.filter((col) => col.key !== "type");
    }
    return cols;
  };

  return (
    <div className="flex flex-col gap-12">
      {Object.entries(HISTORY_PAGE_CONFIG).map(([key, config]) => {
        const columns = getColumns(config);
        const filteredData = data.filter(
          (item) =>
            config.status.some((status) => status === item.status) && config.type.some((type) => type === item.type)
        );
        console.log("filteredData", filteredData);
        return (
          <DataTable
            key={key}
            title={config.title}
            columns={columns}
            data={filteredData}
            emptyMessage={config.emptyMessage}
            loading={isLoading}
            onActionClick={handleModal}
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
