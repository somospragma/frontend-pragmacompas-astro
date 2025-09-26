/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Profile } from "@auth/core/types";
import { postCreateUser } from "./postCreateUser";
import { validateUser } from "./validateUser";

export const getOrCreateUser = async (profile: Profile) => {
  try {
    return await validateUser(profile.sub ?? "");
  } catch (error: any) {
    if (error?.response?.status === 403) {
      await postCreateUser({
        email: profile.email || "",
        googleUserId: profile.sub || "",
      });
      return await validateUser(profile.sub ?? "");
    }
    throw error;
  }
};
