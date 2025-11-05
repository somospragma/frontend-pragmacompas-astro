import { ModeToggle } from "@/components/molecules/ModalToggle/ModeToggle";
import { UserMenu } from "@/components/molecules/UserMenu";
import type { User } from "@auth/core/types";

/**
 * DashboardHeader component displays the header section of the dashboard
 * with theme toggle and user menu
 *
 * @component
 * @example
 * ```tsx
 * <DashboardHeader user={user} />
 * ```
 */

interface DashboardHeaderProps {
  readonly user?: User;
}

const DashboardHeader = ({ user }: DashboardHeaderProps) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Dashboard</h1>
        </div>

        <nav className="flex items-center space-x-4" aria-label="Herramientas del dashboard">
          <ModeToggle />

          <UserMenu user={user} />
        </nav>
      </div>
    </header>
  );
};

export default DashboardHeader;
