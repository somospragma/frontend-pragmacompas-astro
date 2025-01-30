/** @type {import("prettier").Config} */
export default {
  plugins: ["prettier-plugin-astro"],
  printWidth: 120,
  useTabs: false,
  semi: true,
  trailingComma: "es5",
  endOfLine: "auto",
  bracketSpacing: true,
  arrowParens: "always",
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};
