import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/molecules/Dialog/Dialog";
import { renderState, type MentorshipRequest } from "../MentorShipTable";
import { MentorshipState, useMentorshipStates } from "@/shared/entities/mentorshipState";
import { Button } from "@/components/ui/button";

type Props = {
  isOpen: boolean;
  selectedRequest: MentorshipRequest;
  onOpenChange: () => void;
};
const MentorshipActionModal = ({ isOpen, selectedRequest, onOpenChange }: Props) => {
  const { next, previous, isLoading } = useMentorshipStates(selectedRequest.requestStatus, selectedRequest.id, () => {
    onOpenChange();
  });

  const renderActions = () => {
    let rejectAction;
    let acceptAction;
    switch (selectedRequest?.requestStatus) {
      case MentorshipState.PENDING:
        rejectAction = "Rechazar";
        acceptAction = "Aceptar";
        break;
      case MentorshipState.CONVERSING:
        rejectAction = "Rechazar";
        acceptAction = "Aceptar";
        break;
      case MentorshipState.APPROVED:
        rejectAction = "Volver";
        acceptAction = "Reunirse";
        break;
    }

    return [
      <Button
        key={`reject-${selectedRequest?.id}`}
        variant="outline"
        disabled={isLoading}
        onClick={() => {
          previous();
        }}
      >
        {rejectAction}
      </Button>,
      ,
      <Button
        key={`accept-${selectedRequest?.id}`}
        disabled={isLoading}
        onClick={() => {
          next();
        }}
      >
        {acceptAction}
      </Button>,
      ,
    ];
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Solicitud de Mentoría</DialogTitle>
          <DialogDescription>Detalles de la solicitud de mentoría</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold text-lg">
                {selectedRequest?.tutee.firstName.charAt(0)}
                {selectedRequest?.tutee.lastName.charAt(0)}
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
            <div>
              <span className="text-sm font-medium">Skills solicitadas:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedRequest?.skills.map((skill) => (
                  <span key={skill.id} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-sm font-medium">Descripción de necesidades:</span>
              <p className="text-sm text-muted-foreground mt-1">{selectedRequest?.needsDescription}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Estado:</span>
            {renderState(selectedRequest?.requestStatus)}
          </div>
        </div>

        <DialogFooter>{renderActions()}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MentorshipActionModal;
