import type { Page } from "@playwright/test";
import { api, expect, registerUser, test } from "./fixtures";

// Lección con bloques más altos que la pantalla y con líneas más anchas que la columna
const SECTION = "/cursos/backend-con-astro/06-variables-de-entorno-y-configuracion";
const PREV_SECTION = "/cursos/backend-con-astro/05-arquitectura-por-capas";

const blocks = (page: Page) => page.locator("article [data-copy-code]");

/** El botón del bloque más alto de la lección y su <pre> */
async function tallestBlock(page: Page) {
  const index = await page.locator("article pre").evaluateAll((pres) => {
    const heights = pres.map((p) => p.getBoundingClientRect().height);
    return heights.indexOf(Math.max(...heights));
  });
  return { pre: page.locator("article pre").nth(index), button: blocks(page).nth(index) };
}

const clipboard = (page: Page) => page.evaluate(() => navigator.clipboard.readText());

test.beforeEach(async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await registerUser(page);
});

test("cada bloque de la lección tiene su botón, y copia su código", async ({ page }) => {
  await page.goto(SECTION);
  await expect(blocks(page)).toHaveCount(await page.locator("article pre").count());

  const { pre, button } = await tallestBlock(page);
  await button.scrollIntoViewIfNeeded();
  await expect(button).toHaveAccessibleName("Copiar código");
  await button.click();

  const copied = await pre.locator("code").evaluate((code) => code.textContent ?? "");
  expect(await clipboard(page)).toBe(copied.replace(/\n$/, ""));
  expect(copied.split("\n").length).toBeGreaterThan(20); // conserva los saltos de línea

  await expect(button).toHaveAttribute("data-state", "copied");
  await expect(button).toHaveAccessibleName("Código copiado");
  await expect(button.locator("svg:visible")).toHaveCount(1);
  await expect(button).toHaveAttribute("data-state", "idle", { timeout: 2500 });
  await expect(button).toHaveAccessibleName("Copiar código");
});

test("el botón acompaña al bloque al bajar y no se sale de él", async ({ page }) => {
  await page.goto(SECTION);
  const { pre, button } = await tallestBlock(page);

  // Rectángulos del propio navegador: boundingBox se altera con el zoom de la vista en móvil
  const measure = (fraction: number) =>
    pre.evaluate(async (el, f) => {
      const { top, height } = el.getBoundingClientRect();
      window.scrollTo({ top: window.scrollY + top + height * f - 100, behavior: "instant" });
      await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
      const block = el.getBoundingClientRect();
      const copy = el.parentElement!.querySelector("[data-copy-code]")!.getBoundingClientRect();
      return { height, copyTop: copy.top, copyBottom: copy.bottom, blockBottom: block.bottom };
    }, fraction);

  await expect(button).toBeAttached();
  const middle = await measure(0.5);
  expect(middle.height).toBeGreaterThan(page.viewportSize()!.height); // si no, no prueba nada
  expect(Math.round(middle.copyTop)).toBe(64); // pegado bajo la cabecera (3.5rem + 0.5rem)

  const end = await measure(1);
  expect(end.copyBottom).toBeLessThanOrEqual(end.blockBottom);
});

test("el scroll horizontal del código no mueve el botón", async ({ page }) => {
  await page.goto(SECTION);
  const wide = page.locator("article pre").filter({
    has: page.locator("code"),
  });
  const index = await wide.evaluateAll((pres) =>
    pres.findIndex((p) => p.scrollWidth > p.clientWidth + 40),
  );
  expect(index).toBeGreaterThanOrEqual(0);

  const copyX = () =>
    wide.nth(index).evaluate((p) => {
      return p.parentElement!.querySelector("[data-copy-code]")!.getBoundingClientRect().x;
    });
  const before = await copyX();
  await wide.nth(index).evaluate((p) => (p.scrollLeft = 200));
  expect(await copyX()).toBe(before);
});

test("sigue funcionando después de navegar con ClientRouter", async ({ page }) => {
  await page.goto(SECTION);
  // Sin ratón: en móvil esta lección desborda por una tabla, y la vista escalada desvía el clic
  await page.locator(`a[rel="prev"][href="${PREV_SECTION}"]`).dispatchEvent("click");
  await expect(page).toHaveURL(PREV_SECTION);

  const button = blocks(page).first();
  await button.click();
  await expect(button).toHaveAttribute("data-state", "copied");
  expect((await clipboard(page)).length).toBeGreaterThan(0);
});

test("también en los bloques de la evaluación, que pinta React", async ({ page }) => {
  for (const id of Array.from({ length: 8 }, (_, i) => `B1.${i + 1}`)) {
    expect((await api(page).put(`/api/progress/${id}`)).status()).toBe(204);
  }
  await page.goto("/cursos/typescript-desde-cero/evaluacion");

  const button = page.locator("[data-copy-code]");
  await expect(button).toHaveCount(1);
  await button.click();
  await expect(button).toHaveAttribute("data-state", "copied");
  expect(await clipboard(page)).toBe(
    (await page.locator("fieldset pre code").textContent())?.trimEnd(),
  );
});
