import { BarChart, Book, ChevronLeft, ChevronRight, Menu, Settings, Users, UsersRound, X } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/**
 * DashboardSidebar component provides navigation for the dashboard
 * with responsive mobile menu, collapse functionality, and active route highlighting
 *
 * @component
 * @example
 * ```tsx
 * <DashboardSidebar currentPath="/dashboard/tutorias" />
 * ```
 */

interface Props {
  readonly currentPath?: string;
}

const DashboardSidebar: React.FC<Props> = ({ currentPath = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  /**
   * Memoized menu items configuration
   */
  const menuItems = useMemo(
    () => [
      { icon: BarChart, label: "Dashboard", href: "/dashboard", badge: null },
      { icon: Book, label: "Tutorias", href: "/dashboard/tutorias", badge: null },
      { icon: UsersRound, label: "Tutorados", href: "/dashboard/tutorado", badge: null },
      { icon: Users, label: "Tutores", href: "/dashboard/tutor", badge: null },
      { icon: Users, label: "Administradores", href: "/dashboard/administradores", badge: null },
    ],
    []
  );

  /**
   * Checks if a given href matches the current path
   */
  const isActive = useCallback(
    (href: string) => {
      if (href === "/dashboard") {
        return currentPath === "/dashboard" || currentPath === "/dashboard/";
      }

      // For exact path matching to avoid conflicts between similar routes
      return currentPath === href || currentPath.startsWith(href + "/");
    },
    [currentPath]
  );

  /**
   * Toggles sidebar open/close state
   */
  const toggleSidebar = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  /**
   * Toggles sidebar collapsed/expanded state
   */
  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

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

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className={`md:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-white dark:bg-gray-800 shadow-lg transition-colors duration-300 ${
          isOpen ? "hidden" : "block"
        }`}
        aria-label="Abrir menú de navegación"
        aria-expanded={isOpen}
      >
        <Menu size={24} className="text-gray-900 dark:text-white" aria-hidden="true" />
      </button>

      {/* Sidebar overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
          role="button"
          tabIndex={0}
          aria-label="Cerrar menú"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              toggleSidebar();
            }
          }}
        />
      )}

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
        aria-label="Barra lateral de navegación del dashboard"
      >
        {/* Header with toggle button */}
        <div className="flex items-center justify-between h-20 px-4 border-b border-gray-200 dark:border-slate-800">
          {!isCollapsed && (
            <div className="flex items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <a href="/">
                      <img
                        src="/pragma-compas-black.svg"
                        alt="Logo Pragma"
                        width="200"
                        height="40"
                        className="h-[40px] w-[200px] block dark:hidden"
                      />
                      <img
                        src="/pragma-compas-white.svg"
                        alt="Logo Pragma"
                        width="200"
                        height="40"
                        className="h-[40px] w-[200px] hidden dark:block"
                      />
                    </a>
                  </div>
                </div>
              </div>
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
            aria-label={isCollapsed ? "Expandir barra lateral" : "Colapsar barra lateral"}
            aria-expanded={!isCollapsed}
          >
            {isCollapsed ? <ChevronRight size={20} aria-hidden="true" /> : <ChevronLeft size={20} aria-hidden="true" />}
          </button>

          {/* Mobile close button */}
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white"
              aria-label="Cerrar menú"
            >
              <X size={24} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2" aria-label="Navegación principal del dashboard">
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
              aria-label={item.label}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              <item.icon className={`w-5 h-5 ${!isCollapsed ? "mr-3" : ""}`} aria-hidden="true" />
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`
                      ml-auto px-2 py-1 text-xs rounded-full
                      ${item.badge === "New" ? "bg-green-500 text-white" : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300"}
                    `}
                      role="status"
                      aria-label={`${item.label} - ${item.badge}`}
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
            aria-label="Configuración"
            aria-current={isActive("/dashboard/profile") ? "page" : undefined}
          >
            <Settings className={`w-5 h-5 ${!isCollapsed ? "mr-3" : ""}`} aria-hidden="true" />
            {!isCollapsed && "Configuración"}
          </a>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
