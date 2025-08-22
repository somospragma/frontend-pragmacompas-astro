import { useEffect, useState } from "react";
import { validateUser } from "@/infrastructure/services/validateUser";
import { getRoleBasedRoute, isOnCorrectRoleRoute } from "@/shared/utils/roleRedirect";
import type { UserRole } from "@/infrastructure/models/TutoringRequest";

interface UseRoleRedirectResult {
  isLoading: boolean;
  error: string | null;
  userRole: UserRole | null;
  shouldRedirect: boolean;
}

/**
 * Hook to handle role-based redirection logic
 * @param googleUserId - The Google User ID from the session
 * @param autoRedirect - Whether to automatically redirect (default: true)
 */
export function useRoleRedirect(googleUserId: string | null, autoRedirect: boolean = true): UseRoleRedirectResult {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    async function checkUserRole() {
      if (!googleUserId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Get user validation data which includes role
        const userValidation = await validateUser(googleUserId);
        const role = userValidation.rol as UserRole;
        setUserRole(role);

        // Check if user is on the correct route for their role
        const currentPath = window.location.pathname;
        const isOnCorrectRoute = isOnCorrectRoleRoute(currentPath, role);

        if (!isOnCorrectRoute) {
          setShouldRedirect(true);

          if (autoRedirect) {
            const targetRoute = getRoleBasedRoute(role);
            // console.log(`Redirecting ${role} from ${currentPath} to ${targetRoute}`);
            window.location.href = targetRoute;
            return;
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error checking user role:", error);
        setError("Error al verificar el rol del usuario");
        setIsLoading(false);
      }
    }

    checkUserRole();
  }, [googleUserId, autoRedirect]);

  return {
    isLoading,
    error,
    userRole,
    shouldRedirect,
  };
}

/**
 * Hook to manually trigger role-based redirection
 */
export function useManualRoleRedirect() {
  return {
    redirectToRoleDashboard: (role: UserRole) => {
      const targetRoute = getRoleBasedRoute(role);
      window.location.href = targetRoute;
    },
  };
}
