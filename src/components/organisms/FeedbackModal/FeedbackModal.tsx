import React, { useState, useEffect } from "react";
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

  const isTutor = mentorship.tutorId === currentUserId;

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
      } catch (error) {
        console.error("Error verificando feedback del tutorado:", error);
        setCanComplete(false);
      } finally {
        setIsCheckingFeedback(false);
      }
    };

    checkTuteeFeedback();
  }, [isOpen, mentorship.tutoringId, isTutor, currentUserId]);

  const updateFormData = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({ score: 0, comment: "", documentUrl: "" });
    setHoveredStar(0);
  };

  const handleSubmit = async () => {
    if (userAlreadyGaveFeedback) {
      if (!canComplete || formData.documentUrl.trim() === "") {
        return;
      }
      setIsSubmitting(true);
      try {
        await onSubmitFeedback(0, "", formData.documentUrl);
        resetForm();
      } catch (error) {
        console.error("Error completing mentorship:", error);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (formData.comment.trim() === "" || formData.score === 0) {
      return;
    }

    if (isTutor && canComplete && formData.documentUrl.trim() === "") {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitFeedback(
        formData.score,
        formData.comment,
        isTutor && canComplete ? formData.documentUrl : undefined
      );
      resetForm();
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (star: number) => {
    const newScore = formData.score === star ? 0 : star;
    updateFormData("score", newScore);
    if (newScore === 0) setHoveredStar(0);
  };

  const isDisabled = userAlreadyGaveFeedback
    ? isSubmitting || !canComplete || formData.documentUrl.trim() === ""
    : isSubmitting ||
      formData.score === 0 ||
      formData.comment.trim() === "" ||
      (isTutor && canComplete && formData.documentUrl.trim() === "");

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
              <span className="text-primary font-semibold text-lg">
                {mentorship.participant
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
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
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="p-1 transition-colors hover:bg-accent rounded"
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
                onChange={(e) => updateFormData("documentUrl", e.target.value)}
                placeholder="https://..."
                disabled={!canComplete || isCheckingFeedback}
              />
              {isCheckingFeedback && <p className="text-xs text-muted-foreground">Verificando...</p>}
              {!isCheckingFeedback && canComplete && (
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
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
