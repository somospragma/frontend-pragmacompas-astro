import { useErrorStore } from "@/store/errorStore";
import { getSecret } from "astro:env/server";
import axios from "axios";

// Crear la instancia de Axios
export const httpClient = axios.create({
  baseURL: getSecret("API_URL"),
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

// ✅ Interceptor para agregar el token de autenticación a cada request
httpClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    const { setError } = useErrorStore.getState(); // Obtener el setter de Zustand
    setError(error.message); // Actualizar el estado de Zustand
    return Promise.reject(error);
  }
);

// ✅ Interceptor para manejar errores globales en las respuestas
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { setError } = useErrorStore.getState(); // Obtener el setter de Zustand

    if (error.response) {
      const message = error.response.data?.message || `Error ${error.response.status}: ${error.response.statusText}`;

      setError(message); // Guardar el error en la store global

      if (error.response.status === 401) {
        window.location.href = "/login"; // Opcional: redirigir si hay error 401
      }
    } else {
      setError("Error de conexión con el servidor.");
    }
    // setError("Error de conexión con el servidor.");

    return Promise.reject(error);
  }
);
