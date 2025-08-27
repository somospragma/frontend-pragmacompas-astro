import type { MyRequestsResponse, TutoringSession, UserRole } from "../../models/TutoringRequest";
import type { MentorshipData } from "@/shared/config/historyTableConfig";
import { dateAdapter } from "../dateAdapter/dateAdapter";
import { MentorshipState, transitions } from "@/shared/entities/mentorshipState";

export function historyAdapter(data: MyRequestsResponse): MentorshipData[] {
  const result: MentorshipData[] = [];

  data.requests?.forEach((request) => {
    result.push({
      id: request.id,
      type: "Solicitud",
      role: "Tutorado",
      tutee: `${request.tutee.firstName} ${request.tutee.lastName}`,
      tutor: "Por asignar",
      evaluatorId: "",
      chapter: request?.tutee?.chapter?.name ?? "",
      skills: request.skills.map((skill) => skill.name),
      status: request.requestStatus,
      startDate: "",
      action: getAvailableActions(request.requestStatus, "Tutorado", "Solicitud"),
    });
  });

  data.tutoringsAsTutor?.forEach((tutoring: TutoringSession) => {
    result.push({
      id: tutoring.id,
      type: "Mentoría",
      role: "Tutor",
      tutee: `${tutoring.tutee.firstName} ${tutoring.tutee.lastName}`,
      tutor: `${tutoring.tutor.firstName} ${tutoring.tutor.lastName}`,
      evaluatorId: `${tutoring.tutor.id}`,
      chapter: tutoring.tutee.chapter?.name ?? "",
      status: tutoring.status,
      startDate: dateAdapter(tutoring.startDate).format("DD [de] MMMM, YYYY"),
      skills: tutoring.skills.map((skill) => skill.name),
      action: getAvailableActions(tutoring.status, "Tutor", "Mentoría"),
    });
  });

  data.tutoringsAsTutee?.forEach((tutoring) => {
    result.push({
      id: tutoring.id,
      type: "Mentoría",
      role: "Tutorado",
      tutee: `${tutoring.tutee.firstName} ${tutoring.tutee.lastName}`,
      tutor: `${tutoring.tutor.firstName} ${tutoring.tutor.lastName}`,
      evaluatorId: `${tutoring.tutor.id}`,
      chapter: tutoring.tutor.chapter?.name ?? "",
      skills: tutoring.skills.map((skill) => skill.name),
      status: tutoring.status,
      startDate: dateAdapter(tutoring.startDate).format("DD [de] MMMM, YYYY"),
      action: getAvailableActions(tutoring.status, "Tutorado", "Mentoría"),
    });
  });

  return result;
}

const getAvailableActions = (
  status: MentorshipState,
  userRoleInItem: UserRole,
  itemType: "Solicitud" | "Mentoría"
): string[] => {
  const result: string[] = [];
  const availableTransitions = transitions[status] || {};

  if (status === ("Activa" as MentorshipState)) {
    result.push("Finalizar");
  }

  // Lógica para CANCELAR
  if (availableTransitions.CANCEL && status !== MentorshipState.CANCELLING) {
    switch (itemType) {
      case "Solicitud":
        // El tutorado puede cancelar su propia solicitud en cualquier estado cancelable
        if (userRoleInItem === "Tutorado") {
          result.push("Cancelar");
        }
        break;

      case "Mentoría":
        // Tanto tutor como tutorado pueden cancelar la mentoría
        if (
          status === MentorshipState.CONVERSING ||
          status === MentorshipState.ASSIGNED ||
          status === MentorshipState.PENDING
        ) {
          result.push("Cancelar");
        }
        break;
    }
  }

  return result;
};
