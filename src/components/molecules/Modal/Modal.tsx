import { AnimatePresence, motion } from "framer-motion";
import React, { Suspense, useState, useEffect, lazy, useMemo, type ComponentType } from "react";
import { components, combineTokens } from "@/shared/tokens/designTokens";
import { t } from "@/shared/i18n/translations";

type LazyComponentFunction = () => Promise<{ default: ComponentType<Record<string, unknown>> }>;

/**
 * Props for Modal component with lazy loading capabilities
 * @interface ModalProps
 * @property {boolean} isOpen - Controls modal visibility
 * @property {React.ReactNode} children - Static content to render
 * @property {LazyComponentFunction} lazyComponent - Function to lazy load component
 * @property {Record<string, unknown>} lazyProps - Props to pass to lazy component
 * @property {React.ReactNode} loadingComponent - Custom loading component
 * @property {React.ReactNode} errorComponent - Custom error component
 * @property {(error: Error) => void} onError - Error callback handler
 * @property {(isOpen: boolean) => void} setIsOpen - Function to control modal state
 */
interface ModalProps {
  isOpen: boolean;
  children?: React.ReactNode;
  // Lazy loading props
  lazyComponent?: LazyComponentFunction;
  lazyProps?: Record<string, unknown>;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  onError?: (error: Error) => void;
  setIsOpen?: (isOpen: boolean) => void;
}

/**
 * Loading fallback component for lazy loaded content
 */
const DefaultLoadingComponent = () => (
  <div className={combineTokens("flex items-center justify-center p-8")}>
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    <span className="ml-3 text-sm text-muted-foreground">{t("common.loading")}</span>
  </div>
);

/**
 * Error fallback component for lazy loaded content
 */
const DefaultErrorComponent = ({ retry }: { error: Error; retry: () => void }) => (
  <div className={combineTokens("p-6 text-center")}>
    <div className="text-red-500 mb-4">
      <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-foreground mb-2">{t("common.error")}</h3>
    <p className="text-sm text-muted-foreground mb-4">{t("errors.unexpected")}</p>
    <button
      onClick={retry}
      className={combineTokens(
        "px-4 py-2",
        "bg-blue-600 hover:bg-blue-700",
        "text-white text-sm font-medium",
        "rounded-md transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      )}
    >
      {t("common.retry") || "Retry"}
    </button>
  </div>
);

/**
 * Hook for managing lazy component loading
 */
const useLazyComponent = (lazyComponent?: LazyComponentFunction, onError?: (error: Error) => void) => {
  const [LazyComponent, setLazyComponent] = useState<ComponentType<Record<string, unknown>> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadComponent = async () => {
    if (!lazyComponent || LazyComponent) return;

    setLoading(true);
    setError(null);

    try {
      const component = lazy(lazyComponent);
      setLazyComponent(() => component);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to load component");
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  const retry = () => {
    setError(null);
    setLazyComponent(null);
    loadComponent();
  };

  useEffect(() => {
    if (lazyComponent) {
      loadComponent();
    }
  }, [lazyComponent]);

  return { LazyComponent, loading, error, retry };
};

const Modal = ({
  isOpen,
  children,
  lazyComponent,
  lazyProps = {},
  loadingComponent,
  errorComponent,
  onError,
  setIsOpen,
}: ModalProps) => {
  const { LazyComponent, loading, error, retry } = useLazyComponent(lazyComponent, onError);

  // Input validation for lazyProps
  const sanitizedProps = useMemo(() => {
    if (!lazyProps) return {};
    // Basic sanitization to prevent potential security issues
    return Object.fromEntries(
      Object.entries(lazyProps).filter(([key, value]) => typeof key === "string" && value !== undefined)
    );
  }, [lazyProps]);

  // Keyboard support for Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen && setIsOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, setIsOpen]);

  const modalStyles = {
    overlay: combineTokens(components.modal.overlay, "bg-gray-500/75"),
    container: "fixed inset-0 z-10 w-screen overflow-y-auto",
    wrapper: "flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0",
    content: combineTokens(
      components.modal.content,
      "bg-neutral-900 text-left transition-all sm:my-8 sm:w-full sm:max-w-lg relative transform overflow-hidden"
    ),
    body: "px-4 pt-5 pb-4 sm:p-6 sm:pb-4",
  };

  const renderContent = () => {
    // If lazy component is provided, handle its loading states
    if (lazyComponent) {
      if (error) {
        return errorComponent || <DefaultErrorComponent error={error} retry={retry} />;
      }

      if (loading || !LazyComponent) {
        return loadingComponent || <DefaultLoadingComponent />;
      }

      return (
        <Suspense fallback={loadingComponent || <DefaultLoadingComponent />}>
          <LazyComponent {...sanitizedProps} />
        </Suspense>
      );
    }

    // Regular children content
    return children;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="relative z-10"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className={modalStyles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <div className={modalStyles.container}>
            <div className={modalStyles.wrapper}>
              <motion.div
                className={modalStyles.content}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
              >
                <div className={modalStyles.body}>{renderContent()}</div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
