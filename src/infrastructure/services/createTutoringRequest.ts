import { httpClient } from "../adapters/httpClient/httpClient";
import type { TutoringRequest } from "../models/TutoringRequest";

export interface CreateTutoringRequestBody {
  tuteeId: string;
  skillIds?: string[];
  needsDescription: string;
}

export interface CreateTutoringRequestResponse {
  message: string;
  data: TutoringRequest;
  timestamp: string;
}

export async function createTutoringRequest(body: CreateTutoringRequestBody) {
  const { data } = await httpClient.post<CreateTutoringRequestResponse>("/api/v1/tutoring-requests", body);
  return data;
}
