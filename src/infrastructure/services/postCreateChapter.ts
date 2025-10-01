import { httpClient } from "../adapters/httpClient/httpClient";
import type { Chapter } from "../models/TutoringRequest";

export interface PostCreateChapterBody {
  name: string;
}

export interface PostCreateChapterResponse {
  message: string;
  data: Chapter;
  timestamp: string;
}

export async function postCreateChapter(body: PostCreateChapterBody) {
  const { data } = await httpClient.post<PostCreateChapterResponse>("/api/chapter", body);
  return data;
}
