// @vitest-exclude
import { useErrorStore } from "@/store/errorStore";
import { ROUTE_PATHS } from "@/shared/utils/enums/paths";
import { getSecret } from "astro:env/server";
import axios from "axios";

export const httpClient = axios.create({
  baseURL: getSecret("API_URL"),
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

export enum HTTP_METHODS {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export enum HTTP_STATUS_CODES {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

// ✅ Interceptor for error handling
httpClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    const { setError } = useErrorStore.getState();
    setError(error.message);
    return Promise.reject(error);
  }
);

// ✅ Interceptor for handler response
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { setError } = useErrorStore.getState();

    if (error.response) {
      const message = error.response.data?.message || `Error ${error.response.status}: ${error.response.statusText}`;

      setError(message);

      if (error.response.status === HTTP_STATUS_CODES.UNAUTHORIZED) {
        window.location.href = ROUTE_PATHS.LOGIN;
      }
    } else {
      setError("Error de conexión con el servidor.");
    }

    return Promise.reject(error);
  }
);
