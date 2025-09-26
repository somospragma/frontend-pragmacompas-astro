import { MentorshipStatus } from "../enums/mentorshipStatus";

export const STATUS_STYLES: Record<MentorshipStatus, string> = {
  [MentorshipStatus.ACTIVE]: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  [MentorshipStatus.PENDING]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  [MentorshipStatus.AVAILABLE]: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  [MentorshipStatus.CONVERSING]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  [MentorshipStatus.ASSIGNED]: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  [MentorshipStatus.CANCELLING]: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  [MentorshipStatus.COMPLETED]: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  [MentorshipStatus.CANCELLED]: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export const DEFAULT_STYLE = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
