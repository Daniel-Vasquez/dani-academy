/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    include: ["tests/{unit,integration,components}/**/*.test.{ts,tsx}"],
    environment: "node", // los tests de componentes usan el comentario `// @vitest-environment jsdom`
    setupFiles: ["@testing-library/jest-dom/vitest"],
    testTimeout: 30_000,
    hookTimeout: 120_000, // la primera ejecución descarga el binario de MongoDB
    coverage: { include: ["src/lib/**", "src/server/**"] },
  },
});
