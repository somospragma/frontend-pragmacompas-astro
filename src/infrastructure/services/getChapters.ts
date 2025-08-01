import { httpClient } from "../adapters/httpClient/httpClient";
import type { Chapter } from "../models/TutoringRequest";

export interface GetChaptersResponse {
  message: string;
  data: Chapter[];
  timestamp: string;
}

export async function getChapters() {
  const { data } = await httpClient.get<GetChaptersResponse>("/api/v1/chapter");
  return data;
}
