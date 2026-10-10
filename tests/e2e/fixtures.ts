import { test as base, expect, type Page } from "@playwright/test";

/**
 * Cada test simula un cliente con su propia IP (cabecera x-forwarded-for, la que lee
 * Better Auth en local). Así el límite de 5 registros por hora y por IP no se agota
 * entre tests, y el test de fuerza bruta usa una IP solo suya.
 */
export const test = base.extend({
  // Playwright exige desestructurar el primer argumento aunque no se use ninguna fixture
  // eslint-disable-next-line no-empty-pattern
  extraHTTPHeaders: async ({}, use) => {
    const ip = `10.${[0, 0, 0].map(() => Math.floor(Math.random() * 254) + 1).join(".")}`;
    await use({ "x-forwarded-for": ip });
  },
});

export { expect };

export const PASSWORD = "password-seguro-123";

export const uniqueEmail = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@e2e.test`;

/**
 * Peticiones a la API con la cookie de sesión de la página. Llevan Origin porque Astro
 * (security.checkOrigin) rechaza con 403 un PUT/POST/DELETE sin él, igual que haría con
 * una petición de otro sitio; el fetch del navegador lo envía siempre.
 */
export function api(page: Page) {
  const headers = { origin: new URL(page.url()).origin };
  return {
    put: (path: string) => page.request.put(path, { headers }),
    post: (path: string, data: unknown) => page.request.post(path, { headers, data }),
  };
}

/** Cierra la sesión desde la cabecera y espera a que termine (vuelve al login) */
export async function signOut(page: Page) {
  await page.getByRole("button", { name: "Salir" }).click();
  await expect(page).toHaveURL(/\/login/);
}

/** Registra un usuario por la interfaz y espera a llegar al temario con la sesión iniciada */
export async function registerUser(page: Page, email = uniqueEmail("usuario")) {
  await page.goto("/registro");
  await page.getByLabel("Nombre").fill("E2E");
  await page.getByLabel("Correo").fill(email);
  await page.getByLabel("Contraseña").fill(PASSWORD);
  await page.getByRole("button", { name: "Crear cuenta" }).click();
  await expect(page).toHaveURL(/\/temario$/);
  return email;
}
