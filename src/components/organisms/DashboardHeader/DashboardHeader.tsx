import { ModeToggle } from "@/components/molecules/ModalToggle/ModeToggle";
import { UserMenu } from "@/components/molecules/UserMenu";
import type { User } from "@auth/core/types";
import { Bell } from "lucide-react";

const DashboardHeader = ({ user }: { user?: User }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Dashboard</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <ModeToggle />

          {/* Notifications */}
          <button
            className={`
              relative p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 
              dark:hover:text-white transition-colors duration-200 rounded-lg 
              hover:bg-gray-100 dark:hover:bg-gray-700
            `}
          >
            <Bell size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User menu */}
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
