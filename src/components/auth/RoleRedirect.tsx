import { useEffect, useState } from "react";
import { getRoleBasedRoute } from "@/shared/utils/roleRedirect";
import type { UserRole } from "@/shared/utils/enums/role";

interface RoleRedirectProps {
  userRole: UserRole;
  children?: React.ReactNode;
}

/**
 * Component that handles role-based redirection after authentication
 * This component should be used in pages that need to redirect users based on their role
 */
export function RoleRedirect({ userRole, children }: RoleRedirectProps) {
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    // Get the appropriate route for this user's role
    const targetRoute = getRoleBasedRoute(userRole);

    // Check if we're already on the correct route
    const currentPath = window.location.pathname;
    if (currentPath !== targetRoute) {
      window.location.href = targetRoute;
      return;
    }

    // If we're already on the correct route, stop redirecting
    setIsRedirecting(false);
  }, [userRole]);

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

  return <>{children}</>;
}
