import { httpClient } from "../adapters/httpClient/httpClient";
import type { Tutoring } from "../models/Tutoring";

interface TutoringResponse {
  message: string;
  data: Tutoring[];
  timestamp: string;
}

export async function getTutoring(params: { chapterId?: string }) {
  const queryParams = new URLSearchParams();

  if (params.chapterId) {
    queryParams.append("chapterId", params.chapterId);
  }

  const baseUrl = "/api/v1/tutorings";
  const url = queryParams.toString() ? `${baseUrl}?${queryParams.toString()}` : baseUrl;

  const { data } = await httpClient.get<TutoringResponse>(url);
  return data;
}
