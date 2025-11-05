import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/molecules/Dialog/Dialog";
import { Star } from "lucide-react";
import { getTutoringSummary } from "@/infrastructure/services/getTutoringSummary";
import { AccessibilityAnnouncer } from "@/components/atoms/AccessibilityAnnouncer";
import { useAccessibilityAnnouncer } from "@/shared/hooks/useAccessibilityAnnouncer";
import { logger } from "@/shared/utils/logger";
import { sanitizeInput, sanitizeUrl } from "@/shared/utils/sanitize";
import { toast } from "sonner";
import { type ApiError, getErrorMessage } from "@/shared/types/error.types";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorship: {
    participant: string;
    participantRole: string;
    myRole: string;
    skills: string[];
    email?: string;
    tutorId: string;
    tutoringId: string;
  };
  currentUserId: string;
  userAlreadyGaveFeedback: boolean;
  onSubmitFeedback: (score: number, comments: string, documentUrl?: string) => Promise<void>;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  mentorship,
  currentUserId,
  userAlreadyGaveFeedback,
  onSubmitFeedback,
}: FeedbackModalProps) => {
  const [formData, setFormData] = useState({
    score: 0,
    comment: "",
    documentUrl: "",
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canComplete, setCanComplete] = useState(false);
  const [isCheckingFeedback, setIsCheckingFeedback] = useState(false);
  const [urlError, setUrlError] = useState<string>("");
  const { announce, message: announceMessage } = useAccessibilityAnnouncer();

  const isTutor = useMemo(() => mentorship.tutorId === currentUserId, [mentorship.tutorId, currentUserId]);

  const updateFormData = useCallback((field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  /**
   * Validates URL format in real-time
   * @param url - The URL to validate
   * @returns Error message if invalid, empty string if valid
   */
  const validateUrlFormat = useCallback((url: string): string => {
    if (!url || url.trim() === "") {
      return "";
    }

    const trimmedUrl = url.trim();

    if (!/^https?:\/\//i.test(trimmedUrl)) {
      return "La URL debe comenzar con http:// o https://";
    }

    try {
      new URL(trimmedUrl);
      return "";
    } catch {
      return "Formato de URL inválido";
    }
  }, []);

  /**
   * Handles document URL change with real-time validation
   * @param value - The new URL value
   */
  const handleUrlChange = useCallback(
    (value: string) => {
      updateFormData("documentUrl", value);
      const error = validateUrlFormat(value);
      setUrlError(error);

      if (error) {
        announce(`Error en URL: ${error}`);
      }
    },
    [updateFormData, validateUrlFormat, announce]
  );

  /**
   * Resets form to initial state
   */
  const resetForm = useCallback(() => {
    setFormData({ score: 0, comment: "", documentUrl: "" });
    setHoveredStar(0);
    setUrlError("");
  }, []);

  useEffect(() => {
    const checkTuteeFeedback = async () => {
      if (!isOpen || !mentorship.tutoringId || !isTutor) {
        setCanComplete(false);
        return;
      }

      try {
        setIsCheckingFeedback(true);
        const tutoringSummary = await getTutoringSummary(mentorship.tutoringId);
        const tuteeFeedback = tutoringSummary.feedbacks?.find((feedback) => feedback.evaluator.id !== currentUserId);
        setCanComplete(!!tuteeFeedback);

        if (tuteeFeedback) {
          announce("Puedes completar la mentoría proporcionando el acta de finalización.");
        }
      } catch (error) {
        logger.error("Error verificando feedback del tutorado", error as Error, {
          tutoringId: mentorship.tutoringId,
          userId: currentUserId,
        });

        const errorMessage = getErrorMessage(error);
        announce(`Error: ${errorMessage}`);

        toast.error("Error al verificar feedback", {
          description: errorMessage || "No se pudo verificar el estado de los feedbacks.",
        });

        setCanComplete(false);
      } finally {
        setIsCheckingFeedback(false);
      }
    };

    checkTuteeFeedback();
  }, [isOpen, mentorship.tutoringId, isTutor, currentUserId, announce]);

  /**
   * Validates form data and shows appropriate error messages
   * @returns true if validation passes, false otherwise
   */
  const validateForm = useCallback((): boolean => {
    const sanitizedComment = sanitizeInput(formData.comment);
    const sanitizedUrl = formData.documentUrl ? sanitizeUrl(formData.documentUrl) : "";

    // If user already gave feedback, only validate document URL
    if (userAlreadyGaveFeedback) {
      if (!canComplete) {
        toast.warning("No puedes completar la mentoría aún", {
          description: "Espera a que el tutorado dé su feedback.",
        });
        return false;
      }

      // Validate URL format
      if (urlError) {
        toast.error("URL inválida", {
          description: urlError,
        });
        announce(`Error: ${urlError}`);
        return false;
      }

      if (!sanitizedUrl) {
        toast.error("URL inválida", {
          description: "Proporciona una URL válida para el acta de finalización.",
        });
        return false;
      }

      return true;
    }

    if (formData.score === 0) {
      toast.error("Puntuación requerida", {
        description: "Selecciona una puntuación entre 1 y 5 estrellas.",
      });
      announce("Error: Debes seleccionar una puntuación.");
      return false;
    }

    if (!sanitizedComment || sanitizedComment.length === 0) {
      toast.error("Comentario requerido", {
        description: "Proporciona un comentario sobre la tutoría.",
      });
      announce("Error: Debes agregar un comentario.");
      return false;
    }

    // Validate document URL if tutor can complete
    if (isTutor && canComplete) {
      if (urlError) {
        toast.error("URL inválida", {
          description: urlError,
        });
        announce(`Error: ${urlError}`);
        return false;
      }

      if (!sanitizedUrl) {
        toast.error("Acta requerida", {
          description: "Proporciona el acta de finalización para completar la mentoría.",
        });
        announce("Error: Debes proporcionar el acta de finalización.");
        return false;
      }
    }

    return true;
  }, [formData, userAlreadyGaveFeedback, canComplete, urlError, announce, isTutor]);

  /**
   * Handles form submission
   */
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    const sanitizedComment = sanitizeInput(formData.comment);
    const sanitizedUrl = formData.documentUrl ? sanitizeUrl(formData.documentUrl) : undefined;

    setIsSubmitting(true);

    try {
      if (userAlreadyGaveFeedback) {
        await onSubmitFeedback(0, "", sanitizedUrl);
        announce("Mentoría completada exitosamente.");
        toast.success("Mentoría completada", {
          description: "El acta ha sido registrada correctamente.",
        });
      } else {
        await onSubmitFeedback(formData.score, sanitizedComment, isTutor && canComplete ? sanitizedUrl : undefined);

        const successMessage =
          isTutor && canComplete
            ? "Feedback enviado y mentoría completada exitosamente."
            : "Feedback enviado correctamente.";

        let description: string;
        if (isTutor && canComplete) {
          description = "El acta ha sido registrada correctamente.";
        } else if (isTutor) {
          description = "Podrás completar la mentoría cuando el tutorado también haya dado feedback.";
        } else {
          description = "Tu evaluación ha sido registrada.";
        }

        announce(successMessage);
        toast.success("Feedback enviado", { description });
      }

      resetForm();
    } catch (error) {
      logger.error("Error submitting feedback", error as Error, {
        tutoringId: mentorship.tutoringId,
        userId: currentUserId,
        userAlreadyGaveFeedback,
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
    } finally {
      setIsSubmitting(false);
    }
  }, [
    validateForm,
    formData,
    userAlreadyGaveFeedback,
    onSubmitFeedback,
    isTutor,
    canComplete,
    announce,
    resetForm,
    mentorship.tutoringId,
    currentUserId,
  ]);

  /**
   * Handles star rating click
   */
  const handleStarClick = useCallback(
    (star: number) => {
      const newScore = formData.score === star ? 0 : star;
      updateFormData("score", newScore);
      if (newScore === 0) {
        setHoveredStar(0);
        announce("Puntuación eliminada");
      } else {
        announce(`Puntuación seleccionada: ${newScore} de 5 estrellas`);
      }
    },
    [formData.score, updateFormData, announce]
  );

  const isDisabled = useMemo(
    () =>
      userAlreadyGaveFeedback
        ? isSubmitting || !canComplete || formData.documentUrl.trim() === "" || !!urlError
        : isSubmitting ||
          formData.score === 0 ||
          formData.comment.trim() === "" ||
          (isTutor && canComplete && (formData.documentUrl.trim() === "" || !!urlError)),
    [
      userAlreadyGaveFeedback,
      isSubmitting,
      canComplete,
      formData.documentUrl,
      formData.score,
      formData.comment,
      urlError,
      isTutor,
    ]
  );

  const userInitials = useMemo(
    () =>
      mentorship.participant
        .split(" ")
        .map((n) => n[0])
        .join(""),
    [mentorship.participant]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {userAlreadyGaveFeedback && isTutor ? "Completar Mentoría" : "Evaluación de Tutoría"}
          </DialogTitle>
          <DialogDescription>
            {userAlreadyGaveFeedback && isTutor
              ? "Proporciona el acta de finalización para completar la mentoría"
              : "Evalúa la sesión completada"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold text-lg">{userInitials}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{mentorship.participant}</h3>
              <p className="text-muted-foreground">{mentorship.participantRole}</p>
              <p className="text-sm text-muted-foreground">{mentorship.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Habilidades trabajadas:</h4>
            <div className="flex flex-wrap gap-2">
              {mentorship.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {!userAlreadyGaveFeedback && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Puntuación (1-5):</h4>
              <div className="flex gap-1" role="radiogroup" aria-label="Puntuación de la tutoría">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    role="radio"
                    aria-checked={formData.score === star}
                    aria-label={`${star} ${star === 1 ? "estrella" : "estrellas"}`}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="p-1 transition-colors hover:bg-accent rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= (hoveredStar || formData.score)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {isTutor && (
            <div className="space-y-2">
              <Label htmlFor="documentUrl" className="text-sm font-medium">
                Acta de finalización {canComplete && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="documentUrl"
                type="url"
                value={formData.documentUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://ejemplo.com/acta.pdf"
                disabled={!canComplete || isCheckingFeedback}
                aria-describedby="documentUrl-status"
                aria-invalid={!!urlError}
                className={urlError ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              <div id="documentUrl-status">
                {urlError && formData.documentUrl && (
                  <p className="text-xs text-red-600 dark:text-red-400" role="alert">
                    ⚠️ {urlError}
                  </p>
                )}
                {!urlError && isCheckingFeedback && (
                  <p className="text-xs text-muted-foreground animate-pulse">Verificando estado...</p>
                )}
                {!urlError && !isCheckingFeedback && canComplete && formData.documentUrl && (
                  <p className="text-xs text-green-600 dark:text-green-400">✓ Formato de URL válido</p>
                )}
                {!urlError && !isCheckingFeedback && canComplete && !formData.documentUrl && (
                  <p className="text-xs text-green-600 dark:text-green-400">
                    ✓ Puedes completar la mentoría proporcionando el acta.
                  </p>
                )}
                {!isCheckingFeedback && !canComplete && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    ⚠️ No puedes completar la mentoría hasta que el tutorado dé su feedback.
                  </p>
                )}
              </div>
            </div>
          )}

          {!userAlreadyGaveFeedback && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Comentario:</h4>
              <Textarea
                value={formData.comment}
                onChange={(e) => updateFormData("comment", e.target.value)}
                placeholder="Comparte tu experiencia con esta tutoría..."
                className="resize-none"
                rows={4}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isDisabled}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Enviando..." : "Enviar"}
          </Button>
        </DialogFooter>

        <AccessibilityAnnouncer message={announceMessage} />
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
