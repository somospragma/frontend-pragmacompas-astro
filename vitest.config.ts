/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  base: "./",
  resolve: { alias: { "@": "/src" } },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setup-tests.ts",
    coverage: {
      enabled: false,
      provider: 'istanbul',
      all: true,
      reporter: ['text', 'html', 'lcov'],
      include: ['**/src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        '**/*.types.{ts,tsx}',
        '**/*.test.{js,jsx,ts,tsx}',
        '**/src/vite-env*',
        '**/src/components/ui/*',
        './src/middleware.ts',
        './src/infrastructure/adapters/httpClient/httpClient.ts',
        './src/utils/enums/paths.ts',
      ],
      thresholds: {
        statements: 0,
        branches: 0,
        functions: 0,
        lines: 0,
      },
    },
  },
});
