// @vitest-exclude
import { sequence } from "astro:middleware";
import type { APIContext, MiddlewareNext, MiddlewareHandler } from "astro";
import { getSession } from "auth-astro/server";
import { PROTECTED_ROUTES, ROUTE_PATHS, ROLE_ROUTES } from "./shared/utils/enums/paths";
import { validateUser } from "./infrastructure/services/validateUser";
import type { UserRole } from "./infrastructure/models/TutoringRequest";

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

export async function roleRedirectMiddleware(context: APIContext, next: MiddlewareNext): Promise<Response> {
  const session = await getSession(context.request);

  // Only apply role-based redirection if user is authenticated and on a dashboard route
  if (session && session.user?.googleId && context.url.pathname.startsWith("/dashboard")) {
    try {
      const userValidation = await validateUser(session.user.googleId);
      const userRole = userValidation.role as UserRole;

      const correctRoute = ROLE_ROUTES[userRole];

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
