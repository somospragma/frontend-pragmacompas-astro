import { httpClient } from "@/infrastructure/adapters/httpClient/httpClient";

export interface UserValidationResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  isRegistered: boolean;
  profileComplete: boolean;
}

export async function validateUser(userId: string): Promise<UserValidationResponse> {
  try {
    const response = await httpClient.get<UserValidationResponse>(`/api/v1/users/${userId}`);
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 404) {
        throw new Error("USER_NOT_REGISTERED");
      }
    }

    console.error("Error validating user:", error);
    throw new Error("VALIDATION_ERROR");
  }
}
