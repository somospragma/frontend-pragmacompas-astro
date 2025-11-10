"use client";

import { useEffect } from "react";
import { useErrorStore } from "@/store/errorStore";
import {
  components,
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  combineTokens,
} from "@/shared/tokens/designTokens";

export const ErrorModal = () => {
  const error = useErrorStore((state) => state.error);
  const setError = useErrorStore((state) => state.setError);

  // Keyboard support for Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && error) {
        setError(null);
      }
    };

    if (error) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [error, setError]);

  if (!error) return null;

  const modalStyles = {
    overlay: components.modal.overlay,
    content: combineTokens(
      components.modal.content,
      colors.text.primary,
      "sm:my-8 sm:w-full sm:max-w-lg relative transform overflow-hidden text-left transition-all"
    ),
    iconContainer: combineTokens(
      colors.background.error,
      borderRadius.full,
      "mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center sm:mx-0 sm:h-10 sm:w-10"
    ),
    title: combineTokens(typography.size.md, typography.weight.semibold, colors.text.primary, "leading-6"),
    description: combineTokens(typography.size.sm, colors.text.secondary, "mt-2"),
    button: combineTokens(
      "inline-flex w-full justify-center",
      borderRadius.md,
      "bg-red-600 hover:bg-red-500",
      spacing.sm,
      typography.size.sm,
      typography.weight.semibold,
      colors.text.inverse,
      shadows.sm,
      "transition-colors duration-200",
      "sm:ml-3 sm:w-auto"
    ),
  };

  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      aria-describedby="error-description"
      role="dialog"
      aria-modal="true"
    >
      <div className={modalStyles.overlay}></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className={modalStyles.content}>
            <div className={combineTokens(colors.background.white, spacing.md, "pt-5 pb-4 sm:p-6 sm:pb-4")}>
              <div className="sm:flex sm:items-start">
                <div className={modalStyles.iconContainer}>
                  <i
                    className={combineTokens("ri-error-warning-line", typography.size["2xl"], colors.text.error)}
                    aria-hidden="true"
                  ></i>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className={modalStyles.title} id="modal-title">
                    Error
                  </h3>
                  <div className={modalStyles.description}>
                    <p id="error-description">{error || "Ocurrió un error inesperado"}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={combineTokens("bg-gray-50", spacing.md, "py-3 sm:flex sm:flex-row-reverse sm:px-6")}>
              <button type="button" className={modalStyles.button} onClick={() => setError(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
