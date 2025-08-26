// @vitest-exclude
import type { APIContext, MiddlewareHandler, MiddlewareNext } from "astro";
import { sequence } from "astro:middleware";
import { getSession } from "auth-astro/server";
import type { UserRole } from "./infrastructure/models/TutoringRequest";
import { PROTECTED_ROUTES, ROLE_ROUTES, ROUTE_PATHS } from "./shared/utils/enums/paths";
import type { SessionUser } from "auth.config";

export async function logAccess(context: APIContext, next: MiddlewareNext): Promise<Response> {
  console.log(`Ruta solicitada: ${context.url.pathname}`);
  return next();
}

export async function authMiddleware(context: APIContext, next: MiddlewareNext): Promise<Response> {
  const session = (await getSession(context.request)) as SessionUser;

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

export async function roleRedirectMiddleware(context: APIContext, next: MiddlewareNext): Promise<Response> {
  const session = (await getSession(context.request)) as SessionUser;

  // Only apply role-based redirection if user is authenticated and on a dashboard route
  if (session && session.user?.googleId && context.url.pathname.startsWith("/dashboard")) {
    try {
      const userRole = session.user?.rol as UserRole;

      const correctRoute = ROLE_ROUTES[userRole];

      // Allow navigation within dashboard subroutes for Administrador role
      if (correctRoute && userRole === "Administrador" && context.url.pathname.startsWith("/dashboard")) {
        return next(); // Allow all dashboard subroutes for admins
      }

      if (correctRoute && context.url.pathname !== correctRoute) {
        return context.redirect(correctRoute);
      }
    } catch (error) {
      console.error("Error in role-based redirection:", error);
    }
  }

  return next();
}

export const onRequest: MiddlewareHandler = sequence(logAccess, authMiddleware, roleRedirectMiddleware);
