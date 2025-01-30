import { getSession } from "auth-astro/server";

export async function checkAuth(request: Request) {
  const session = await getSession(request);

  if (!session) {
    return new Response(null, { status: 404 });
  }

  return null;
}
