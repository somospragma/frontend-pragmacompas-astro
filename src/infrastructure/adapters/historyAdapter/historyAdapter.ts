import { Status } from "@/shared/utils/enums/status";
import type { MyRequestsResponse, TutoringRequest } from "../../models/TutoringRequest";
import type { MentorshipData } from "@/shared/config/historyTableConfig";

export function historyAdapter(apiData: MyRequestsResponse): MentorshipData[] {
  const tableData: MentorshipData[] = [];

  if (apiData.requests) {
    apiData.requests.forEach((request: TutoringRequest) => {
      tableData.push({
        participant: `${request.tutee.firstName} ${request.tutee.lastName}`,
        role: request.tutee.rol,
        status: request.requestStatus,
        scheduledDate: "", // Para request no viene campo de fecha
        chapter: request.tutee.chapter.name,
        skills: request.skills.map((skill) => skill.name),
        action: getActionByStatus(request.requestStatus),
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
      return "Finalizar";
    case Status.Aprobada:
      return "Cancelar";
    default:
      return "";
  }
};
