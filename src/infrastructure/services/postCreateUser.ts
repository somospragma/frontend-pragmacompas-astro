import { httpClient } from "../adapters/httpClient/httpClient";
import type { User } from "../models/TutoringRequest";

export const postCreateUser = async (user: User) => {
  try {
    const response = await httpClient.post<User>(`/api/v1/users`, user);
    return response.data;
  } catch (error: unknown) {
    console.error("Error creating user:", error);
    throw new Error("CREATE_USER_ERROR");
  }
};
