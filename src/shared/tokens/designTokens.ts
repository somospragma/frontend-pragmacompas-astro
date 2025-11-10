/**
 * Design tokens for Pragma frontend components
 * Following atomic design methodology and design system principles
 */

// Color tokens
export const colors = {
  // Text colors
  text: {
    primary: "text-foreground",
    secondary: "text-muted-foreground",
    inverse: "text-white",
    error: "text-red-500",
    success: "text-green-600",
    warning: "text-yellow-600",
    info: "text-blue-600",
  },
  // Background colors
  background: {
    primary: "bg-background",
    secondary: "bg-muted",
    card: "bg-card",
    white: "bg-white",
    error: "bg-red-50",
    success: "bg-green-50",
    warning: "bg-yellow-50",
    info: "bg-blue-50",
  },
  // Border colors
  border: {
    default: "border-border",
    input: "border-gray-300",
    focus: "border-blue-500",
    error: "border-red-500",
    success: "border-green-500",
  },
} as const;

// Spacing tokens
export const spacing = {
  xs: "p-1",
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
  xl: "p-8",
  // Margins
  margin: {
    xs: "m-1",
    sm: "m-2",
    md: "m-4",
    lg: "m-6",
    xl: "m-8",
    bottom: {
      xs: "mb-1",
      sm: "mb-2",
      md: "mb-4",
      lg: "mb-6",
    },
  },
} as const;

// Typography tokens
export const typography = {
  size: {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
  },
  weight: {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  },
} as const;

// Border radius tokens
export const borderRadius = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
} as const;

// Shadow tokens
export const shadows = {
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
} as const;

// Focus tokens for accessibility
export const focus = {
  default: "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
  visible: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-50",
  error: "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50",
} as const;

// Transition tokens
export const transitions = {
  default: "transition-all duration-200",
  fast: "transition-all duration-150",
  slow: "transition-all duration-300",
  colors: "transition-colors duration-200",
} as const;

// State tokens for interactive elements
export const states = {
  hover: {
    background: "hover:bg-gray-100 dark:hover:bg-gray-700",
    shadow: "hover:shadow-lg",
    scale: "hover:scale-105",
  },
  active: "active:scale-95",
  disabled: "disabled:opacity-50 disabled:cursor-not-allowed",
} as const;

// Component-specific token combinations
export const components = {
  button: {
    base: `${focus.visible} ${transitions.default} ${states.disabled}`,
    primary: `${colors.background.card} ${colors.text.primary} ${borderRadius.lg} ${spacing.md}`,
  },
  input: {
    base: `${colors.background.white} ${colors.border.input} ${borderRadius.md} ${spacing.sm} ${focus.default}`,
    error: `${colors.border.error} ${focus.error}`,
  },
  card: {
    base: `${colors.background.card} ${borderRadius.xl} ${spacing.lg} ${shadows.sm} ${colors.border.default} border`,
    interactive: `${states.hover.shadow} ${states.hover.scale} ${transitions.default} cursor-pointer`,
  },
  modal: {
    overlay: "fixed inset-0 bg-black bg-opacity-50 z-40",
    content: `${colors.background.white} ${borderRadius.lg} ${shadows.xl} max-w-md w-full max-h-96`,
  },
} as const;

// Utility function to combine tokens
export const combineTokens = (...tokens: string[]): string => {
  return tokens.filter(Boolean).join(" ");
};
