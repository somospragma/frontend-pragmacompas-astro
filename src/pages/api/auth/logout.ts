import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ cookies }) => {
  try {
    // Clear all possible auth-astro cookies
    const cookiesToClear = [
      "authjs.session-token",
      "authjs.csrf-token",
      "authjs.callback-url",
      "__Secure-authjs.session-token",
      "__Host-authjs.csrf-token",
      "authjs.pkce.code_verifier",
      "authjs.state",
      "next-auth.session-token",
      "next-auth.csrf-token",
      "__Secure-next-auth.session-token",
      "__Host-next-auth.csrf-token",
    ];

    // Clear each cookie with different path and domain combinations
    cookiesToClear.forEach((cookieName) => {
      // Clear with default options
      cookies.delete(cookieName, { path: "/" });

      // Clear with different path options
      cookies.delete(cookieName, {
        path: "/",
        domain: undefined,
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      });
    });

    // Return success response
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error during logout:", error);
    return new Response(JSON.stringify({ error: "Logout failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
