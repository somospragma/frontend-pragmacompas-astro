import { httpClient } from "../adapters/httpClient/httpClient";
import type { TutoringSummary } from "../models/TutoringSummary";

export interface TutoringResponse {
  message: string;
  data: TutoringSummary;
  timestamp: string;
}

export async function getTutoringSummary(tutoringId: string) {
  const { data } = await httpClient.get<TutoringResponse>(`/api/v1/tutorings/${tutoringId}/detail`);
  return data.data;
}
