import React, { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/molecules/Dialog/Dialog";
import { ExternalLink, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TutoringSummaryDTO } from "@/infrastructure/adapters/tutoringSummaryAdapter/tutoringSummaryAdapter";
import { getTutoringSummary } from "@/infrastructure/services/getTutoringSummary";
import { adaptTutoringSummaryForUI } from "@/infrastructure/adapters/tutoringSummaryAdapter/tutoringSummaryAdapter";
import { renderState } from "@/shared/utils/helpers/renderState";
import { ParticipantCard } from "@/components/molecules/ParticipantCard/ParticipantCard";
import { FeedbackCard } from "@/components/molecules/FeedbackCard/FeedbackCard";
import { UserRole } from "@/shared/utils/enums/role";
import { TutoringDetailSkeleton } from "./TutoringDetailSkeleton";

interface TutoringDetailModal {
  isOpen: boolean;
  onClose: () => void;
  tutoringId: string | null;
}

const TutoringDetailModal: React.FC<TutoringDetailModal> = ({ isOpen, onClose, tutoringId }) => {
  const [tutoring, setTutoring] = useState<TutoringSummaryDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const renderStars = useCallback((score: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= score ? "fill-yellow-400 text-yellow-400" : "text-slate-600"}`}
          />
        ))}
      </div>
    );
  }, []);

  const handleClose = useCallback(() => {
    setTutoring(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    const fetchTutoringDetail = async () => {
      if (!tutoringId || !isOpen) {
        setTutoring(null);
        return;
      }

      setIsLoading(true);
      try {
        const response = await getTutoringSummary(tutoringId);
        const adaptedSummary = adaptTutoringSummaryForUI(response);
        setTutoring(adaptedSummary);
      } catch (err) {
        console.error("Error fetching tutoring summary:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTutoringDetail();
  }, [tutoringId, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-full sm:max-w-2xl h-[100dvh] sm:h-[90vh] flex flex-col gap-0 p-4 sm:p-6">
        <DialogHeader className="flex-shrink-0 text-left">
          <DialogTitle className="flex gap-2 text-foreground">Detalle de Tutoría</DialogTitle>
          <DialogDescription>Sesión completada - Feedback completo</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <TutoringDetailSkeleton />
        ) : (
          tutoring && (
            <ScrollArea className="flex-1 min-h-0">
              <div className="pr-4 pt-4 space-y-6">
                <div className="space-y-3">
                  <ParticipantCard user={tutoring.tutee} role={UserRole.TUTEE} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Estado:</span>
                    {renderState(tutoring.status || "")}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Habilidades trabajadas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {tutoring.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Información de la Sesión</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Fecha programada:</span>
                      <p className="text-foreground">{tutoring.startDate}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Fecha completada:</span>
                      <p className="text-foreground">{tutoring.expectedEndDate}</p>
                    </div>
                    {tutoring.finalActUrl && (
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600/20 hover:border-blue-500/50"
                          onClick={() => window.open(tutoring.finalActUrl, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Ver Documento
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-foreground">Feedback de la Sesión</h4>

                  {tutoring.feedbacks.tutorFeedbacks.map((feedback) => (
                    <FeedbackCard
                      key={feedback.id}
                      feedback={feedback}
                      role={UserRole.TUTOR}
                      renderStars={renderStars}
                    />
                  ))}

                  {tutoring.feedbacks.tuteeFeedbacks.map((feedback) => (
                    <FeedbackCard
                      key={feedback.id}
                      feedback={feedback}
                      role={UserRole.TUTEE}
                      renderStars={renderStars}
                    />
                  ))}

                  {tutoring.feedbacks.tutorFeedbacks.length === 0 && tutoring.feedbacks.tuteeFeedbacks.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground text-sm">No hay feedbacks disponibles para esta tutoría</p>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          )
        )}

        <DialogFooter className="flex-shrink-0 pt-4">
          <Button onClick={onClose} variant="outline">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TutoringDetailModal;
