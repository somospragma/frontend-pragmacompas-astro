import { Status } from "@/shared/utils/enums/status";
import type { MyRequestsResponse, TutoringSession, UserRole } from "../../models/TutoringRequest";
import type { MentorshipData } from "@/shared/config/historyTableConfig";
import { dateAdapter } from "../dateAdapter/dateAdapter";

export function historyAdapter(data: MyRequestsResponse): MentorshipData[] {
  const result: MentorshipData[] = [];

  data.requests?.forEach((request) => {
    result.push({
      id: request.id,
      type: "Solicitud",
      role: "Tutorado",
      tutee: `${request.tutee.firstName} ${request.tutee.lastName}`,
      tutor: "Por asignar",
      chapter: request.tutee.chapter.name,
      skills: request.skills.map((skill) => skill.name),
      status: request.requestStatus,
      startDate: "",
      action: "Cancelar",
    });
  });

  data.tutoringsAsTutor?.forEach((tutoring: TutoringSession) => {
    result.push({
      id: tutoring.id,
      type: "Mentoría",
      role: "Tutor",
      tutee: `${tutoring.tutee.firstName} ${tutoring.tutee.lastName}`,
      tutor: `${tutoring.tutor.firstName} ${tutoring.tutor.lastName}`,
      chapter: tutoring.tutee.chapter.name,
      status: tutoring.status,
      startDate: dateAdapter(tutoring.startDate).format("DD [de] MMMM, YYYY"),
      skills: tutoring.skills.map((skill) => skill.name),
      action: getActionByStatus(tutoring.status, "Tutor"),
    });
  });

  data.tutoringsAsTutee?.forEach((tutoring) => {
    result.push({
      id: tutoring.id,
      type: "Mentoría",
      role: "Tutorado",
      tutee: `${tutoring.tutee.firstName} ${tutoring.tutee.lastName}`,
      tutor: `${tutoring.tutor.firstName} ${tutoring.tutor.lastName}`,
      chapter: tutoring.tutor.chapter.name,
      skills: tutoring.skills.map((skill) => skill.name),
      status: tutoring.status,
      startDate: dateAdapter(tutoring.startDate).format("DD [de] MMMM, YYYY"),
      action: getActionByStatus(tutoring.status, "Tutorado"),
    });
  });

  return result;
}

const getActionByStatus = (status: string, userRole: UserRole): string => {
  if (userRole === "Tutor") {
    switch (status) {
      case Status.Activa:
        return "Finalizar";
      default:
        return "";
    }
  }

  if (userRole === "Tutorado") {
    switch (status) {
      case Status.Pendiente:
      case Status.Activa:
        return "Cancelar";
      default:
        return "";
    }
  }

  return "";
};
