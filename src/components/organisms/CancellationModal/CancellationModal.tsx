import React, { useState, useCallback, useMemo } from "react";
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
import { toast } from "sonner";
import { logger } from "@/shared/utils/logger";
import { sanitizeInput } from "@/shared/utils/sanitize";
import { useAccessibilityAnnouncer } from "@/shared/hooks/useAccessibilityAnnouncer";
import { AccessibilityAnnouncer } from "@/components/atoms/AccessibilityAnnouncer";
import { getErrorMessage } from "@/shared/types/error.types";

/**
 * CancellationModal component for handling mentorship/request cancellations
 *
 * @component
 * @example
 * ```tsx
 * <CancellationModal
 *   type={MentorshipType.REQUEST}
 *   isOpen={true}
 *   onClose={() => setIsOpen(false)}
 *   onSubmitCancellation={async (reason) => await cancelRequest(reason)}
 * />
 * ```
 */

interface CancellationModalProps {
  readonly type: MentorshipType | string;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSubmitCancellation: (reason: string) => Promise<void>;
}

const CancellationModal: React.FC<CancellationModalProps> = ({
  type,
  isOpen,
  onClose,
  onSubmitCancellation,
}: CancellationModalProps) => {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { announce, message: announceMessage } = useAccessibilityAnnouncer();

  /**
   * Handles textarea change with sanitization
   */
  const handleReasonChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(e.target.value);
  }, []);

  // Memoize cancel title to avoid recalculation
  const cancelTitle = useMemo(
    () => (type === MentorshipType.REQUEST ? "Cancelar solicitud" : "Cancelar tutoría"),
    [type]
  );

  /**
   * Validates cancellation reason
   * @returns true if valid, false otherwise
   */
  const validateReason = useCallback((): boolean => {
    const sanitizedReason = sanitizeInput(reason);

    if (!sanitizedReason || sanitizedReason.trim().length === 0) {
      toast.error("Razón requerida", {
        description: "Por favor, proporciona una razón para la cancelación.",
      });
      announce("Error: Debes proporcionar una razón para la cancelación.");
      return false;
    }

    if (sanitizedReason.trim().length < 10) {
      toast.error("Razón muy corta", {
        description: "La razón debe tener al menos 10 caracteres.",
      });
      announce("Error: La razón debe ser más descriptiva.");
      return false;
    }

    return true;
  }, [reason, announce]);

  /**
   * Handles form submission
   */
  const handleSubmit = useCallback(async () => {
    if (!validateReason()) {
      return;
    }

    const sanitizedReason = sanitizeInput(reason);
    setIsSubmitting(true);

    try {
      await onSubmitCancellation(sanitizedReason);
      setReason("");
      onClose();
    } catch (error) {
      logger.error("Error submitting cancellation", error as Error, {
        type,
        reasonLength: sanitizedReason.length,
      });

      const errorMessage = getErrorMessage(error);
      announce(`Error: ${errorMessage}`);

      toast.error("Error al procesar la cancelación", {
        description: errorMessage || "Por favor, intenta nuevamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [validateReason, reason, onSubmitCancellation, announce, type, onClose]);

  /**
   * Handles dialog close
   */
  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      setReason("");
      onClose();
    }
  }, [isSubmitting, onClose]);

  // Memoize button disabled state
  const isDisabled = useMemo(() => reason.trim() === "" || isSubmitting, [reason, isSubmitting]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md" aria-describedby="dialog-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">{cancelTitle}</DialogTitle>
          <DialogDescription id="dialog-description">Esta acción no se puede deshacer</DialogDescription>
        </DialogHeader>

        <section className="space-y-6" role="form" aria-label="Formulario de cancelación">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">
              Razón de cancelación:{" "}
              <span className="text-destructive" aria-label="campo requerido">
                *
              </span>
            </h4>
            <Textarea
              value={reason}
              onChange={handleReasonChange}
              placeholder="Por favor, explica el motivo de la cancelación..."
              className="resize-none"
              rows={4}
              maxLength={500}
              aria-label="Razón de cancelación"
              aria-required="true"
              aria-describedby="char-count"
            />
            <p id="char-count" className="text-xs text-muted-foreground" aria-live="polite">
              {reason.length}/500 caracteres
            </p>
          </div>
        </section>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting} aria-label="Mantener y cerrar modal">
            Mantener
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={isDisabled}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Confirmar cancelación"
          >
            {isSubmitting ? "Cancelando..." : "Confirmar"}
          </Button>
        </DialogFooter>

        <AccessibilityAnnouncer message={announceMessage} />
      </DialogContent>
    </Dialog>
  );
};

export default CancellationModal;
