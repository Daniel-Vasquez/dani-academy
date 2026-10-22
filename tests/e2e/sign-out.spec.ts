import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect, registerUser, test } from "./fixtures";

const dialog = (page: Page) => page.getByRole("dialog", { name: "Cerrar sesión" });
const openDialog = async (page: Page) => {
  await page.getByRole("button", { name: "Salir" }).click();
  await expect(dialog(page)).toBeVisible();
};

test("«Salir» pide confirmación: Cancelar, Escape y clic fuera no cierran la sesión", async ({
  page,
}) => {
  await registerUser(page);

  await openDialog(page);
  // El foco empieza en la opción segura y la página de detrás no hace scroll
  await expect(dialog(page).getByRole("button", { name: "Cancelar" })).toBeFocused();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe(
    "hidden",
  );
  await dialog(page).getByRole("button", { name: "Cancelar" }).click();
  await expect(dialog(page)).toBeHidden();
  await expect(page.getByRole("button", { name: "Salir" })).toBeFocused();

  await openDialog(page);
  await page.keyboard.press("Escape");
  await expect(dialog(page)).toBeHidden();

  await openDialog(page);
  await page.mouse.click(5, 5); // esquina del fondo, fuera de la caja
  await expect(dialog(page)).toBeHidden();

  // Ninguna de las tres ha cerrado la sesión
  await page.reload();
  await expect(page).toHaveURL(/\/temario$/);
  await expect(page.getByRole("button", { name: "Salir" })).toBeVisible();
});

test("un clic dentro de la caja no la cierra; Confirmar cierra la sesión", async ({ page }) => {
  await registerUser(page);
  await openDialog(page);
  await dialog(page).getByText("¿Estás seguro de que deseas salir de tu cuenta?").click();
  await expect(dialog(page)).toBeVisible();

  await dialog(page).getByRole("button", { name: "Cerrar sesión" }).click();
  await expect(page).toHaveURL(/\/login/);
  // La sesión ya no existe: una página privada vuelve a pedir el login
  await page.goto("/temario");
  await expect(page).toHaveURL(/\/login/);
});

test("el diálogo funciona tras navegar con View Transitions y no tiene infracciones WCAG", async ({
  page,
}) => {
  await registerUser(page);
  await page.getByRole("link", { name: "Progreso" }).first().click();
  await expect(page).toHaveURL(/\/progreso$/);
  for (const theme of ["light", "dark"]) {
    await page.evaluate((t) => localStorage.setItem("da-theme", t), theme);
    await page.reload();
    await openDialog(page);
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      violations.map((v) => v.id),
      theme,
    ).toEqual([]);
    await page.keyboard.press("Escape");
  }
});
