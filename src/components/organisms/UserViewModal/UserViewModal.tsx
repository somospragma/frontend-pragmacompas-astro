import Modal from "@/components/atoms/Modal/Modal";
import type { User } from "@/infrastructure/models/TutoringRequest";

interface UserViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function UserViewModal({ isOpen, onClose, user }: UserViewModalProps) {
  if (!user) return null;

  const fullName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.firstName || user.lastName || "Sin nombre";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles del Usuario" size="md">
      <div className="space-y-4">
        {/* Avatar and Name */}
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-xl font-medium text-white">
              {(user.firstName?.charAt(0) || user.lastName?.charAt(0) || "?").toUpperCase()}
            </span>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{fullName}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.rol}</p>
          </div>
        </div>

        {/* User Details */}
        <div className="grid grid-cols-1 gap-4">
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
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}
