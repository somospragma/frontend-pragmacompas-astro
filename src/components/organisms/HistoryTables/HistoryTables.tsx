/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { userStore } from "@/store/userStore";
import { toast } from "sonner";
import { getTutoringSummary } from "@/infrastructure/services/getTutoringSummary";
import { useState } from "react";

const HistoryTables: React.FC = () => {
  const { data, isLoading, refetch } = useHistoryTables();
  const user = userStore.get();
  const [userAlreadyGaveFeedback, setUserAlreadyGaveFeedback] = useState(false);

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

  const handleCloseFeedbackModal = () => {
    setUserAlreadyGaveFeedback(false);
    closeFeedbackModal();
  };

  const feedbackModalData = useMemo(() => {
    if (!selectedFeedbackItem) return null;

    const myRole = selectedFeedbackItem?.myRole;
    const isTutor = myRole === UserRole.TUTOR;

    return {
      participant: isTutor ? selectedFeedbackItem.tutee.name : selectedFeedbackItem.tutor.name,
      participantRole: isTutor ? selectedFeedbackItem.tutee.role : selectedFeedbackItem.tutor.role,
      myRole: myRole as string,
      skills: selectedFeedbackItem.skills,
      email: isTutor ? selectedFeedbackItem.tutor.email : selectedFeedbackItem.tutee.email,
      tutorId: selectedFeedbackItem.tutor.id,
      tutoringId: selectedFeedbackItem.id,
    };
  }, [selectedFeedbackItem]);

  const handleModal = async (action: string, mentorship: MentorshipData) => {
    if (action === MentorshipAction.CANCEL) {
      openCancellationModal(mentorship);
      return;
    }

    if (action === MentorshipAction.FEEDBACK) {
      try {
        const tutoringSummary = await getTutoringSummary(mentorship.id);

        const userHasGivenFeedback = tutoringSummary.feedbacks?.some(
          (feedback) => feedback.evaluator.id === user.userId
        );

        const isTutor = mentorship.tutor.id === user.userId;
        const mentorshipCompleted = tutoringSummary.status === "Completada";

        if (userHasGivenFeedback && !(isTutor && !mentorshipCompleted)) {
          toast.warning("Ya has dado feedback para esta tutoría", {
            description: "No es posible agregar más feedback.",
          });
          return;
        }

        setUserAlreadyGaveFeedback(userHasGivenFeedback);
        openFeedbackModal(mentorship);
      } catch (error) {
        console.error("Error verificando feedbacks:", error);
      }
    }
  };

  const handleSubmitFeedback = async (score: number, comments: string, documentUrl?: string) => {
    if (!selectedFeedbackItem?.id) {
      return;
    }
    try {
      const isTutor = selectedFeedbackItem.tutor.id === user.userId;

      if (userAlreadyGaveFeedback && isTutor && documentUrl) {
        const completeTutoringData: CompleteTutoringBody = {
          userId: selectedFeedbackItem.tutor.id,
          finalActUrl: documentUrl,
        };

        await completeTutoring(selectedFeedbackItem.id, completeTutoringData);

        handleCloseFeedbackModal();
        await refetch();

        toast.success("Mentoría completada exitosamente", {
          description: "El acta ha sido registrada correctamente.",
        });
        return;
      }

      const feedbackData: CreateFeedbackBody = {
        tutoringId: selectedFeedbackItem?.id,
        score: score.toString(),
        comments,
        evaluatorId: user.userId || "",
      };

      await createFeedback(feedbackData);

      if (isTutor && documentUrl) {
        const completeTutoringData: CompleteTutoringBody = {
          userId: selectedFeedbackItem.tutor.id,
          finalActUrl: documentUrl,
        };

        await completeTutoring(selectedFeedbackItem.id, completeTutoringData);
      }

      handleCloseFeedbackModal();
      await refetch();

      if (isTutor && documentUrl) {
        toast.success("Feedback enviado y mentoría completada", {
          description: "El acta ha sido registrada correctamente.",
        });
      } else {
        toast.success("Feedback enviado correctamente", {
          description: isTutor
            ? "Podrás completar la mentoría cuando el tutorado también haya dado feedback."
            : undefined,
        });
      }
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
      const errorMessage = error?.response?.data?.message || error.message;

      if (error?.response?.status === 400 && errorMessage?.toLowerCase().includes("feedback")) {
        toast.error("No se pudo completar la mentoría", {
          description: "El tutorado aún no ha dado su feedback. Tu feedback se guardó correctamente.",
        });
      } else {
        toast.error("Error al procesar el feedback", {
          description: errorMessage || "Por favor, intenta nuevamente.",
        });
      }
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
          onClose={handleCloseFeedbackModal}
          mentorship={feedbackModalData}
          currentUserId={user.userId || ""}
          userAlreadyGaveFeedback={userAlreadyGaveFeedback}
          onSubmitFeedback={handleSubmitFeedback}
        />
      )}

      <CancellationModal
        isOpen={isCancellationModalOpen}
        onClose={closeCancellationModal}
        onSubmitCancellation={handleCancellation}
        type={selectedCancellationItem?.type ?? MentorshipType.MENTORSHIP}
      />
    </div>
  );
};

export default HistoryTables;
