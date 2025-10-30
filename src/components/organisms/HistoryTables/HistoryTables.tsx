import React, { useMemo, useState } from "react";
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
import { type ApiError, getErrorMessage } from "@/shared/types/error.types";
import { sanitizeInput, sanitizeUrl } from "@/shared/utils/sanitize";
import { logger } from "@/shared/utils/logger";
import { useAccessibilityAnnouncer } from "@/shared/hooks/useAccessibilityAnnouncer";
import { AccessibilityAnnouncer } from "@/components/atoms/AccessibilityAnnouncer";

const HistoryTables: React.FC = () => {
  const { data, isLoading, refetch } = useHistoryTables();
  const user = userStore.get();
  const [userAlreadyGaveFeedback, setUserAlreadyGaveFeedback] = useState(false);
  const { announce, message: announceMessage } = useAccessibilityAnnouncer();

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

  /**
   * Handles modal actions (cancel or feedback)
   * @param action - The action to perform
   * @param mentorship - The mentorship data
   */
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
        logger.error("Error verificando feedbacks", error as Error, { mentorshipId: mentorship.id });
        announce("Error al verificar feedbacks. Por favor, intenta nuevamente.");
        toast.error("Error al verificar feedbacks", {
          description: "Por favor, intenta nuevamente.",
        });
      }
    }
  };

  /**
   * Handles feedback submission with optional document URL
   * @param score - The feedback score (1-5)
   * @param comments - User feedback comments (sanitized)
   * @param documentUrl - Optional URL to final act document (sanitized)
   */
  const handleSubmitFeedback = async (score: number, comments: string, documentUrl?: string) => {
    if (!selectedFeedbackItem?.id) {
      return;
    }

    // Sanitize inputs
    const sanitizedComments = sanitizeInput(comments);
    const sanitizedDocumentUrl = documentUrl ? sanitizeUrl(documentUrl) : undefined;

    // Validate sanitized inputs
    if (!sanitizedComments || sanitizedComments.length === 0) {
      toast.error("Comentarios inválidos", {
        description: "Por favor, proporciona comentarios válidos.",
      });
      return;
    }

    if (documentUrl && !sanitizedDocumentUrl) {
      toast.error("URL inválida", {
        description: "La URL del documento no es válida.",
      });
      return;
    }

    try {
      const isTutor = selectedFeedbackItem.tutor.id === user.userId;

      if (userAlreadyGaveFeedback && isTutor && sanitizedDocumentUrl) {
        const completeTutoringData: CompleteTutoringBody = {
          userId: selectedFeedbackItem.tutor.id,
          finalActUrl: sanitizedDocumentUrl,
        };

        await completeTutoring(selectedFeedbackItem.id, completeTutoringData);

        handleCloseFeedbackModal();
        await refetch();

        announce("Mentoría completada exitosamente.");
        toast.success("Mentoría completada exitosamente", {
          description: "El acta ha sido registrada correctamente.",
        });
        return;
      }

      const feedbackData: CreateFeedbackBody = {
        tutoringId: selectedFeedbackItem?.id,
        score: score.toString(),
        comments: sanitizedComments,
        evaluatorId: user.userId || "",
      };

      await createFeedback(feedbackData);

      if (isTutor && sanitizedDocumentUrl) {
        const completeTutoringData: CompleteTutoringBody = {
          userId: selectedFeedbackItem.tutor.id,
          finalActUrl: sanitizedDocumentUrl,
        };

        await completeTutoring(selectedFeedbackItem.id, completeTutoringData);
      }

      handleCloseFeedbackModal();
      await refetch();

      if (isTutor && sanitizedDocumentUrl) {
        announce("Feedback enviado y mentoría completada exitosamente.");
        toast.success("Feedback enviado y mentoría completada", {
          description: "El acta ha sido registrada correctamente.",
        });
      } else {
        announce("Feedback enviado correctamente.");
        toast.success("Feedback enviado correctamente", {
          description: isTutor
            ? "Podrás completar la mentoría cuando el tutorado también haya dado feedback."
            : undefined,
        });
      }
    } catch (error) {
      logger.error("Error submitting feedback", error as Error, {
        tutoringId: selectedFeedbackItem.id,
        userId: user.userId,
      });

      const errorMessage = getErrorMessage(error);
      const apiError = error as ApiError;

      announce(`Error: ${errorMessage}`);

      if (apiError?.response?.status === 400 && errorMessage?.toLowerCase().includes("feedback")) {
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

  /**
   * Handles mentorship cancellation
   * @param comments - Cancellation reason comments (sanitized)
   */
  const handleCancellation = async (comments: string): Promise<void> => {
    if (!selectedCancellationItem?.id) {
      return;
    }

    // Sanitize cancellation comments
    const sanitizedComments = sanitizeInput(comments);

    if (!sanitizedComments || sanitizedComments.length === 0) {
      toast.error("Comentarios inválidos", {
        description: "Por favor, proporciona un motivo válido para la cancelación.",
      });
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
            comments: sanitizedComments,
          });
          break;

        default:
          return;
      }

      closeCancellationModal();
      await refetch();

      announce("Mentoría cancelada exitosamente.");
      toast.success("Cancelación exitosa", {
        description: "La mentoría ha sido cancelada correctamente.",
      });
    } catch (error) {
      logger.error("Error cancelling mentorship", error as Error, {
        mentorshipId: selectedCancellationItem.id,
        userId: user.userId,
      });

      const errorMessage = getErrorMessage(error);
      announce(`Error al cancelar: ${errorMessage}`);

      toast.error("Error al cancelar", {
        description: errorMessage,
      });
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
    <div className="flex flex-col gap-12" role="region" aria-label="Historial de mentorías">
      {/* Screen reader announcements for actions */}
      <AccessibilityAnnouncer message={announceMessage} />

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
