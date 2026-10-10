import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { THEME_STORAGE_KEY } from "@/lib/constants";

// El script del tema se incrusta en línea (con su hash en la CSP) y no puede importar constantes
it("el script del tema usa la misma clave que THEME_STORAGE_KEY", () => {
  const script = readFileSync("src/scripts/theme-init.js", "utf8");
  expect(script).toContain(`localStorage.getItem("${THEME_STORAGE_KEY}")`);
});
