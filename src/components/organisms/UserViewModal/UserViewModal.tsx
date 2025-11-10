import { useMemo } from "react";
import Modal from "@/components/atoms/Modal/Modal";
import type { User } from "@/infrastructure/models/TutoringRequest";

/**
 * Sanitizes user input to prevent XSS attacks
 * @param input - The input string to sanitize
 * @param maxLength - Maximum allowed length (default: 100)
 * @returns Sanitized string
 */
const sanitizeUserInput = (input: string | null | undefined, maxLength: number = 100): string => {
  if (!input || typeof input !== "string") return "";

  return input
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/[<>'"&]/g, (match) => {
      // Escape dangerous characters
      const escapeMap: Record<string, string> = {
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "&": "&amp;",
      };
      return escapeMap[match] || match;
    })
    .trim()
    .slice(0, maxLength);
};

/**
 * Validates email format
 * @param email - Email to validate
 * @returns Sanitized email or fallback
 */
const validateAndSanitizeEmail = (email: string | null | undefined): string => {
  if (!email || typeof email !== "string") return "No especificado";

  const sanitizedEmail = sanitizeUserInput(email, 254); // RFC 5321 email length limit
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(sanitizedEmail) ? sanitizedEmail : "Email inválido";
};

/**
 * UserViewModal component displays detailed information about a user in a modal dialog.
 * Shows user profile including name, email, role, seniority, and IDs with security sanitization.
 * Implements XSS prevention and input validation.
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
  // Memoized sanitized values for performance and security
  const sanitizedFullName = useMemo(() => {
    if (!user) return "Sin nombre";

    try {
      const firstName = sanitizeUserInput(user.firstName, 50);
      const lastName = sanitizeUserInput(user.lastName, 50);

      if (firstName && lastName) {
        return `${firstName} ${lastName}`;
      }

      return firstName || lastName || "Sin nombre";
    } catch (error) {
      console.warn("Error sanitizing user name:", error);
      return "Sin nombre";
    }
  }, [user?.firstName, user?.lastName]);

  const sanitizedRole = useMemo(() => {
    try {
      return sanitizeUserInput(user?.rol, 50) || "No especificado";
    } catch (error) {
      console.warn("Error sanitizing user role:", error);
      return "No especificado";
    }
  }, [user?.rol]);

  const sanitizedEmail = useMemo(() => {
    try {
      return validateAndSanitizeEmail(user?.email);
    } catch (error) {
      console.warn("Error validating user email:", error);
      return "Email inválido";
    }
  }, [user?.email]);

  const sanitizedSeniority = useMemo(() => {
    try {
      return sanitizeUserInput(user?.seniority, 30) || "No especificado";
    } catch (error) {
      console.warn("Error sanitizing user seniority:", error);
      return "No especificado";
    }
  }, [user?.seniority]);

  const sanitizedUserId = useMemo(() => {
    try {
      return sanitizeUserInput(user?.id?.toString(), 50) || "No especificado";
    } catch (error) {
      console.warn("Error sanitizing user ID:", error);
      return "No especificado";
    }
  }, [user?.id]);

  const sanitizedChapterId = useMemo(() => {
    try {
      return user?.chapterId ? sanitizeUserInput(user.chapterId.toString(), 50) : null;
    } catch (error) {
      console.warn("Error sanitizing chapter ID:", error);
      return null;
    }
  }, [user?.chapterId]);

  const sanitizedSlackId = useMemo(() => {
    try {
      return user?.slackId ? sanitizeUserInput(user.slackId, 50) : null;
    } catch (error) {
      console.warn("Error sanitizing Slack ID:", error);
      return null;
    }
  }, [user?.slackId]);

  const userInitial = useMemo(() => {
    if (!user) return "?";

    try {
      const firstChar = sanitizeUserInput(user.firstName, 1).charAt(0);
      const lastChar = sanitizeUserInput(user.lastName, 1).charAt(0);

      return (firstChar || lastChar || "?").toUpperCase();
    } catch (error) {
      console.warn("Error generating user initial:", error);
      return "?";
    }
  }, [user?.firstName, user?.lastName]);

  // Error boundary-like behavior
  if (!user) {
    console.info("UserViewModal: No user provided");
    return null;
  }

  // Enhanced close handler with error handling
  const handleClose = () => {
    try {
      onClose();
    } catch (error) {
      console.error("Error closing UserViewModal:", error);
      // Fallback - still try to close
      onClose();
    }
  };

  // Keyboard event handler for accessibility
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      handleClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Detalles del Usuario" size="md">
      <article id="user-details-content" className="space-y-4" onKeyDown={handleKeyDown} tabIndex={-1}>
        {/* Avatar and Name */}
        <header className="flex items-center space-x-4">
          <div
            className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0"
            aria-hidden="true"
          >
            <span className="text-xl font-medium text-white">{userInitial}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white truncate">{sanitizedFullName}</h4>
            <p
              className="text-sm text-gray-500 dark:text-gray-400 truncate"
              role="status"
              aria-label={`Rol del usuario: ${sanitizedRole}`}
            >
              {sanitizedRole}
            </p>
          </div>
        </header>

        {/* User Details */}
        <section className="grid grid-cols-1 gap-4" aria-label="Información detallada del usuario">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <p
              className="mt-1 text-sm text-gray-900 dark:text-white break-words"
              aria-label={`Email del usuario: ${sanitizedEmail}`}
            >
              {sanitizedEmail}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Seniority</label>
            <p
              className="mt-1 text-sm text-gray-900 dark:text-white truncate"
              aria-label={`Seniority del usuario: ${sanitizedSeniority}`}
            >
              {sanitizedSeniority}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ID de Usuario</label>
            <p
              className="mt-1 text-sm text-gray-900 dark:text-white font-mono break-all"
              aria-label={`ID del usuario: ${sanitizedUserId}`}
            >
              {sanitizedUserId}
            </p>
          </div>

          {sanitizedChapterId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Chapter ID</label>
              <p
                className="mt-1 text-sm text-gray-900 dark:text-white font-mono break-all"
                aria-label={`Chapter ID: ${sanitizedChapterId}`}
              >
                {sanitizedChapterId}
              </p>
            </div>
          )}

          {sanitizedSlackId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Slack ID</label>
              <p
                className="mt-1 text-sm text-gray-900 dark:text-white font-mono break-all"
                aria-label={`Slack ID: ${sanitizedSlackId}`}
              >
                {sanitizedSlackId}
              </p>
            </div>
          )}
        </section>

        {/* Actions */}
        <footer className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={handleClose}
            className={
              "px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200" +
              " dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors" +
              " focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }
            aria-label="Cerrar modal de detalles del usuario"
            type="button"
          >
            Cerrar
          </button>
        </footer>
      </article>
    </Modal>
  );
}
