import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/shared/hooks/useLogout";
import { cn } from "@/shared/utils/style";
import type { User } from "@auth/core/types";
import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import { useState } from "react";

interface UserMenuProps {
  user?: User;
}

export const UserMenu = ({ user }: UserMenuProps) => {
  const { logout } = useLogout();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProfile = () => {
    window.location.href = "/profile";
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors duration-200">
          {user?.image ? (
            <img src={user.image} alt="Usuario" className="h-8 w-8 rounded-full" />
          ) : (
            <div
              className={cn(
                "h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600",
                "flex items-center justify-center text-xs font-medium",
                "text-gray-700 dark:text-gray-300"
              )}
            >
              {getInitials(user?.name)}
            </div>
          )}
          <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name}</span>
          <ChevronDown size={16} className="text-gray-400 dark:text-gray-500" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleViewProfile}>
          <UserIcon size={16} className="mr-2" />
          Ver perfil
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <LogOut size={16} className="mr-2" />
            {isLoading ? "Cerrando sesión..." : "Cerrar sesión"}
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
