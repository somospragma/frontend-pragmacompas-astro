import { httpClient } from "../adapters/httpClient/httpClient";
import type { Tutoring } from "../models/Tutoring";

export interface CreateTutoringBody {
  tutoringRequestId: string;
  tutorId: string;
  objectives: string;
}

export interface CreateTutoringResponse {
  message: string;
  data: Tutoring;
  timestamp: string;
}

export async function createTutoring(body: CreateTutoringBody) {
  const { data } = await httpClient.post<CreateTutoringResponse>("/api/v1/tutorings", body);
  return data;
}
