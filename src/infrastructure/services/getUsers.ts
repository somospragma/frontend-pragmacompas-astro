import { httpClient } from "../adapters/httpClient/httpClient";
import type { User } from "../models/TutoringRequest";
import { UserRole } from "@/shared/utils/enums/role";

export async function getUsers({ rol, chapterId }: { rol?: UserRole; chapterId?: string }) {
  const params = new URLSearchParams();

  if (rol) {
    params.append("rol", rol);
  }

  // Solo agregar chapterId si el rol NO es "Administrador"
  if (chapterId && rol !== "Administrador") {
    params.append("chapterId", chapterId);
  }

  const { data } = await httpClient.get<User[]>(`/api/v1/users?${params.toString()}`);
  return data;
}
