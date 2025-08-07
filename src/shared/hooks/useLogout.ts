import { clearUser } from "@/store/userStore";

export const useLogout = () => {
  const logout = async () => {
    try {
      // Clear user state immediately
      clearUser();

      // Call your custom logout endpoint
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in the request
      });

      if (response.ok) {
        console.log("Logout successful");
        // Small delay to ensure cookies are cleared before redirect
        setTimeout(() => {
          window.location.href = "/";
        }, 100);
      } else {
        console.error("Failed to logout");
        // Force redirect anyway to clear state
        setTimeout(() => {
          window.location.href = "/";
        }, 100);
      }
    } catch (error) {
      console.error("Error during logout:", error);
      // Fallback: redirect to home page
      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    }
  };

  return { logout };
};
