import { httpClient } from "../adapters/httpClient/httpClient";
import type { User } from "../models/TutoringRequest";

export interface UpdateTutoringLimitBody {
  id: string;
  activeTutoringLimit: number;
}

export async function updateTutoringLimit(body: UpdateTutoringLimitBody) {
  const { data } = await httpClient.patch<User>("/api/v1/users/tutoring-limit", body);
  return data;
}
