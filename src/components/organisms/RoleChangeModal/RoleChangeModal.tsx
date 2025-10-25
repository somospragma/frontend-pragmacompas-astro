import { useState } from "react";
import type { User } from "@/infrastructure/models/TutoringRequest";
import { UserRole } from "@/shared/utils/enums/role";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onRoleChange: (userId: string, newRole: UserRole) => Promise<void>;
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

  if (!isOpen || !user) return null;

  const handleRoleChange = async () => {
    if (!user.id || selectedRole === user.rol) {
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
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cambiar Rol de Usuario</h3>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 h-12 w-12">
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-lg font-medium text-white">
                    {(user.firstName?.charAt(0) || user.lastName?.charAt(0) || "?").toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.firstName || user.lastName || "Sin nombre"}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
              </div>
            </div>

            <div className="mb-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Rol actual: </span>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleColors[user.rol || "Tutorado"]}`}
              >
                {user.rol || "Tutorado"}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Seleccionar nuevo rol:</label>

            <div className="space-y-3">
              {(Object.keys(roleDescriptions) as UserRole[]).map((role) => (
                <label key={role} className="flex items-start cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={selectedRole === role}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                  />
                  <div className="ml-3">
                    <div className="flex items-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleColors[role]} mr-2`}
                      >
                        {role}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{roleDescriptions[role]}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 
                     hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 
                     focus:ring-gray-500 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleRoleChange}
            disabled={isLoading || selectedRole === user.rol}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
                     rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50
                     disabled:cursor-not-allowed"
          >
            {isLoading ? "Cambiando..." : "Cambiar Rol"}
          </button>
        </div>
      </div>
    </div>
  );
}
