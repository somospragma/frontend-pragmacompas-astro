import { describe, it, expect } from "vitest";
import { act } from "react";
import { useErrorStore } from "./errorStore";

describe("useErrorStore", () => {
  it("should return the initial state", () => {
    const state = useErrorStore.getState();
    expect(state.error).toBeNull();
  });

  it("should set the error state", () => {
    act(() => {
      useErrorStore.getState().setError("Error de prueba");
    });

    const state = useErrorStore.getState();
    expect(state.error).toBe("Error de prueba");
  });

  it("should clear the error state", () => {
    act(() => {
      useErrorStore.getState().setError("Otro error");
      useErrorStore.getState().setError(null);
    });

    const state = useErrorStore.getState();
    expect(state.error).toBeNull();
  });
});
