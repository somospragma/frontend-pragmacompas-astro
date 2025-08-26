import type { UserRole } from "@/infrastructure/models/TutoringRequest";
import { ROLE_ROUTES, ROUTE_PATHS } from "./enums/paths";

/**
 * Get the appropriate dashboard URL based on user role
 */
export function getRoleBasedRoute(role: UserRole): string {
  return ROLE_ROUTES[role] || ROUTE_PATHS.HOME.getHref();
}

/**
 * Redirect to role-based dashboard
 * This function can be used in client-side components
 */
export function redirectToRoleDashboard(role: UserRole): void {
  const targetRoute = getRoleBasedRoute(role);
  window.location.href = targetRoute;
}

/**
 * Check if current path matches user's role-based route
 */
export function isOnCorrectRoleRoute(currentPath: string, role: UserRole): boolean {
  const expectedRoute = getRoleBasedRoute(role);
  return currentPath === expectedRoute;
}

/**
 * Get redirect URL for Astro server-side redirects
 */
export function getServerRedirectUrl(role: UserRole): string {
  return getRoleBasedRoute(role);
}
