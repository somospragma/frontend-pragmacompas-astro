/**
 * Represents a structured API error response
 */
export interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: string;
    };
  };
  message: string;
  name: string;
}

/**
 * Type guard to check if an error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" && error !== null && "message" in error && typeof (error as ApiError).message === "string"
  );
}

/**
 * Extracts a user-friendly error message from an unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.response?.data?.message || error.message || "Ha ocurrido un error inesperado";
  }
  return "Ha ocurrido un error inesperado";
}
