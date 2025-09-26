import { DEFAULT_STYLE, STATUS_STYLES } from "../constants/statusStyles";
import { MentorshipStatus } from "../enums/mentorshipStatus";

export const getStatusBadgeClasses = (status: MentorshipStatus): string => {
  return STATUS_STYLES[status] || DEFAULT_STYLE;
};

export const getVariantButtonClasses = (
  action: string
): "default" | "link" | "destructive" | "secondary" | "outline" | "ghost" => {
  const actionClasses: Record<string, "default" | "link" | "destructive" | "secondary" | "outline" | "ghost"> = {
    ["Cancelar"]: "destructive",
  };
  return actionClasses[action] || "default";
};
