import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/molecules/Dialog/Dialog";
import type MentorshipRequest from "@/components/page/MentoShipRequest/MentorshipRequest";
import { useMentorshipStates } from "@/shared/entities/mentorshipState";
import { Button } from "@/components/ui/button";
import { MentorshipStatus } from "@/shared/utils/enums/mentorshipStatus";
import { userStore } from "@/store/userStore";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useCallback, useMemo, useId } from "react";
import { renderState } from "@/shared/utils/helpers/renderState";
import { ParticipantCard } from "@/components/molecules/ParticipantCard/ParticipantCard";
import { UserRole } from "@/shared/utils/enums/role";

type Props = {
  isOpen: boolean;
  selectedRequest: MentorshipRequest;
  onOpenChange: () => void;
  onRefetch: () => void;
};
/**
 * Modal component for managing mentorship request actions.
 * Allows tutors to approve, reject, or meet for tutoring sessions.
 *
 * @component
 * @example
 * ```tsx
 * <MentorshipActionModal
 *   isOpen={true}
 *   selectedRequest={request}
 *   onOpenChange={handleClose}
 *   onRefetch={refetchData}
 * />
 * ```
 */
const MentorshipActionModal = ({ isOpen, selectedRequest, onOpenChange, onRefetch }: Props) => {
  const [objectives, setObjectives] = useState("");
  const [objectivesError, setObjectivesError] = useState("");
  const userId = userStore.get().userId ?? "";

  // Generate unique IDs for accessibility
  const objectivesId = useId();
  const objectivesErrorId = useId();

  useEffect(() => {
    if (!isOpen) {
      setObjectives("");
      setObjectivesError("");
    }
  }, [isOpen]);

  const { next, previous, isLoading } = useMentorshipStates(
    selectedRequest.requestStatus,
    selectedRequest.id,
    userId,
    () => {
      onRefetch();
      onOpenChange();
    },
    objectives
  );

  const handleAccept = useCallback(() => {
    // Validate objectives if required
    if (selectedRequest.requestStatus === MentorshipStatus.CONVERSING && !objectives.trim()) {
      setObjectivesError("Los objetivos son requeridos para continuar");
      return;
    }
    setObjectivesError("");
    next();
  }, [selectedRequest.requestStatus, objectives, next]);

  const handleClose = useCallback(() => {
    onOpenChange();
  }, [onOpenChange]);

  const handleObjectivesChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setObjectives(e.target.value);
      if (objectivesError) {
        setObjectivesError("");
      }
    },
    [objectivesError]
  );

  const handleObjectivesBlur = useCallback(() => {
    if (selectedRequest.requestStatus === MentorshipStatus.CONVERSING && !objectives.trim()) {
      setObjectivesError("Los objetivos son requeridos para continuar");
    }
  }, [selectedRequest.requestStatus, objectives]);

  const isAcceptDisabled = useMemo(
    () => isLoading || (selectedRequest.requestStatus === MentorshipStatus.CONVERSING && !objectives.trim()),
    [isLoading, selectedRequest.requestStatus, objectives]
  );

  const renderActions = useCallback(() => {
    let rejectAction, acceptAction, rejectHandler;
    switch (selectedRequest.requestStatus) {
      case MentorshipStatus.PENDING:
        rejectAction = "Rechazar";
        rejectHandler = previous;
        acceptAction = "Aprobar Tutoría";
        break;
      case MentorshipStatus.CONVERSING:
        rejectAction = "Rechazar";
        rejectHandler = previous;
        acceptAction = "Aceptar Tutoría";
        break;
      case MentorshipStatus.AVAILABLE:
        rejectAction = "Volver";
        rejectHandler = handleClose;
        acceptAction = "Reunirse";
        break;
      default:
        return null;
    }

    return (
      <>
        <Button
          key={`reject-${selectedRequest.id}`}
          variant="outline"
          disabled={isLoading}
          onClick={rejectHandler}
          aria-busy={isLoading}
        >
          {rejectAction}
        </Button>
        <Button
          key={`accept-${selectedRequest.id}`}
          disabled={isAcceptDisabled}
          onClick={handleAccept}
          aria-busy={isLoading}
        >
          {acceptAction}
        </Button>
      </>
    );
  }, [
    selectedRequest.requestStatus,
    selectedRequest.id,
    isLoading,
    isAcceptDisabled,
    previous,
    handleClose,
    handleAccept,
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Solicitud de tutoría</DialogTitle>
          <DialogDescription>Detalles de la solicitud de tutoría</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <ParticipantCard user={selectedRequest.tutee} role={UserRole.TUTEE} />
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Habilidades solicitadas:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedRequest.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium">Descripción de necesidades:</h4>
            <p className="text-sm text-muted-foreground">{selectedRequest.needsDescription}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Estado:</span>
              {renderState(selectedRequest.requestStatus)}
            </div>
          </div>

          {selectedRequest.requestStatus === MentorshipStatus.CONVERSING && (
            <div className="space-y-2">
              <label htmlFor={objectivesId} className="text-sm font-medium text-foreground">
                Objetivos:
              </label>
              <Textarea
                id={objectivesId}
                placeholder="Comparte tus objetivos para esta tutoría..."
                className="resize-none"
                rows={4}
                value={objectives}
                onChange={handleObjectivesChange}
                onBlur={handleObjectivesBlur}
                required
                aria-required="true"
                aria-invalid={!!objectivesError}
                aria-describedby={objectivesError ? objectivesErrorId : undefined}
              />
              {objectivesError && (
                <p id={objectivesErrorId} className="text-sm text-destructive" role="alert">
                  {objectivesError}
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>{renderActions()}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MentorshipActionModal;
