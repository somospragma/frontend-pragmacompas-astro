import type { User } from "@auth/core/types";
import { httpClient } from "../adapters/httpClient/httpClient";

export interface UpdateUserRoleBody {
  id: string;
  role: "Tutor" | "Tutorado" | "Administrador";
}

export async function updateUserRole(body: UpdateUserRoleBody) {
  const { data } = await httpClient.patch<User>("/api/v1/users/role", body);
  return data;
}
