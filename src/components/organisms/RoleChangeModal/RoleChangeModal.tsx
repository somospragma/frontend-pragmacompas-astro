import { useState, useMemo, useCallback, useEffect } from "react";
import type { User } from "@/infrastructure/models/TutoringRequest";
import { UserRole } from "@/shared/utils/enums/role";

/**
 * RoleChangeModal component allows administrators to change a user's role.
 * Displays user information and provides radio buttons to select a new role.
 *
 * @component
 * @example
 * ```tsx
 * <RoleChangeModal
 *   isOpen={true}
 *   onClose={() => setIsOpen(false)}
 *   user={selectedUser}
 *   onRoleChange={async (userId, newRole) => {
 *     await updateUserRole(userId, newRole);
 *     refetchUsers();
 *   }}
 * />
 * ```
 */

interface Props {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly user: User | null;
  readonly onRoleChange: (userId: string, newRole: UserRole) => Promise<void>;
}

const roleDescriptions = {
  Tutorado: "Usuario que recibe mentoría y puede solicitar sesiones de tutoría",
  Tutor: "Usuario que puede brindar mentoría y aceptar solicitudes de tutoría",
  Administrador: "Usuario con permisos administrativos completos del sistema",
};

const roleColors = {
  Tutorado: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Tutor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Administrador: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

export default function RoleChangeModal({ isOpen, onClose, user, onRoleChange }: Props) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(user?.rol || UserRole.TUTEE);
  const [isLoading, setIsLoading] = useState(false);

  // Reset selected role when user changes
  useEffect(() => {
    if (user?.rol) {
      setSelectedRole(user.rol);
    }
  }, [user?.id, user?.rol]);

  const userInitial = useMemo(() => {
    return (user?.firstName?.charAt(0) || user?.lastName?.charAt(0) || "?").toUpperCase();
  }, [user?.firstName, user?.lastName]);

  const userName = useMemo(() => {
    if (!user) return "Sin nombre";
    return user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.firstName || user.lastName || "Sin nombre";
  }, [user]);

  const roleOptions = useMemo(() => Object.keys(roleDescriptions) as UserRole[], []);

  const isRoleChanged = useMemo(() => selectedRole !== user?.rol, [selectedRole, user?.rol]);

  const handleRoleSelection = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRole(event.target.value as UserRole);
  }, []);

  const handleRoleChange = useCallback(async () => {
    if (!user?.id || !isRoleChanged) {
      onClose();
      return;
    }

    setIsLoading(true);
    try {
      await onRoleChange(user.id, selectedRole);
      onClose();
    } catch (error) {
      console.error("Error changing role:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, isRoleChanged, selectedRole, onRoleChange, onClose]);

  if (!isOpen || !user) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="role-change-title"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <header className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 id="role-change-title" className="text-lg font-semibold text-gray-900 dark:text-white">
            Cambiar Rol de Usuario
          </h3>
        </header>

        <div className="p-6">
          <section className="mb-6" aria-label="Información del usuario">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 h-12 w-12">
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center" aria-hidden="true">
                  <span className="text-lg font-medium text-white">{userInitial}</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{userName}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
              </div>
            </div>

            <div className="mb-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Rol actual: </span>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleColors[user.rol || "Tutorado"]}`}
                role="status"
                aria-label={`Rol actual: ${user.rol || "Tutorado"}`}
              >
                {user.rol || "Tutorado"}
              </span>
            </div>
          </section>

          <section aria-labelledby="role-selection-label">
            <label id="role-selection-label" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Seleccionar nuevo rol:
            </label>

            <fieldset className="space-y-3 mt-4" aria-label="Opciones de rol">
              {roleOptions.map((role) => (
                <label key={role} className="flex items-start cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={selectedRole === role}
                    onChange={handleRoleSelection}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                    aria-describedby={`role-desc-${role}`}
                  />
                  <div className="ml-3">
                    <div className="flex items-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleColors[role]} mr-2`}
                        aria-hidden="true"
                      >
                        {role}
                      </span>
                    </div>
                    <p id={`role-desc-${role}`} className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {roleDescriptions[role]}
                    </p>
                  </div>
                </label>
              ))}
            </fieldset>
          </section>
        </div>

        <footer className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 
                     hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 
                     focus:ring-gray-500 disabled:opacity-50"
            aria-label="Cancelar cambio de rol"
          >
            Cancelar
          </button>
          <button
            onClick={handleRoleChange}
            disabled={isLoading || !isRoleChanged}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
                     rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50
                     disabled:cursor-not-allowed"
            aria-label={isLoading ? "Cambiando rol" : "Confirmar cambio de rol"}
            aria-busy={isLoading}
          >
            {isLoading ? "Cambiando..." : "Cambiar Rol"}
          </button>
        </footer>
      </div>
    </div>
  );
}
