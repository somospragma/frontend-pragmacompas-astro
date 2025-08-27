import { setUser, type User } from "@/store/userStore";
import { useEffect } from "react";

export function UserInitializer({ user }: { user: Partial<User> | null }) {
  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, []);

  return null;
}
