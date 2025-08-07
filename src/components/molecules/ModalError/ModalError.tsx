"use client";

import { useErrorStore } from "@/store/errorStore";

export const ErrorModal = () => {
  const error = useErrorStore((state) => state.error);
  const setError = useErrorStore((state) => state.setError);

  if (!error) return null;

  return (
    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-error-50 sm:mx-0 sm:h-10 sm:w-10">
                  <i className="ri-error-warning-line text-2xl text-error-500"></i>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">
                    Error
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{error || "Ocurrio un error inesperado"}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="
                  inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2
                  text-sm font-semibold text-white shadow-sm hover:bg-red-500
                  sm:ml-3 sm:w-auto
                "
                onClick={() => setError(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
