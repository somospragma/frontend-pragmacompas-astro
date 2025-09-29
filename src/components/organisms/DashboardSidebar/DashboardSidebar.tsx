import {
  BarChart,
  Book,
  ChevronLeft,
  ChevronRight,
  Menu,
  MessageSquare,
  Settings,
  Users,
  UsersRound,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface Props {
  currentPath?: string;
}

const DashboardSidebar: React.FC<Props> = ({ currentPath = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { icon: BarChart, label: "Dashboard", href: "/dashboard", badge: null },
    { icon: Users, label: "Tutores", href: "/dashboard/tutor", badge: null },
    { icon: UsersRound, label: "Tutorados", href: "/dashboard/tutorado", badge: null },
    { icon: MessageSquare, label: "Request", href: "/dashboard/requests", badge: null },
    { icon: Book, label: "Tutorias", href: "/dashboard/tutoring", badge: null },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return currentPath === "/dashboard" || currentPath === "/dashboard/";
    }

    // For exact path matching to avoid conflicts between similar routes
    return currentPath === href || currentPath.startsWith(href + "/");
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className={`md:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-white dark:bg-gray-800 shadow-lg transition-colors duration-300 ${
          isOpen ? "hidden" : "block"
        }`}
      >
        <Menu size={24} className="text-gray-900 dark:text-white" />
      </button>

      {/* Sidebar overlay for mobile */}
      {isMobile && isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={toggleSidebar} />}

      {/* Sidebar */}
      <aside
        className={`${isOpen ? "translate-x-0" : "-translate-x-full"} ${isCollapsed ? "h-64" : "w-64"}
          fixed
          md:relative
          md:translate-x-0
          z-20
          bg-white
          dark:bg-slate-900
          border-r
          border-gray-200
          dark:border-slate-800
          shadow-lg
          transform
          transition-all
          duration-300
          ease-in-out
          h-full
          flex
          flex-col
        `}
      >
        {/* Header with toggle button */}
        <div className="flex items-center justify-between h-20 px-4 border-b border-gray-200 dark:border-slate-800">
          {!isCollapsed && (
            <div className="flex items-center">
              <div className="size-6 text-primary">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="
                      M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134
                      C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462
                      C2.19985 28.361 1.76794 23.9758 2.60947 19.7452
                      C3.451 15.5145 5.52816 11.6284 8.57829 8.5783
                      C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948
                      C23.9758 1.76795 28.361 2.19986 32.3462 3.85057
                      C36.3314 5.50129 39.7376 8.29668 42.134 11.8833
                      C44.5305 15.4698 45.8096 19.6865 45.8096 24
                      L24 24L24 45.8096Z
                    "
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">Tutorías</span>
            </div>
          )}

          {/* Desktop collapse toggle */}
          <button
            onClick={toggleCollapse}
            className="
              hidden md:block p-2 text-gray-500 dark:text-slate-400
              hover:text-gray-700 dark:hover:text-white
              hover:bg-gray-100 dark:hover:bg-slate-800
              rounded-lg transition-colors duration-200
            "
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>

          {/* Mobile close button */}
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={`
                flex items-center w-full px-3 py-2 rounded-lg transition-all duration-200
                ${isCollapsed ? "justify-center" : "justify-start"}
                ${
                  isActive(item.href)
                    ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                    : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800"
                }
              `}
            >
              <item.icon className={`w-5 h-5 ${!isCollapsed ? "mr-3" : ""}`} />
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`
                      ml-auto px-2 py-1 text-xs rounded-full
                      ${item.badge === "New" ? "bg-green-500 text-white" : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300"}
                    `}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </a>
          ))}
        </nav>

        {/* Settings */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-800">
          <a
            href="/dashboard/profile"
            className={`
              flex items-center w-full px-3 py-2 rounded-lg transition-colors duration-200
              ${isCollapsed ? "justify-center" : "justify-start"}
              ${
                isActive("/dashboard/profile")
                  ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                  : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800"
              }
            `}
          >
            <Settings className={`w-5 h-5 ${!isCollapsed ? "mr-3" : ""}`} />
            {!isCollapsed && "Configuración"}
          </a>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
