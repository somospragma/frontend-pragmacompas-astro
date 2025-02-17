import { describe, it, expect } from "vitest";
import { cn } from "./style";

describe("cn", () => {
  it("should be return a text classname", () => {
    expect(cn("text-red-500", "bg-blue-500")).toBe("text-red-500 bg-blue-500");
  });

  it("should be return a classname without conflicts", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("should be return to classnames without falsy values", () => {
    expect(cn("text-red-500", undefined, false, null, "bg-blue-500")).toBe("text-red-500 bg-blue-500");
  });

  it("should be handler clases conditionals with clsx", () => {
    expect(cn("p-4", { hidden: false, block: true })).toBe("p-4 block");
  });

  it("should be return empty string if no arguments are provided", () => {
    expect(cn()).toBe("");
  });
});
