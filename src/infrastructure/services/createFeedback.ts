import { httpClient } from "../adapters/httpClient/httpClient";

export interface CreateFeedbackBody {
  tutoringId: string;
  score: string;
  comments: string;
  evaluatorId: string;
}

export interface CreateFeedbackResponse {
  message: string;
  data: string;
  timestamp: string;
}

export async function createFeedback(body: CreateFeedbackBody) {
  const { data } = await httpClient.post<CreateFeedbackResponse>("/api/v1/feedbacks", body);
  return data;
}
