import React from "react";
import { dateAdapter } from "@/infrastructure/adapters/dateAdapter/dateAdapter";
import type { FeedbackWithRole } from "@/shared/utils/helpers/feedbackHelpers";
import type { UserRole } from "@/shared/utils/enums/role";

interface FeedbackCardProps {
  feedback: FeedbackWithRole;
  role: UserRole;
  renderStars: (score: number) => React.ReactNode;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, role, renderStars }) => {
  return (
    <div className="bg-slate-800/30 rounded-lg border border-slate-700/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <h5 className="font-semibold text-foreground">
          Feedback del {role} - {feedback.evaluator.firstName} {feedback.evaluator.lastName}
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
  );
};
