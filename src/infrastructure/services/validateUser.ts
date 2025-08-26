import { httpClient } from "@/infrastructure/adapters/httpClient/httpClient";

export interface UserValidationResponse {
  message: string;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    chapter: {
      id: string;
      name: string;
    };
    rol: string;
    seniority: string;
    activeTutoringLimit: number;
  };
  timestamp: string;
}

export async function validateUser(userId: string): Promise<UserValidationResponse | boolean> {
  try {
    const response = await httpClient.get<UserValidationResponse>(`/api/v1/users/me`, {
      headers: {
        Authorization: `${userId}`,
      },
    });
    console.log(response.data);

    // Check if the backend indicates user is not registered in the response message
    if (response.data && typeof response.data === "object" && "message" in response.data) {
      const responseWithMessage = response.data as { message?: string };
      if (responseWithMessage.message === "Usuario no registrado en el sistema") {
        return false;
      }
    }

    return response.data;
  } catch (error: unknown) {
    // console.log(error);
    // Handle the case where we already threw USER_NOT_REGISTERED above
    if (error instanceof Error && error.message === "USER_NOT_REGISTERED") {
      throw error;
    }
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 404) {
        console.log("Usuario no registrado");
        return false; // User not found
      }
    }
    console.error("Error validating user:", error);
    return false; // Return false for any validation errors
  }
}
