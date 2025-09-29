import { MentorshipStatus } from "../enums/mentorshipStatus";

export function displayStatus(status: MentorshipStatus | string) {
  if (status === MentorshipStatus.CANCELLING) {
    return "Cancelando";
  }
  if (status === MentorshipStatus.AVAILABLE) {
    return "Disponible";
  }
  return status;
}
