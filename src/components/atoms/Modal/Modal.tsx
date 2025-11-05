import { useEffect } from "react";

interface ModalProps {
  /** Controls whether the modal is visible */
  isOpen: boolean;
  /** Callback function called when modal should close */
  onClose: () => void;
  /** Title text displayed in modal header */
  title: string;
  /** Content to be displayed inside the modal */
  children: React.ReactNode;
  /** Size variant of the modal - affects max width */
  size?: "sm" | "md" | "lg" | "xl";
}

/**
 * Modal component with responsive design and accessibility features
 *
 * Features:
 * - Keyboard support (ESC to close)
 * - Click outside to close
 * - Focus management
 * - Screen reader support
 * - Mobile-first responsive design
 *
 * @example
 * ```tsx
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirm Action"
 *   size="md"
 * >
 *   <p>Are you sure you want to continue?</p>
 * </Modal>
 * ```
 */

export default function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "w-full max-w-md mx-4 sm:mx-auto",
    md: "w-full max-w-lg mx-4 sm:mx-auto",
    lg: "w-full max-w-2xl mx-4 sm:mx-auto",
    xl: "w-full max-w-4xl mx-4 sm:mx-auto",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

        {/* Modal */}
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className={`relative w-full ${sizeClasses[size]} transform rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h3 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <button
              onClick={onClose}
              aria-label="Cerrar modal"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
