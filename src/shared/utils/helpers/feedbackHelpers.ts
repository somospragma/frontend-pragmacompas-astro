import { UserRole } from "@/shared/utils/enums/role";
import type { Feedback } from "@/infrastructure/models/TutoringRequest";

export interface FeedbackWithRole extends Feedback {
  evaluatorRole: UserRole.TUTOR | UserRole.TUTEE | "";
}

export function identifyEvaluatorRole(feedback: Feedback): FeedbackWithRole {
  const evaluatorId = feedback.evaluator.id;
  const tutorId = feedback.tutoring.tutor.id;
  const tuteeId = feedback.tutoring.tutee.id;

  let evaluatorRole: UserRole.TUTOR | UserRole.TUTEE | "" = "";

  if (evaluatorId === tutorId) {
    evaluatorRole = UserRole.TUTOR;
  } else if (evaluatorId === tuteeId) {
    evaluatorRole = UserRole.TUTEE;
  }

  return {
    ...feedback,
    evaluatorRole,
  };
}

export function processFeedbacksWithRoles(feedbacks: Feedback[]): FeedbackWithRole[] {
  return feedbacks.map(identifyEvaluatorRole);
}

export function separateFeedbacksByRole(feedbacks: FeedbackWithRole[]) {
  const tutorFeedbacks = feedbacks.filter((fb) => fb.evaluatorRole === UserRole.TUTOR);
  const tuteeFeedbacks = feedbacks.filter((fb) => fb.evaluatorRole === UserRole.TUTEE);

  return {
    tutorFeedbacks,
    tuteeFeedbacks,
  };
}
