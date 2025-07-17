import { httpClient } from "../adapters/httpClient/httpClient";
import type { Tutoring } from "../models/Tutoring";

export interface CompleteTutoringBody {
  userId: string;
  comments?: string;
}

export interface CompleteTutoringResponse {
  message: string;
  data: Tutoring;
  timestamp: string;
}

export async function completeTutoring(tutoringId: string, body: CompleteTutoringBody) {
  const { data } = await httpClient.patch<CompleteTutoringResponse>(`/api/v1/tutorings/${tutoringId}/complete`, body);
  return data;
}
