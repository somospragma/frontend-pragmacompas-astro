import { httpClient } from "../adapters/httpClient/httpClient";
import type { Tutoring } from "../models/Tutoring";

export interface CancelTutoringBody {
  userId?: string;
  comments?: string;
}

export interface CancelTutoringResponse {
  message: string;
  data: Tutoring;
  timestamp: string;
}

export async function cancelTutoring(tutoringId: string, body: CancelTutoringBody) {
  const { data } = await httpClient.patch<CancelTutoringResponse>(`/api/v1/tutorings/${tutoringId}/cancel`, body);
  return data;
}
