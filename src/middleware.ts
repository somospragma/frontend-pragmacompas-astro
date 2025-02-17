// @vitest-exclude
import { sequence } from "astro:middleware";
import type { APIContext, MiddlewareNext } from "astro";
import { getSession } from "auth-astro/server";
import { PROTECTED_ROUTES, ROUTE_PATHS } from "./utils/enums/paths";

export async function logAccess(context: APIContext, next: MiddlewareNext) {
  console.log(`Ruta solicitada: ${context.url.pathname}`);
  const response = await next();
  return response;
}

export async function authMiddleware(context: APIContext, next: MiddlewareNext) {
  const session = await getSession(context.request);

  // if session and not protected route, redirect to profile
  if (session && context.url.pathname === ROUTE_PATHS.LOGIN) {
    return context.redirect(ROUTE_PATHS.PROFILE);
  }

  // if no session and protected route, redirect to login
  if (!session && PROTECTED_ROUTES.includes(context.url.pathname)) {
    return context.redirect(ROUTE_PATHS.LOGIN);
  }

  return next();
}

export const onRequest = sequence(logAccess, authMiddleware);
