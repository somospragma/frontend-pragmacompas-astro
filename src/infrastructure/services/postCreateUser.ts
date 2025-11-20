import { httpClient } from "../adapters/httpClient/httpClient";
import type { User } from "../models/TutoringRequest";

export const postCreateUser = async (data: Partial<User>) => {
  try {
    const response = await httpClient.post<User>(`/api/v1/users`, {
      ...data,
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Error creating user:", error);
    throw new Error("CREATE_USER_ERROR");
  }
};
