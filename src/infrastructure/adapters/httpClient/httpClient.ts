// @vitest-exclude
import { useErrorStore } from "@/store/errorStore";
import axios from "axios";

// Usar proxy en cliente para evitar mixed-content
// En servidor, usar la URL directa del backend
const baseURL =
  typeof window === "undefined"
    ? import.meta.env.PUBLIC_API_URL // Server-side: puede usar HTTP
    : "/api/proxy"; // Client-side: usa el proxy HTTPS

export const httpClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
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
  async (config) => {
    if (!config.headers?.Authorization && typeof window !== "undefined") {
      try {
        const sessionResponse = await fetch("/api/auth/session");
        if (sessionResponse.ok) {
          const session = await sessionResponse.json();

          if (session?.user?.googleId) {
            config.headers = config.headers || {};
            config.headers.Authorization = session.user.googleId;
          }
        }
      } catch (error) {
        console.warn("No se pudo obtener la sesión:", error);
      }
    }
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
        // window.location.href = ROUTE_PATHS.LOGIN.getHref();
      }
    } else {
      setError("Error de conexión con el servidor.");
    }

    return Promise.reject(error);
  }
);
