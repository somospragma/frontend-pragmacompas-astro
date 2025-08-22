import { useEffect, useState } from "react";
import { validateUser } from "@/infrastructure/services/validateUser";
import { getRoleBasedRoute } from "@/shared/utils/roleRedirect";
import type { UserRole } from "@/infrastructure/models/TutoringRequest";

interface RoleRedirectProps {
  googleUserId: string;
  children?: React.ReactNode;
}

/**
 * Component that handles role-based redirection after authentication
 * This component should be used in pages that need to redirect users based on their role
 */
export function RoleRedirect({ googleUserId, children }: RoleRedirectProps) {
  const [isRedirecting, setIsRedirecting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkUserRoleAndRedirect() {
      try {
        // Get user validation data which includes role
        const userValidation = await validateUser(googleUserId);

        // Get the appropriate route for this user's role
        const targetRoute = getRoleBasedRoute(userValidation.role as UserRole);

        // Check if we're already on the correct route
        const currentPath = window.location.pathname;
        if (currentPath !== targetRoute) {
          // console.log(`Redirecting ${userValidation.role} to ${targetRoute}`);
          window.location.href = targetRoute;
          return;
        }

        // If we're already on the correct route, stop redirecting
        setIsRedirecting(false);
      } catch (error) {
        console.error("Error during role-based redirect:", error);
        setError("Error al verificar el rol del usuario");
        setIsRedirecting(false);
      }
    }

    if (googleUserId) {
      checkUserRoleAndRedirect();
    } else {
      setIsRedirecting(false);
    }
  }, [googleUserId]);

  if (isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirigiendo al dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
