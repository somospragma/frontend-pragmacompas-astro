import { httpClient } from "../adapters/httpClient/httpClient";
import type { User } from "../models/TutoringRequest";

export async function getUserById(id: string) {
  const { data } = await httpClient.get<User>(`/api/v1/users/${id}`);
  return data;
}
