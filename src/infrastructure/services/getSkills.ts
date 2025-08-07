import { httpClient } from "../adapters/httpClient/httpClient";
import type { Skill } from "../models/TutoringRequest";

export interface GetSkillsResponse {
  message: string;
  data: Skill[];
  timestamp: string;
}

export async function getSkills() {
  const { data } = await httpClient.get<GetSkillsResponse>("/api/v1/skills");
  return data.data;
}
