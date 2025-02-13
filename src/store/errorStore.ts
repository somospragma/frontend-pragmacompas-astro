import { create } from "zustand";

// Definir la interfaz del estado
interface ErrorState {
  error: string | null;
  setError: (message: string | null) => void;
}

// Crear la store de Zustand
export const useErrorStore = create<ErrorState>((set) => ({
  error: null,
  setError: (message) => {
    set({ error: message });
  },
}));
