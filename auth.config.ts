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
  callbacks: {
    async jwt({ token }) {
      try {
        const googleId = "google-tutor-1";
        const { getSecret } = await import("astro:env/server");
        const apiUrl = getSecret("API_URL");

        const response = await fetch(`${apiUrl}/api/v1/users/me`, {
          headers: {
            Authorization: googleId,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const userData = await response.json();
          token.role = userData.data.rol;
        }
      } catch (error) {
        console.error("❌ Error fetching user role:", error);
      }
      return token;
    },

    session({ session, token }) {
      session.user.id = token.sub as string;
      session.user.role = token.role as string;
      console.log("🔥 Session callback - role:", session.user);
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
