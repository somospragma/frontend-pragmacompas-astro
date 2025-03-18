// @vitest-exclude
import { sequence } from "astro:middleware";
import type { APIContext, MiddlewareNext, MiddlewareHandler } from "astro";
import { getSession } from "auth-astro/server";
import { PROTECTED_ROUTES, ROUTE_PATHS } from "./shared/utils/enums/paths";

export async function logAccess(context: APIContext, next: MiddlewareNext): Promise<Response> {
  console.log(`Ruta solicitada: ${context.url.pathname}`);
  return next();
}

export async function authMiddleware(context: APIContext, next: MiddlewareNext): Promise<Response> {
  const session = await getSession(context.request);

  if (session && context.url.pathname === ROUTE_PATHS.LOGIN) {
    return context.redirect(ROUTE_PATHS.HOME);
  }

  if (!session && PROTECTED_ROUTES.includes(context.url.pathname)) {
    return context.redirect(ROUTE_PATHS.LOGIN);
  }

  return next();
}

export const onRequest: MiddlewareHandler = sequence(logAccess, authMiddleware);
