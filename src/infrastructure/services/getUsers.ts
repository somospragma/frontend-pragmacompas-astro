import { httpClient } from "../adapters/httpClient/httpClient";
import type { User } from "../models/TutoringRequest";
import type { UserRole } from "../models/TutoringRequest";

export async function getUsers({ rol, chapterId }: { rol?: UserRole; chapterId?: string }) {
  const params = new URLSearchParams({
    rol: rol ?? "",
    chapterId: chapterId ?? "",
  });

  const { data } = await httpClient.get<User[]>(`/api/v1/users?${params.toString()}`);
  return data;
}
