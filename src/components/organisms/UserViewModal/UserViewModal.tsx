import { useMemo } from "react";
import Modal from "@/components/atoms/Modal/Modal";
import type { User } from "@/infrastructure/models/TutoringRequest";

/**
 * UserViewModal component displays detailed information about a user in a modal dialog.
 * Shows user profile including name, email, role, seniority, and IDs.
 *
 * @component
 * @example
 * ```tsx
 * <UserViewModal
 *   isOpen={true}
 *   onClose={() => setIsOpen(false)}
 *   user={selectedUser}
 * />
 * ```
 */

interface UserViewModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly user: User | null;
}

export default function UserViewModal({ isOpen, onClose, user }: UserViewModalProps) {
  const fullName = useMemo(() => {
    if (!user) return "Sin nombre";
    return user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.firstName || user.lastName || "Sin nombre";
  }, [user?.firstName, user?.lastName]);

  const userInitial = useMemo(() => {
    if (!user) return "?";
    return (user.firstName?.charAt(0) || user.lastName?.charAt(0) || "?").toUpperCase();
  }, [user?.firstName, user?.lastName]);

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles del Usuario" size="md">
      <article className="space-y-4">
        {/* Avatar and Name */}
        <header className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center" aria-hidden="true">
            <span className="text-xl font-medium text-white">{userInitial}</span>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{fullName}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400" role="status">
              {user.rol}
            </p>
          </div>
        </header>

        {/* User Details */}
        <section className="grid grid-cols-1 gap-4" aria-label="Información del usuario">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">{user.email || "No especificado"}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Seniority</label>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">{user.seniority || "No especificado"}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ID de Usuario</label>
            <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">{user.id || "No especificado"}</p>
          </div>

          {user.chapterId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Chapter ID</label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">{user.chapterId}</p>
            </div>
          )}

          {user.slackId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Slack ID</label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">{user.slackId}</p>
            </div>
          )}
        </section>

        {/* Actions */}
        <footer className="flex justify-end space-x-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors"
            aria-label="Cerrar modal de detalles"
          >
            Cerrar
          </button>
        </footer>
      </article>
    </Modal>
  );
}
