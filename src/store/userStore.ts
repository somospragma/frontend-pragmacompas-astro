import type { SessionUser } from "auth.config";
import { atom } from "nanostores";

type User = SessionUser["user"] & { isLoggedIn: boolean; id?: string };

const initialState: User = {
  firstName: "",
  lastName: "",
  email: "",
  image: "",
  chapterId: "",
  seniority: "",
  rol: "",
  googleId: "",
  userId: "",
  googleClientId: "",
  accessToken: "",
  isLoggedIn: false,
  id: "",
};

export const userStore = atom<User>(initialState);

export const setUser = (userData: Partial<User>) => {
  userStore.set({
    ...userStore.get(),
    ...userData,
    isLoggedIn: true,
  });
};

export const clearUser = () => {
  userStore.set(initialState);
};

export const updateUserProfile = (profileData: Partial<User>) => {
  userStore.set({
    ...userStore.get(),
    ...profileData,
  });
};
