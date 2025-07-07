import { httpClient } from "../adapters/httpClient/httpClient";
import type { Skill } from "../models/TutoringRequest";

export interface UpdateSkillBody {
  id: string;
  name: string;
}

export async function updateSkill(body: UpdateSkillBody) {
  const { data } = await httpClient.put<Skill>("/api/v1/skills", body);
  return data;
}
