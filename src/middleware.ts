// @vitest-exclude
import type { APIContext, MiddlewareHandler, MiddlewareNext } from "astro";
import { sequence } from "astro:middleware";
import { getSession } from "auth-astro/server";
import { PROTECTED_ROUTES, ROLE_ROUTES, ROUTE_PATHS, ROLE_RESTRICTED_ROUTES } from "./shared/utils/enums/paths";
import type { SessionUser } from "auth.config";
import { UserRole as Role, UserRole } from "./shared/utils/enums/role";

export async function logAccess(context: APIContext, next: MiddlewareNext): Promise<Response> {
  console.log(`Ruta solicitada: ${context.url.pathname}`);
  return next();
}

export async function authMiddleware(context: APIContext, next: MiddlewareNext): Promise<Response> {
  const session = (await getSession(context.request)) as SessionUser;

  if (session && context.url.pathname === ROUTE_PATHS.LOGIN.getHref()) {
    if (session.user?.rol === Role.ADMINISTRADOR) {
      return context.redirect(ROUTE_PATHS.DASHBOARD.getHref());
    }
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

export async function roleAccessMiddleware(context: APIContext, next: MiddlewareNext): Promise<Response> {
  const session = (await getSession(context.request)) as SessionUser;

  if (session && session.user?.googleId) {
    const currentPath = context.url.pathname;
    const userRole = session.user?.rol as UserRole;

    for (const [restrictedPath, allowedRoles] of Object.entries(ROLE_RESTRICTED_ROUTES)) {
      if (currentPath === restrictedPath || currentPath.startsWith(restrictedPath)) {
        if (!allowedRoles.includes(userRole as string)) {
          const redirectRoute = ROLE_ROUTES[userRole] || ROUTE_PATHS.HOME.getHref();
          return context.redirect(redirectRoute);
        }
      }
    }
  }

  return next();
}

export const onRequest: MiddlewareHandler = sequence(
  logAccess,
  authMiddleware,
  roleRedirectMiddleware,
  roleAccessMiddleware
);
