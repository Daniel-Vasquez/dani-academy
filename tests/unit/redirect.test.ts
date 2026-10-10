import { describe, expect, it } from "vitest";
import { safeRedirect } from "@/lib/redirect";

describe("safeRedirect", () => {
  it.each([
    ["/temario", "/temario"],
    ["/cursos/typescript-desde-cero?x=1#a", "/cursos/typescript-desde-cero?x=1#a"],
  ])("permite rutas internas: %s", (target, expected) => {
    expect(safeRedirect(target)).toBe(expected);
  });

  it.each([
    ["//evil.com"],
    ["/\\evil.com"],
    ["https://evil.com"],
    ["javascript:alert(1)"],
    ["evil.com/temario"],
    [""],
    [null],
    [undefined],
  ])("rechaza %j y usa el valor por defecto", (target) => {
    expect(safeRedirect(target)).toBe("/");
    expect(safeRedirect(target, "/temario")).toBe("/temario");
  });
});
