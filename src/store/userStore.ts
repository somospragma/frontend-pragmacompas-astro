import { atom } from "nanostores";

export interface UserState {
  id: string | null;
  name: string | null;
  email: string | null;
  avatar: string | null;
  chapterId: string | null;
  seniority: string | null;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  id: null,
  name: null,
  email: null,
  avatar: null,
  chapterId: null,
  seniority: null,
  isLoggedIn: false,
};

export const userStore = atom<UserState>(initialState);

export const setUser = (userData: Partial<UserState>) => {
  userStore.set({
    ...userStore.get(),
    ...userData,
    isLoggedIn: true,
  });
};

export const clearUser = () => {
  userStore.set(initialState);
};

export const updateUserProfile = (profileData: Partial<UserState>) => {
  userStore.set({
    ...userStore.get(),
    ...profileData,
  });
};
