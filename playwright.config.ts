import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 4322);
const BASE_URL = `http://localhost:${PORT}`;

// Los E2E crean usuarios y escriben progreso: nunca contra Atlas ni otra base remota
const uri = process.env.MONGODB_URI ?? "";
if (!/^mongodb:\/\/(localhost|127\.0\.0\.1)[:/]/.test(uri)) {
  throw new Error(
    "Los E2E necesitan un MONGODB_URI local (mongodb://localhost… o mongodb://127.0.0.1…). " +
      "En local usa `npm run test:e2e:local`, que levanta uno en memoria.",
  );
}

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: { baseURL: BASE_URL, trace: "retain-on-failure" },
  webServer: {
    // Puerto propio e --ignore-lock: no choca con el `astro dev` de trabajo (4321)
    command: `npx astro dev --port ${PORT} --ignore-lock`,
    url: `${BASE_URL}/api/health`,
    // Nunca reutilizar un servidor ya abierto: podría estar conectado a la base real
    reuseExistingServer: false,
    timeout: 120_000,
    env: { BETTER_AUTH_URL: BASE_URL },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
