import React from "react";
import { DEFAULT_STYLE, STATUS_STYLES } from "../constants/statusStyles";
import type { MentorshipStatus } from "../enums/mentorshipStatus";
import { Badge } from "@/components/ui/badge";
import { displayStatus } from "./displayStatus";

export const renderState = (state: MentorshipStatus | string) => {
  const className =
    typeof state === "string" && state in STATUS_STYLES ? STATUS_STYLES[state as MentorshipStatus] : DEFAULT_STYLE;
  return React.createElement(Badge, { className: `px-3 py-1 rounded-full text-xs ${className}` }, displayStatus(state));
};
