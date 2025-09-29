import React from "react";
import { DEFAULT_STYLE, STATUS_STYLES } from "../constants/statusStyles";
import type { MentorshipStatus } from "../enums/mentorshipStatus";
import { Badge } from "@/components/ui/badge";

export const renderState = (state: MentorshipStatus) => {
  const className = STATUS_STYLES[state] || DEFAULT_STYLE;
  return React.createElement(Badge, { className: `px-3 py-1 rounded-full text-xs ${className}` }, state);
};
