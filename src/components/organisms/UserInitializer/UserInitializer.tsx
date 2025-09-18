import { validateUser } from "@/infrastructure/services/validateUser";
import { setUser, type User } from "@/store/userStore";
import { useEffect } from "react";

export function UserInitializer({ user }: { user: Partial<User> | null }) {
  useEffect(() => {
    async function initializeUser() {
      const userValidation = await validateUser(user?.id ?? "");
      if (user && userValidation && typeof userValidation === "object" && "data" in userValidation) {
        setUser({
          ...user,
          rol: userValidation.data.rol,
          userId: userValidation.data.id,
          seniority: userValidation.data.seniority,
          chapterId: userValidation.data.chapter.id,
        });
      }
    }
    initializeUser();
  }, []);

  return null;
}
