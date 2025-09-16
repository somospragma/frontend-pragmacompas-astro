import { useState } from "react";
import Modal from "@/components/atoms/Modal/Modal";
import type { User } from "@/infrastructure/models/TutoringRequest";

interface UserDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onDelete: (userId: string) => void;
}

export default function UserDeleteModal({ isOpen, onClose, user, onDelete }: UserDeleteModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      await onDelete(user.id);
      onClose();
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  const fullName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.firstName || user.lastName || "Sin nombre";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Eliminar Usuario" size="sm">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">¿Eliminar usuario?</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Esta acción no se puede deshacer.</p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {(user.firstName?.charAt(0) || user.lastName?.charAt(0) || "?").toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{fullName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Se eliminará permanentemente el usuario <strong>{fullName}</strong> del sistema. Todas las sesiones y datos
          asociados también serán eliminados.
        </p>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
          >
            {isLoading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
