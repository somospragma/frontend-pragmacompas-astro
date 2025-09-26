import { MentorshipState } from "@/shared/entities/mentorshipState";

export const getStatusBadgeClasses = (status: string): string => {
  const statusClasses: Record<string, string> = {
    [MentorshipState.COMPLETED]: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    [MentorshipState.AVAILABLE]: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
    [MentorshipState.ACTIVE]: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    [MentorshipState.ASSIGNED]: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    [MentorshipState.CONVERSING]: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    [MentorshipState.PENDING]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    [MentorshipState.CANCELLED]: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    [MentorshipState.CANCELLING]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  };
  return statusClasses[status] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
};

export const getVariantButtonClasses = (
  action: string
): "default" | "link" | "destructive" | "secondary" | "outline" | "ghost" => {
  const actionClasses: Record<string, "default" | "link" | "destructive" | "secondary" | "outline" | "ghost"> = {
    ["Cancelar"]: "destructive",
  };
  return actionClasses[action] || "default";
};
