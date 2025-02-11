import { describe, it, expect } from "vitest";
import { cn } from "./style";

describe("cn", () => {
  it("debe combinar clases correctamente", () => {
    expect(cn("text-red-500", "bg-blue-500")).toBe("text-red-500 bg-blue-500");
  });

  it("debe fusionar clases de Tailwind en conflicto", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500"); // `twMerge` mantiene la última
  });

  it("debe manejar valores falsy correctamente", () => {
    expect(cn("text-red-500", undefined, false, null, "bg-blue-500")).toBe("text-red-500 bg-blue-500");
  });

  it("debe manejar clases condicionales con clsx", () => {
    expect(cn("p-4", { hidden: false, block: true })).toBe("p-4 block");
  });

  it("debe devolver una cadena vacía si no se pasan clases", () => {
    expect(cn()).toBe("");
  });
});
