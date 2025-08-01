import { useEffect, useRef, type RefObject } from "react";

export const useClickOutside = (ref: RefObject<HTMLElement>, callback: () => void): void => {
  const hasMounted = useRef(false);

  const handleClickOutside = (e: MouseEvent) => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (ref.current && !ref.current.contains(e.target as Node)) {
      callback();
    }
  };

  useEffect(() => {
    if (!ref.current) return;

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};
