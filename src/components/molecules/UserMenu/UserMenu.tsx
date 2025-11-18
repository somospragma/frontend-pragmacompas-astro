import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/shared/hooks/useLogout";
import type { User } from "@auth/core/types";
import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import { useState, useCallback } from "react";

interface UserMenuProps {
  user?: User;
}

/**
 * Sanitizes user display name to prevent XSS
 */
const sanitizeDisplayName = (name: string | null | undefined): string => {
  if (!name || typeof name !== "string") return "";

  // Remove HTML tags and limit length
  const sanitized = name
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/[<>]/g, "") // Remove remaining angle brackets
    .trim()
    .slice(0, 50); // Limit to 50 characters

  return sanitized;
};

/**
 * Validates and sanitizes email for avatar src
 */
const sanitizeEmail = (email: string | null | undefined): string | undefined => {
  if (!email || typeof email !== "string") return undefined;

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmedEmail = email.trim();

  if (emailRegex.test(trimmedEmail) && trimmedEmail.length <= 100) {
    return trimmedEmail;
  }

  return undefined;
};

/**
 * Validates navigation paths to prevent open redirects
 */
const isValidInternalPath = (path: string): boolean => {
  // Only allow relative paths starting with /
  // Prevent external URLs and path traversal
  return (
    path.startsWith("/") &&
    !path.startsWith("//") && // Prevent protocol-relative URLs
    !path.includes("..") && // Prevent path traversal
    !/^\/\/|^https?:\/\/|^ftp:\/\/|^javascript:/i.test(path) // Prevent external protocols
  );
};

export const UserMenu = ({ user }: UserMenuProps) => {
  const { logout } = useLogout();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error("Error during logout:", error);
      // Still set loading to false even if logout fails
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  const handleViewProfile = useCallback(() => {
    const profilePath = "/profile";

    if (isValidInternalPath(profilePath)) {
      window.location.href = profilePath;
    } else {
      console.error("Invalid navigation path detected");
    }
  }, []);

  const getInitials = useCallback((name: string | null | undefined): string => {
    const sanitizedName = sanitizeDisplayName(name);
    if (!sanitizedName) return "U";

    return sanitizedName
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, []);

  const sanitizedName = sanitizeDisplayName(user?.name);
  const sanitizedEmail = sanitizeEmail(user?.email);
  const userInitials = getInitials(user?.name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 
                     dark:hover:bg-gray-700 rounded-lg p-2 transition-colors duration-200 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          aria-label={`User menu for ${sanitizedName || "User"}`}
          aria-haspopup="menu"
          aria-expanded="false"
        >
          <Avatar
            src={sanitizedEmail}
            alt={`Avatar for ${sanitizedName || "User"}`}
            fallback={userInitials}
            size="md"
            className="ring-2 ring-border"
          />

          {sanitizedName && (
            <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
              {sanitizedName}
            </span>
          )}
          <ChevronDown size={16} className="text-gray-400 dark:text-gray-500" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48" role="menu">
        <DropdownMenuItem onClick={handleViewProfile} role="menuitem">
          <UserIcon size={16} className="mr-2" aria-hidden="true" />
          Ver perfil
        </DropdownMenuItem>
        <DropdownMenuItem asChild role="menuitem">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoading}
            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 
                       hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 
                       focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
            aria-label={isLoading ? "Logging out..." : "Log out"}
          >
            <LogOut size={16} className="mr-2" aria-hidden="true" />
            {isLoading ? "Cerrando sesión..." : "Cerrar sesión"}
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
