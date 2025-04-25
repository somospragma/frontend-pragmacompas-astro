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

  if (session && context.url.pathname === ROUTE_PATHS.LOGIN.getHref()) {
    return context.redirect(ROUTE_PATHS.HOME.getHref());
  }

  console.log(session, PROTECTED_ROUTES, context.url.pathname);

  if (
    !session &&
    PROTECTED_ROUTES.some(
      (path) =>
        context.url.pathname === path || (!["", "/", "*"].includes(path) && context.url.pathname.startsWith(path))
    )
  ) {
    return context.redirect(ROUTE_PATHS.LOGIN.getHref());
  }

  return next();
}

export const onRequest: MiddlewareHandler = sequence(logAccess, authMiddleware);
