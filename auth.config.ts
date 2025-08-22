import { validateUser } from "@/infrastructure/services/validateUser";
import Google from "@auth/core/providers/google";
import { AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET } from "astro:env/server";
import { defineConfig } from "auth-astro";

interface SessionUser {
  user: {
    rol?: string;
    userId?: string;
    googleId?: string;
    googleClientId?: string;
    accessToken?: string;
  };
}

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
  callbacks: {
    async jwt({ token, account, profile }) {
      // Capturar información adicional de Google durante el login
      if (account && profile) {
        token.googleId = profile.sub ?? undefined; // Google User ID
        token.googleClientId = account.providerAccountId; // ID de la cuenta del proveedor
        token.accessToken = account.access_token; // Token de acceso (si necesitas hacer llamadas a Google APIs)

        const userValidation = await validateUser(profile.sub ?? "");
        if (userValidation && typeof userValidation === "object" && "data" in userValidation) {
          token.rol = userValidation.data.rol;
          token.userId = userValidation.data.id;
        } else {
          token.rol = "Tutorado";
          token.userId = "";
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        (session as SessionUser).user.rol = token.rol as string | undefined;
        (session as SessionUser).user.userId = token.userId as string | undefined;
        (session as SessionUser).user.googleId = token.googleId as string | undefined;
        (session as SessionUser).user.googleClientId = token.googleClientId as string | undefined;
        (session as SessionUser).user.accessToken = token.accessToken as string | undefined;
      }
      return session;
    },
  },
});
