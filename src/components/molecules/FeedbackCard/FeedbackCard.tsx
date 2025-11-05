import React, { useMemo } from "react";
import { dateAdapter } from "@/infrastructure/adapters/dateAdapter/dateAdapter";
import type { FeedbackWithRole } from "@/shared/utils/helpers/feedbackHelpers";
import type { UserRole } from "@/shared/utils/enums/role";

interface FeedbackCardProps {
  readonly feedback: FeedbackWithRole;
  readonly role: UserRole;
  readonly renderStars: (score: number) => React.ReactNode;
}

/**
 * FeedbackCard displays feedback information with score, comments, and evaluator details
 * @param feedback - Feedback object containing score, comments, evaluator info, and date
 * @param role - Role of the evaluator (Tutor or Tutee)
 * @param renderStars - Function to render star rating visualization
 */
export const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, role, renderStars }) => {
  // Memoize evaluator name
  const evaluatorName = useMemo(() => {
    return `${feedback.evaluator.firstName} ${feedback.evaluator.lastName}`;
  }, [feedback.evaluator.firstName, feedback.evaluator.lastName]);

  // Memoize formatted date
  const formattedDate = useMemo(() => {
    return dateAdapter(feedback.evaluationDate).format("DD [de] MMMM, YYYY");
  }, [feedback.evaluationDate]);

  // Memoize score number
  const scoreNumber = useMemo(() => {
    return Number(feedback.score);
  }, [feedback.score]);

  // Memoize aria label
  const ariaLabel = useMemo(() => {
    return `Feedback del ${role}: ${evaluatorName}, puntuación ${feedback.score} de 5`;
  }, [role, evaluatorName, feedback.score]);

  return (
    <article className="bg-slate-800/30 rounded-lg border border-slate-700/30 p-4" aria-label={ariaLabel}>
      <div className="flex items-center justify-between mb-3">
        <h5 className="font-semibold text-foreground">
          Feedback del {role} - {evaluatorName}
        </h5>
        <div className="flex items-center gap-2" role="img" aria-label={`Puntuación: ${feedback.score} de 5 estrellas`}>
          {renderStars(scoreNumber)}
          <span className="text-foreground text-sm ml-2" aria-hidden="true">
            {feedback.score}/5
          </span>
        </div>
      </div>
      <p className="text-foreground leading-relaxed text-sm">{feedback.comments}</p>
      <time className="text-muted-foreground text-xs mt-2 block" dateTime={feedback.evaluationDate}>
        {formattedDate}
      </time>
    </article>
  );
};
