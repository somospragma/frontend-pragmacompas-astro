import { httpClient } from "../adapters/httpClient/httpClient";
import type { User } from "../models/TutoringRequest";

export interface UpdateUserBody {
  id: string;
  firstName?: string;
  lastName?: string;
  chapterId?: string;
  seniority?: string;
}

export async function updateUser(body: UpdateUserBody) {
  const { data } = await httpClient.put<User>("/api/v1/users", body);
  return data;
}
