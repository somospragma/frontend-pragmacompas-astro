import { describe, it, expect, vi } from "vitest";
// Ajusta la ruta si es necesario
import { getSession } from "auth-astro/server";
import { checkAuth } from "./auth";

vi.mock("auth-astro/server", () => ({
  getSession: vi.fn(),
}));

describe("checkAuth", () => {
  it("debe retornar Response con estado 404 si no hay sesión", async () => {
    (getSession as vi.Mock).mockResolvedValue(null);

    const request = new Request("https://example.com");
    const response = await checkAuth(request);

    expect(response).toBeInstanceOf(Response);
    expect(response?.status).toBe(404);
  });

  it("debe retornar null si hay una sesión activa", async () => {
    (getSession as vi.Mock).mockResolvedValue({ user: { name: "John Doe" } });

    const request = new Request("https://example.com");
    const response = await checkAuth(request);

    expect(response).toBeNull();
  });
});
