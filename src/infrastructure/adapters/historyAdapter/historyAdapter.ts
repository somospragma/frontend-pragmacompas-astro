import type { MentorshipData } from "../../../components/organisms/HistoryTable/HistoryTable.styles";
import type { MyRequestsResponse, TutoringRequest } from "../../models/TutoringRequest";

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
        action: "Finalizar", // Generar acciones dependiendo del estado
      });
    });
  }

  return tableData;
}
