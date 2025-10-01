import type { APIRoute } from "astro";
import { getSecret } from "astro:env/server";

export const ALL: APIRoute = async ({ request, params }) => {
  try {
    const backendUrl = getSecret("API_URL");
    const path = params.path || "";

    // Construir la URL completa del backend
    const url = new URL(request.url);
    const targetUrl = `${backendUrl}/${path}${url.search}`;

    console.log(`[Proxy] ${request.method} ${targetUrl}`);

    // Copiar headers relevantes (excluir algunos específicos del host)
    const headers = new Headers(request.headers);
    headers.delete("host");
    headers.delete("connection");

    // Hacer la request al backend
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: request.method !== "GET" && request.method !== "HEAD" ? await request.arrayBuffer() : undefined,
    });

    // Copiar headers de la respuesta
    const responseHeaders = new Headers(response.headers);

    // Permitir CORS si es necesario
    responseHeaders.set("Access-Control-Allow-Origin", "*");
    responseHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    responseHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("[Proxy] Error:", error);
    return new Response(
      JSON.stringify({
        message: "Error en el proxy",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
