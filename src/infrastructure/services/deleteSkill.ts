import { httpClient } from "../adapters/httpClient/httpClient";

export async function deleteSkill(id: string) {
  await httpClient.delete(`/api/v1/skills/${id}`);
}
