import { httpClient } from "../adapters/httpClient/httpClient";
import type { Tutoring } from "../models/Tutoring";

export interface CreateTutoringRequestBody {
  tuteeId: string;
  skills: string[];
  chapterId: string;
  note: string;
}

export interface CreateTutoringRequestResponse {
  message: string;
  data: Tutoring;
  timestamp: string;
}

export async function createTutoringRequest(body: CreateTutoringRequestBody) {
  const { data } = await httpClient.post<CreateTutoringRequestResponse>("/api/v1/tutoring-requests", body);
  return data;
}
