import { httpClient } from "../adapters/httpClient/httpClient";
import type { Chapter } from "../models/TutoringRequest";

export interface GetFindChapterResponse {
  message: string;
  data: Chapter;
  timestamp: string;
}

export async function getFindChapter(id: string) {
  const { data } = await httpClient.get<GetFindChapterResponse>(`/api/chapter/${id}`);
  return data;
}
