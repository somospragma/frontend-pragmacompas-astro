import Google from "@auth/core/providers/google";
import { AUTH_GOOGLE_SECRET, AUTH_GOOGLE_ID } from "astro:env/server";
import { defineConfig } from "auth-astro";

export default defineConfig({
  providers: [
    Google({
      clientId: AUTH_GOOGLE_ID,
      clientSecret: AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
});
