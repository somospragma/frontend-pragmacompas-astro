// @vitest-exclude
import { sequence } from "astro:middleware";
import type { APIContext, MiddlewareNext } from "astro";
import { getSession } from "auth-astro/server";

export async function logAccess(context: APIContext, next: MiddlewareNext) {
  console.log(`Ruta solicitada: ${context.url.pathname}`);
  const response = await next();
  return response;
}

export async function authMiddleware(context: APIContext, next: MiddlewareNext) {
  const session = await getSession(context.request);

  // Si hay una sesión y el usuario intenta acceder a /login, redirigir a /protected
  if (session && context.url.pathname === "/login") {
    return context.redirect("/protected");
  }

  // Si no hay sesión y el usuario intenta acceder a una ruta protegida, redirigir a /login
  if (!session && context.url.pathname.startsWith("/protected")) {
    return context.redirect("/login");
  }

  return next();
}

export const onRequest = sequence(logAccess, authMiddleware);
