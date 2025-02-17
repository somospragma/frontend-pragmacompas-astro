import { describe, it, expect, vi } from "vitest";
// Ajusta la ruta si es necesario
import { getSession } from "auth-astro/server";
import { checkAuth } from "./auth";

vi.mock("auth-astro/server", () => ({
  getSession: vi.fn(),
}));

describe("checkAuth", () => {
  it("should return a 404 response if there is no session", async () => {
    (getSession as vi.Mock).mockResolvedValue(null);

    const request = new Request("https://example.com");
    const response = await checkAuth(request);

    expect(response).toBeInstanceOf(Response);
    expect(response?.status).toBe(404);
  });

  it("should be return null if there is a session active", async () => {
    (getSession as vi.Mock).mockResolvedValue({ user: { name: "John Doe" } });

    const request = new Request("https://example.com");
    const response = await checkAuth(request);

    expect(response).toBeNull();
  });
});
