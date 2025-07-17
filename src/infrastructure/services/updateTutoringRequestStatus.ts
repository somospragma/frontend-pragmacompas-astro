import { httpClient } from "../adapters/httpClient/httpClient";
import type { TutoringRequest } from "../models/TutoringRequest";

export interface UpdateTutoringRequestStatusBody {
  status: "Enviada" | "Aprobada" | "Asignada" | "Rechazada";
}

export interface UpdateTutoringRequestStatusResponse {
  message: string;
  data: TutoringRequest;
  timestamp: string;
}

export async function updateTutoringRequestStatus(requestId: string, body: UpdateTutoringRequestStatusBody) {
  const { data } = await httpClient.patch<UpdateTutoringRequestStatusResponse>(
    `/api/v1/tutoring-requests/${requestId}/status`,
    body
  );
  return data;
}
