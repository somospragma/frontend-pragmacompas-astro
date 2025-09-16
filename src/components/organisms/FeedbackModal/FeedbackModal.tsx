import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/molecules/Dialog/Dialog";
import { Star } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorship: {
    participant: string;
    role: string;
    skills: string[];
  };
  onSubmitFeedback: (score: number, comments: string) => Promise<void>;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  mentorship,
  onSubmitFeedback,
}: FeedbackModalProps) => {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (score === 0) return;
    setIsSubmitting(true);
    try {
      await onSubmitFeedback(score, comment);
      setScore(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Evaluación de Tutoría</DialogTitle>
          <DialogDescription>Evalúa la sesión completada</DialogDescription>
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
              <p className="text-muted-foreground">{mentorship.role}</p>
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

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Puntuación (1-5):</h4>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setScore(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="p-1 transition-colors hover:bg-accent rounded"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= (hoveredStar || score) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Comentario:</h4>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comparte tu experiencia con esta tutoría..."
              className="resize-none"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={score === 0 || isSubmitting}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Enviando..." : "Enviar Evaluación"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
