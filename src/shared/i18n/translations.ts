/**
 * Internationalization utilities for Pragma frontend
 * Supporting configurable text for multi-language support
 */

export interface TranslationKeys {
  common: {
    error: string;
    success: string;
    warning: string;
    info: string;
    close: string;
    cancel: string;
    confirm: string;
    save: string;
    loading: string;
    required: string;
    optional: string;
    search: string;
    noResults: string;
    selectOptions: string;
    developers: string;
  };
  errors: {
    unexpected: string;
    validation: string;
    network: string;
    unauthorized: string;
  };
  auth: {
    login: string;
    logout: string;
    loggingOut: string;
    viewProfile: string;
  };
  accessibility: {
    required: string;
    selected: string;
    notSelected: string;
    options: string;
    menu: string;
    avatar: string;
    icon: string;
  };
}

// Spanish translations (default)
export const esTranslations: TranslationKeys = {
  common: {
    error: "Error",
    success: "Éxito",
    warning: "Advertencia",
    info: "Información",
    close: "Cerrar",
    cancel: "Cancelar",
    confirm: "Confirmar",
    save: "Guardar",
    loading: "Cargando...",
    required: "requerido",
    optional: "opcional",
    search: "Buscar",
    noResults: "Sin resultados",
    selectOptions: "Seleccionar opciones...",
    developers: "desarrolladores",
  },
  errors: {
    unexpected: "Ocurrió un error inesperado",
    validation: "Error de validación",
    network: "Error de conexión",
    unauthorized: "No autorizado",
  },
  auth: {
    login: "Iniciar sesión",
    logout: "Cerrar sesión",
    loggingOut: "Cerrando sesión...",
    viewProfile: "Ver perfil",
  },
  accessibility: {
    required: "requerido",
    selected: "seleccionado",
    notSelected: "no seleccionado",
    options: "opciones",
    menu: "menú",
    avatar: "avatar",
    icon: "icono",
  },
};

// English translations
export const enTranslations: TranslationKeys = {
  common: {
    error: "Error",
    success: "Success",
    warning: "Warning",
    info: "Information",
    close: "Close",
    cancel: "Cancel",
    confirm: "Confirm",
    save: "Save",
    loading: "Loading...",
    required: "required",
    optional: "optional",
    search: "Search",
    noResults: "No results",
    selectOptions: "Select options...",
    developers: "developers",
  },
  errors: {
    unexpected: "An unexpected error occurred",
    validation: "Validation error",
    network: "Network error",
    unauthorized: "Unauthorized",
  },
  auth: {
    login: "Log in",
    logout: "Log out",
    loggingOut: "Logging out...",
    viewProfile: "View profile",
  },
  accessibility: {
    required: "required",
    selected: "selected",
    notSelected: "not selected",
    options: "options",
    menu: "menu",
    avatar: "avatar",
    icon: "icon",
  },
};

// Available languages
export const availableLanguages = {
  es: esTranslations,
  en: enTranslations,
} as const;

export type SupportedLanguage = keyof typeof availableLanguages;

// Current language (could be managed by a state management system)
let currentLanguage: SupportedLanguage = "es";

/**
 * Set the current language
 */
export const setLanguage = (language: SupportedLanguage): void => {
  currentLanguage = language;
};

/**
 * Get the current language
 */
export const getCurrentLanguage = (): SupportedLanguage => {
  return currentLanguage;
};

/**
 * Get translation for a key using dot notation
 */
export const t = (key: string): string => {
  const translations = availableLanguages[currentLanguage];
  const keys = key.split(".");

  let value: unknown = translations;
  for (const k of keys) {
    value = (value as Record<string, unknown>)?.[k];
    if (value === undefined) {
      console.warn(`Translation key not found: ${key}`);
      return key; // Return the key if translation not found
    }
  }

  return typeof value === "string" ? value : key;
};

/**
 * Hook for React components to get translations with reactivity
 */
export const useTranslation = () => {
  return {
    t,
    currentLanguage,
    setLanguage,
    availableLanguages: Object.keys(availableLanguages) as SupportedLanguage[],
  };
};
