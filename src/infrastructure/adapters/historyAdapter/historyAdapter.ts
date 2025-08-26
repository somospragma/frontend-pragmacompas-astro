import { Status } from "@/shared/utils/enums/status";
import type { MyRequestsResponse, TutoringSession, UserRole } from "../../models/TutoringRequest";
import type { MentorshipData } from "@/shared/config/historyTableConfig";
import { dateAdapter } from "../dateAdapter/dateAdapter";

export function historyAdapter(apiData: MyRequestsResponse, role: UserRole): MentorshipData[] {
  const tableData: MentorshipData[] = [];

  if (apiData?.tutoringsAsTutor && role === "Tutor") {
    apiData.tutoringsAsTutor.forEach((data: TutoringSession) => {
      tableData.push({
        participant: `${data.tutee.firstName} ${data.tutee.lastName}`,
        role: data.tutee.rol,
        status: data.status,
        scheduledDate: dateAdapter(data.startDate).format("DD [de] MMMM, YYYY"),
        chapter: data.tutee.chapter.name,
        skills: data.skills.map((skill) => skill.name),
        action: getActionByStatus(data.status),
      });
    });
  }

  return tableData;
}

const getActionByStatus = (status: string): string => {
  switch (status) {
    case Status.Conversando:
    case Status.Asignada:
    case Status.Enviada:
    case Status.Activa:
      return "Finalizar";
    case Status.Aprobada:
    case Status.Completada:
      return "Cancelar";
    default:
      return "";
  }
};
