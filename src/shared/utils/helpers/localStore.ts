import type { StorageKey } from "../enums/storageKey";
import { cypher } from "./cypher";

const getStorage = (key: StorageKey) => {
  const newKey = cypher.encrypt(key);
  const value = localStorage.getItem(newKey);
  if (value === null) {
    return null;
  }
  try {
    return JSON.parse(cypher.decrypt(value));
  } catch (error) {
    console.error("Error parsing JSON from localStorage", error);
    return null;
  }
};

const setStorage = (key: StorageKey, value: object | string | boolean) => {
  const newKey = cypher.encrypt(key);
  const newValue = cypher.encrypt(JSON.stringify(value));

  try {
    localStorage.setItem(newKey, newValue);
  } catch (error) {
    console.error("Error setting item in localStorage", error);
  }
};

export const localStore = {
  getStorage,
  setStorage,
};
