// @ts-check
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import { defineConfig, envField } from "astro/config";
import auth from "auth-astro";
import { loadEnv } from "vite";

const { PUBLIC_SITE_URL } = loadEnv(process.env.PUBLIC_SITE_URL ?? "", process.cwd(), "");

// https://astro.build/config
export default defineConfig({
  site: PUBLIC_SITE_URL,
  output: "server",
  adapter: vercel(),
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    sitemap({
      entryLimit: 10_000,
    }),
    auth(),
  ],
  env: {
    schema: {
      API_URL: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
      PORT: envField.number({
        context: "server",
        access: "public",
        default: 4321,
      }),
      AUTH_GOOGLE_ID: envField.string({
        context: "server",
        access: "secret",
      }),
      AUTH_GOOGLE_SECRET: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },
});
