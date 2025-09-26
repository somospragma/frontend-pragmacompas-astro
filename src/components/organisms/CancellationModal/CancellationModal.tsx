import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/molecules/Dialog/Dialog";
import { MentorshipType } from "@/shared/utils/enums/mentorshipType";

interface CancellationModalProps {
  type: MentorshipType | string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitCancellation: (reason: string) => Promise<void>;
}

const CancellationModal: React.FC<CancellationModalProps> = ({
  type,
  isOpen,
  onClose,
  onSubmitCancellation,
}: CancellationModalProps) => {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (reason.trim() === "") return;
    setIsSubmitting(true);
    try {
      await onSubmitCancellation(reason);
      setReason("");
      onClose();
    } catch (error) {
      console.error("Error submitting cancellation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setReason("");
      onClose();
    }
  };

  const cancelTitle = type === MentorshipType.REQUEST ? "Cancelar solicitud" : "Cancelar tutoría";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">{cancelTitle}</DialogTitle>
          <DialogDescription>Esta acción no se puede deshacer</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">
              Razón de cancelación: <span className="text-destructive">*</span>
            </h4>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Por favor, explica el motivo de la cancelación..."
              className="resize-none"
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">{reason.length}/500 caracteres</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Mantener
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={reason.trim() === "" || isSubmitting}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Cancelando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancellationModal;
