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
import { useState, useEffect } from "react";
import { renderState } from "@/shared/utils/helpers/renderState";

type Props = {
  isOpen: boolean;
  selectedRequest: MentorshipRequest;
  onOpenChange: () => void;
  onRefetch: () => void;
};
const MentorshipActionModal = ({ isOpen, selectedRequest, onOpenChange, onRefetch }: Props) => {
  const [objectives, setObjectives] = useState("");
  const userId = userStore.get().userId ?? "";

  useEffect(() => {
    if (!isOpen) {
      setObjectives("");
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

  const handleAccept = () => {
    next();
  };

  const handleClose = () => {
    onOpenChange();
  };

  const renderActions = () => {
    let rejectAction, acceptAction, rejectHandler;
    switch (selectedRequest?.requestStatus) {
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
        return [];
    }
    const isAcceptDisabled =
      isLoading || (selectedRequest?.requestStatus === MentorshipStatus.CONVERSING && !objectives.trim());

    return [
      <Button key={`reject-${selectedRequest?.id}`} variant="outline" disabled={isLoading} onClick={rejectHandler}>
        {rejectAction}
      </Button>,
      ,
      <Button key={`accept-${selectedRequest?.id}`} disabled={isAcceptDisabled} onClick={handleAccept}>
        {acceptAction}
      </Button>,
      ,
    ];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Solicitud de tutoría</DialogTitle>
          <DialogDescription>Detalles de la solicitud de tutoría</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold text-lg">
                {selectedRequest?.tutee.firstName ? selectedRequest?.tutee.firstName.charAt(0) : "?"}
                {selectedRequest?.tutee.lastName ? selectedRequest?.tutee.lastName.charAt(0) : "?"}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {selectedRequest?.tutee.firstName} {selectedRequest?.tutee.lastName}
              </h3>
              <p className="text-muted-foreground">{selectedRequest?.tutee.chapter.name}</p>
              <p className="text-sm text-muted-foreground">{selectedRequest?.tutee.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Habilidades solicitadas:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedRequest?.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium">Descripción de necesidades:</h4>
            <p className="text-sm text-muted-foreground">{selectedRequest?.needsDescription}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Estado:</span>
              {renderState(selectedRequest?.requestStatus)}
            </div>
          </div>

          {selectedRequest?.requestStatus === MentorshipStatus.CONVERSING && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Objetivos:</h4>
              <Textarea
                placeholder="Comparte tus objetivos para esta tutoría..."
                className="resize-none"
                rows={4}
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                required
              />
            </div>
          )}
        </div>

        <DialogFooter>{renderActions()}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MentorshipActionModal;
