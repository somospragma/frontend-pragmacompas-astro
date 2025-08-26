import { httpClient } from "../adapters/httpClient/httpClient";
import type { TutoringRequest } from "../models/TutoringRequest";

export interface GetTutoringRequestsParams {
  tuteeId?: string;
  skillId?: string;
  status?: "Enviada" | "Aprobada" | "Asignada" | "Finalizada";
  chapterId?: string;
}

export interface GetTutoringRequestsResponse {
  message: string;
  data: TutoringRequest[];
  timestamp: string;
}

export async function getTutoringRequests(params: GetTutoringRequestsParams) {
  // Build query parameters dynamically
  const queryParams = new URLSearchParams();

  if (params.tuteeId) {
    queryParams.append("tuteeId", params.tuteeId);
  }

  if (params.skillId) {
    queryParams.append("skillId", params.skillId);
  }

  if (params.status) {
    queryParams.append("status", params.status);
  }

  if (params.chapterId) {
    queryParams.append("chapterId", params.chapterId);
  }

  // Build the final URL
  const baseUrl = "/api/v1/tutoring-requests";
  const url = queryParams.toString() ? `${baseUrl}?${queryParams.toString()}` : baseUrl;

  const { data } = await httpClient.get<GetTutoringRequestsResponse>(url);
  return data;
}
