import type { TutoringSummary } from "@/infrastructure/models/TutoringSummary";
import type { FeedbackWithRole } from "@/shared/utils/helpers/feedbackHelpers";
import { processFeedbacksWithRoles, separateFeedbacksByRole } from "@/shared/utils/helpers/feedbackHelpers";
import { dateAdapter } from "@/infrastructure/adapters/dateAdapter/dateAdapter";

export interface TutoringSummaryDTO extends Omit<TutoringSummary, "startDate" | "expectedEndDate" | "feedbacks"> {
  startDate: string;
  expectedEndDate: string;
  feedbacks: {
    tutorFeedbacks: FeedbackWithRole[];
    tuteeFeedbacks: FeedbackWithRole[];
  };
}

export function adaptTutoringSummaryForUI(summary: TutoringSummary): TutoringSummaryDTO {
  const formattedStartDate = dateAdapter(summary.startDate).format("DD [de] MMMM, YYYY");
  const formattedEndDate = dateAdapter(summary.expectedEndDate).format("DD [de] MMMM, YYYY");

  const feedbacksWithRoles = processFeedbacksWithRoles(summary.feedbacks);
  const separatedFeedbacks = separateFeedbacksByRole(feedbacksWithRoles);

  return {
    ...summary,
    startDate: formattedStartDate,
    expectedEndDate: formattedEndDate,
    feedbacks: separatedFeedbacks,
  };
}
