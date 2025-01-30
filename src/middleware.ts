import { sequence } from "astro:middleware";
import type { APIContext, MiddlewareNext } from "astro";

async function logAccess(context: APIContext, next: MiddlewareNext) {
  console.log(`Ruta solicitada: ${context.url.pathname}`);
  const response = await next();
  return response;
}

export const onRequest = sequence(logAccess);
