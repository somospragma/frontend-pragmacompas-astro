import type { MyRequestsResponse, TutoringSession } from "../../models/TutoringRequest";
import type { MentorshipData } from "@/shared/config/historyTableConfig";
import { dateAdapter } from "../dateAdapter/dateAdapter";
import { MentorshipStatus } from "@/shared/utils/enums/mentorshipStatus";
import { UserRole } from "@/shared/utils/enums/role";
import { MentorshipType } from "@/shared/utils/enums/mentorshipType";
import { MentorshipAction } from "@/shared/utils/enums/mentorshipAction";

export function historyAdapter(data: MyRequestsResponse): MentorshipData[] {
  const result: MentorshipData[] = [];

  data.requests?.forEach((request) => {
    result.push({
      id: request.id,
      type: MentorshipType.REQUEST,
      role: UserRole.TUTEE,
      tutee: `${request.tutee.firstName} ${request.tutee.lastName}`,
      tutor: "Por asignar",
      evaluatorId: "",
      chapter: request?.tutee?.chapter?.name ?? "",
      skills: request.skills.map((skill) => skill.name),
      status: request.requestStatus,
      startDate: dateAdapter(request.requestDate).format("DD [de] MMMM, YYYY"),
      action: getAvailableActions(request.requestStatus, UserRole.TUTEE, MentorshipType.REQUEST),
    });
  });

  data.tutoringsAsTutor?.forEach((tutoring: TutoringSession) => {
    result.push({
      id: tutoring.id,
      type: MentorshipType.MENTORSHIP,
      role: UserRole.TUTOR,
      tutee: `${tutoring.tutee.firstName} ${tutoring.tutee.lastName}`,
      tutor: `${tutoring.tutor.firstName} ${tutoring.tutor.lastName}`,
      evaluatorId: `${tutoring.tutor.id}`,
      chapter: tutoring.tutee.chapter?.name ?? "",
      status: tutoring.status,
      startDate: dateAdapter(tutoring.startDate).format("DD [de] MMMM, YYYY"),
      skills: tutoring.skills.map((skill) => skill.name),
      action: getAvailableActions(tutoring.status, UserRole.TUTOR, MentorshipType.MENTORSHIP),
    });
  });

  data.tutoringsAsTutee?.forEach((tutoring) => {
    result.push({
      id: tutoring.id,
      type: MentorshipType.MENTORSHIP,
      role: UserRole.TUTEE,
      tutee: `${tutoring.tutee.firstName} ${tutoring.tutee.lastName}`,
      tutor: `${tutoring.tutor.firstName} ${tutoring.tutor.lastName}`,
      evaluatorId: `${tutoring.tutor.id}`,
      chapter: tutoring.tutor.chapter?.name ?? "",
      skills: tutoring.skills.map((skill) => skill.name),
      status: tutoring.status,
      startDate: dateAdapter(tutoring.startDate).format("DD [de] MMMM, YYYY"),
      action: getAvailableActions(tutoring.status, UserRole.TUTEE, MentorshipType.MENTORSHIP),
    });
  });

  return result;
}

const getAvailableActions = (
  status: MentorshipStatus,
  userRoleInItem: UserRole,
  itemType: MentorshipType
): string[] => {
  const actions: string[] = [];

  switch (itemType) {
    case MentorshipType.REQUEST:
      if (userRoleInItem === UserRole.TUTEE) {
        actions.push(MentorshipAction.CANCEL);
      }
      break;

    case MentorshipType.MENTORSHIP:
      if (status === MentorshipStatus.ACTIVE) {
        actions.push(MentorshipAction.CANCEL);
        actions.push(MentorshipAction.COMPLETE);
      }

      if (status === MentorshipStatus.CANCELLING) {
        actions.push(MentorshipAction.CANCEL);
      }
      break;

    default:
      break;
  }

  return actions;
};
