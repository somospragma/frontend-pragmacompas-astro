import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      "dist/",
      "coverage/",
      "docs/",
      "public/",
      ".vercel/",
      ".husky/",
      "node_modules/",
      "src/assets/",
      "src/components/ui/",
      ".astro/",
      "tailwind.config.mjs",
      "tsconfig.json",
      "vitest.config.ts",
      "eslint.config.js",
    ],
  },
  { files: ["src/**/*.{js,jsx,ts,tsx,md,mdx,astro}"] },
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs["jsx-a11y-recommended"],
  eslintPluginPrettierRecommended,
  {
    rules: {
      "astro/no-set-html-directive": "error",
      "astro/no-set-text-directive": "error",
      "astro/no-unused-css-selector": "error",
      "prettier/prettier": "error",
      "max-len": ["warn", { code: 120 }],
    },
  },
];
