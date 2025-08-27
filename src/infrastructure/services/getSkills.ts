import { httpClient } from "../adapters/httpClient/httpClient";
import type { Skill } from "../models/TutoringRequest";

interface SkillsResponse {
  message: string;
  data: Skill[];
  timestamp: string;
}

export async function getSkills(): Promise<Skill[]> {
  const response = await httpClient.get<SkillsResponse>("/api/v1/skills");
  console.log("✅ getSkills: Full response:", response.data);
  return response.data.data; // Extraer el array de skills del campo 'data'
}
