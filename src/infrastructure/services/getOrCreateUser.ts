/* eslint-disable @typescript-eslint/no-explicit-any */
import { postCreateUser } from "./postCreateUser";
import { validateUser } from "./validateUser";

export const getOrCreateUser = async (data: { email: string; googleUserId: string }) => {
  try {
    return await validateUser(data.googleUserId);
  } catch (error: any) {
    if (error?.response?.status === 403) {
      await postCreateUser({
        email: data.email,
        googleUserId: data.googleUserId,
      });
      return await validateUser(data.googleUserId);
    }
    throw error;
  }
};
