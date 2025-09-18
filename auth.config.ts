import { validateUser } from "@/infrastructure/services/validateUser";
import Google from "@auth/core/providers/google";
import { AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET } from "astro:env/server";
import { defineConfig } from "auth-astro";

export interface SessionUser {
  user: {
    rol?: string;
    userId?: string;
    googleId?: string;
    googleClientId?: string;
    accessToken?: string;
    chapterId?: string;
    seniority?: string;
    firstName?: string;
    lastName?: string;
    image?: string;
    email?: string;
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
          token.firstName = profile.given_name;
          token.lastName = profile.family_name;
          token.email = token.email;
          token.chapterId = userValidation.data.chapter.id;
        } else {
          token.rol = "";
          token.userId = "";
          token.firstName = profile.given_name;
          token.lastName = profile.family_name;
          token.email = token.email;
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
        (session as SessionUser).user.firstName = token.firstName as string | undefined;
        (session as SessionUser).user.lastName = token.lastName as string | undefined;
        (session as SessionUser).user.chapterId = token.chapterId as string | undefined;
      }
      return session;
    },
  },
});
