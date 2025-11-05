import React, { useEffect, useState, useCallback, useMemo } from "react";
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
import { logger } from "@/shared/utils/logger";

/**
 * TutoringDetailModal component displays detailed information about a tutoring session.
 * Shows participant info, status, skills, dates, document link, and feedback from both tutor and tutee.
 *
 * @component
 * @example
 * ```tsx
 * <TutoringDetailModal
 *   isOpen={true}
 *   onClose={() => setIsOpen(false)}
 *   tutoringId="123"
 * />
 * ```
 */

interface TutoringDetailModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly tutoringId: string | null;
}

const TutoringDetailModal: React.FC<TutoringDetailModalProps> = ({ isOpen, onClose, tutoringId }) => {
  const [tutoring, setTutoring] = useState<TutoringSummaryDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const renderStars = useCallback((score: number) => {
    return (
      <div className="flex gap-1" role="img" aria-label={`${score} de 5 estrellas`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= score ? "fill-yellow-400 text-yellow-400" : "text-slate-600"}`}
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }, []);

  const handleClose = useCallback(() => {
    setTutoring(null);
    onClose();
  }, [onClose]);

  const handleOpenDocument = useCallback(() => {
    if (tutoring?.finalActUrl) {
      window.open(tutoring.finalActUrl, "_blank");
    }
  }, [tutoring?.finalActUrl]);

  const hasNoFeedbacks = useMemo(() => {
    if (!tutoring) return true;
    return tutoring.feedbacks.tutorFeedbacks.length === 0 && tutoring.feedbacks.tuteeFeedbacks.length === 0;
  }, [tutoring]);

  const contentClassName = useMemo(
    () => "w-full max-w-full sm:max-w-2xl h-[100dvh] sm:h-[90vh] flex flex-col gap-0 p-4 sm:p-6",
    []
  );

  const headerClassName = useMemo(() => "flex-shrink-0 text-left", []);

  const titleClassName = useMemo(() => "flex gap-2 text-foreground", []);

  const scrollAreaClassName = useMemo(() => "flex-1 min-h-0", []);

  const containerClassName = useMemo(() => "pr-4 pt-4 space-y-6", []);

  const sectionClassName = useMemo(() => "space-y-3", []);

  const statusContainerClassName = useMemo(() => "flex items-center gap-2", []);

  const labelClassName = useMemo(() => "text-sm font-medium", []);

  const skillsContainerClassName = useMemo(() => "flex flex-wrap gap-2", []);

  const gridClassName = useMemo(() => "grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm", []);

  const mutedTextClassName = useMemo(() => "text-muted-foreground", []);

  const foregroundTextClassName = useMemo(() => "text-foreground", []);

  const buttonClassName = useMemo(
    () => "bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600/20 hover:border-blue-500/50",
    []
  );

  const noFeedbackClassName = useMemo(() => "text-center py-4", []);

  const footerClassName = useMemo(() => "flex-shrink-0 pt-4", []);

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
        logger.info("Tutoring summary loaded successfully", { tutoringId });
      } catch (err) {
        logger.error("Error fetching tutoring summary", err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTutoringDetail();
  }, [tutoringId, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={contentClassName} aria-labelledby="tutoring-detail-title">
        <DialogHeader className={headerClassName}>
          <DialogTitle id="tutoring-detail-title" className={titleClassName}>
            Detalle de Tutoría
          </DialogTitle>
          <DialogDescription>Sesión completada - Feedback completo</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <TutoringDetailSkeleton />
        ) : (
          tutoring && (
            <ScrollArea className={scrollAreaClassName}>
              <div className={containerClassName}>
                {/* Participant Section */}
                <section className={sectionClassName} aria-labelledby="participant-section">
                  <ParticipantCard user={tutoring.tutee} role={UserRole.TUTEE} />
                </section>

                {/* Status Section */}
                <section className="space-y-2" aria-labelledby="status-section">
                  <div className={statusContainerClassName}>
                    <span className={labelClassName}>Estado:</span>
                    {renderState(tutoring.status || "")}
                  </div>
                </section>

                {/* Skills Section */}
                <section className="space-y-2" aria-labelledby="skills-section">
                  <h4 id="skills-section" className={`${labelClassName} ${foregroundTextClassName}`}>
                    Habilidades trabajadas:
                  </h4>
                  <div className={skillsContainerClassName} role="list" aria-label="Lista de habilidades">
                    {tutoring.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs" role="listitem">
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </section>

                {/* Session Info Section */}
                <section className="space-y-2" aria-labelledby="session-info-section">
                  <h4 id="session-info-section" className={`${labelClassName} ${foregroundTextClassName}`}>
                    Información de la Sesión
                  </h4>
                  <div className={gridClassName}>
                    <div>
                      <span className={mutedTextClassName}>Fecha programada:</span>
                      <p className={foregroundTextClassName}>
                        <time>{tutoring.startDate}</time>
                      </p>
                    </div>
                    <div>
                      <span className={mutedTextClassName}>Fecha completada:</span>
                      <p className={foregroundTextClassName}>
                        <time>{tutoring.expectedEndDate}</time>
                      </p>
                    </div>
                    {tutoring.finalActUrl && (
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          className={buttonClassName}
                          onClick={handleOpenDocument}
                          aria-label="Abrir documento en nueva pestaña"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" aria-hidden="true" />
                          Ver Documento
                        </Button>
                      </div>
                    )}
                  </div>
                </section>

                {/* Feedback Section */}
                <section className="space-y-4" aria-labelledby="feedback-section">
                  <h4 id="feedback-section" className={`${labelClassName} ${foregroundTextClassName}`}>
                    Feedback de la Sesión
                  </h4>

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

                  {hasNoFeedbacks && (
                    <div className={noFeedbackClassName} role="status">
                      <p className="text-muted-foreground text-sm">No hay feedbacks disponibles para esta tutoría</p>
                    </div>
                  )}
                </section>
              </div>
            </ScrollArea>
          )
        )}

        <DialogFooter className={footerClassName}>
          <Button onClick={onClose} variant="outline" aria-label="Cerrar modal">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TutoringDetailModal;
