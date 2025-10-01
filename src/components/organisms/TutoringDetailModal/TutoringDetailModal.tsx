import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/molecules/Dialog/Dialog";
import { ExternalLink, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TutoringSummaryDTO } from "@/infrastructure/adapters/tutoringSummaryAdapter/tutoringSummaryAdapter";
import { getTutoringSummary } from "@/infrastructure/services/getTutoringSummary";
import { adaptTutoringSummaryForUI } from "@/infrastructure/adapters/tutoringSummaryAdapter/tutoringSummaryAdapter";
import { dateAdapter } from "@/infrastructure/adapters/dateAdapter/dateAdapter";
import { UserRole } from "@/shared/utils/enums/role";
import { renderState } from "@/shared/utils/helpers/renderState";

interface TutoringDetailModal {
  isOpen: boolean;
  onClose: () => void;
  tutoringId: string | null;
}

const TutoringDetailModal: React.FC<TutoringDetailModal> = ({ isOpen, onClose, tutoringId }) => {
  const [tutoring, setTutoring] = useState<TutoringSummaryDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const renderStars = (score: number) => {
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
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-foreground">Detalle de Tutoría</DialogTitle>
          <DialogDescription>Sesión completada - Feedback completo</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Cargando información...</span>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold text-lg">
                    {tutoring?.tutee.firstName.charAt(0)}
                    {tutoring?.tutee.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{`${tutoring?.tutee.firstName} ${tutoring?.tutee.lastName}`}</h3>
                  <p className="text-muted-foreground">{`${tutoring?.tutee?.chapter?.name} | ${UserRole.TUTEE}`}</p>
                  <p className="text-sm text-muted-foreground">{tutoring?.tutee?.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Estado:</span>
                {renderState(tutoring?.status || "")}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Habilidades trabajadas:</h4>
              <div className="flex flex-wrap gap-2">
                {tutoring?.skills.map((skill, index) => (
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
                  <p className="text-foreground">{tutoring?.startDate}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Fecha completada:</span>
                  <p className="text-foreground">{tutoring?.expectedEndDate}</p>
                </div>
                {tutoring?.finalActUrl && (
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600/20 hover:border-blue-500/50"
                      onClick={() => window.open(tutoring?.finalActUrl, "_blank")}
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

              {tutoring?.feedbacks.tutorFeedbacks.map((feedback) => (
                <div key={feedback.id} className="bg-slate-800/30 rounded-lg border border-slate-700/30 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-semibold text-foreground">
                      Feedback del Tutor - {feedback.evaluator.firstName} {feedback.evaluator.lastName}
                    </h5>
                    <div className="flex items-center gap-2">
                      {renderStars(Number(feedback.score))}
                      <span className="text-foreground text-sm ml-2">{feedback.score}/5</span>
                    </div>
                  </div>
                  <p className="text-foreground leading-relaxed text-sm">{feedback.comments}</p>
                  <p className="text-muted-foreground text-xs mt-2">
                    {dateAdapter(feedback.evaluationDate).format("DD [de] MMMM, YYYY")}
                  </p>
                </div>
              ))}

              {tutoring?.feedbacks.tuteeFeedbacks.map((feedback) => (
                <div key={feedback.id} className="bg-slate-800/30 rounded-lg border border-slate-700/30 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-semibold text-foreground">
                      Feedback del Tutorado - {feedback.evaluator.firstName} {feedback.evaluator.lastName}
                    </h5>
                    <div className="flex items-center gap-2">
                      {renderStars(Number(feedback.score))}
                      <span className="text-foreground text-sm ml-2">{feedback.score}/5</span>
                    </div>
                  </div>
                  <p className="text-foreground leading-relaxed text-sm">{feedback.comments}</p>
                  <p className="text-muted-foreground text-xs mt-2">
                    {dateAdapter(feedback.evaluationDate).format("DD [de] MMMM, YYYY")}
                  </p>
                </div>
              ))}

              {tutoring?.feedbacks.tutorFeedbacks.length === 0 && tutoring?.feedbacks.tuteeFeedbacks.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-muted-foreground text-sm">No hay feedbacks disponibles para esta tutoría</p>
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="flex-shrink-0 mt-4">
          <Button onClick={onClose} variant="outline">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TutoringDetailModal;
