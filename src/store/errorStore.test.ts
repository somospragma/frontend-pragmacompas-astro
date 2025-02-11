import { describe, it, expect } from "vitest";
import { act } from "react";
import { useErrorStore } from "./errorStore";

describe("useErrorStore", () => {
  it("debe tener un estado inicial con error null", () => {
    const state = useErrorStore.getState();
    expect(state.error).toBeNull();
  });

  it("debe actualizar el error correctamente", () => {
    act(() => {
      useErrorStore.getState().setError("Error de prueba");
    });

    const state = useErrorStore.getState();
    expect(state.error).toBe("Error de prueba");
  });

  it("debe poder resetear el error a null", () => {
    act(() => {
      useErrorStore.getState().setError("Otro error");
      useErrorStore.getState().setError(null);
    });

    const state = useErrorStore.getState();
    expect(state.error).toBeNull();
  });
});
