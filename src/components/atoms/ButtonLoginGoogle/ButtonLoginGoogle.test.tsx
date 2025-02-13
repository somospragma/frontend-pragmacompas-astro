import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { signIn } from "auth-astro/client";
import { ButtonLoginGoogle } from "./ButtonLoginGoogle";

vi.mock("auth-astro/client", () => ({
  signIn: vi.fn(),
}));

describe("ButtonLoginGoogle", () => {
  it("renders correctly", () => {
    render(<ButtonLoginGoogle />);
    expect(screen.getByText("Inicia sesión con Google")).toBeInTheDocument();
    expect(screen.getByAltText("Google Icon")).toBeInTheDocument();
  });

  it("calls signIn with 'google' when clicked", () => {
    render(<ButtonLoginGoogle />);
    const button = screen.getByText("Inicia sesión con Google");
    fireEvent.click(button);
    expect(signIn).toHaveBeenCalledWith("google");
  });
});
