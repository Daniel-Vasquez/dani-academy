import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect, registerUser, test } from "./fixtures";

// B1.1: sin tablas ni código largo, así que a 390 px no tiene el scroll horizontal previo
// de otras lecciones (planificación, Tanda 11 §11.0) y el test mide solo el del panel
const SECTION = "/cursos/typescript-desde-cero/01-que-es-typescript";

const panel = (page: Page) => page.locator("[data-notes-panel]");
const opener = (page: Page) => page.locator("[data-notes-open]");

/** Estado del panel tal como lo ve el navegador */
const panelState = (page: Page) =>
  panel(page).evaluate((d: HTMLDialogElement) => {
    const r = d.getBoundingClientRect();
    return {
      open: d.open,
      modal: d.matches(":modal"),
      display: getComputedStyle(d).display,
      top: Math.round(r.top),
      right: Math.round(window.innerWidth - r.right),
      bottom: Math.round(window.innerHeight - r.bottom),
      width: Math.round(r.width),
    };
  });

const hasHorizontalScroll = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

test.describe("escritorio", () => {
  test.skip(({ isMobile }) => isMobile, "Anchos de escritorio: basta con un proyecto");

  test("tres columnas desde xl, con la lección a su ancho de lectura", async ({ page }) => {
    await registerUser(page);
    // CLS acumulado desde el primer fotograma de cada carga
    await page.addInitScript(() => {
      const w = window as unknown as { __cls: number };
      w.__cls = 0;
      new PerformanceObserver((list) => {
        for (const e of list.getEntries() as unknown as {
          value: number;
          hadRecentInput: boolean;
        }[])
          if (!e.hadRecentInput) w.__cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
    });

    for (const [width, minArticle] of [
      [1280, 600],
      [1440, 680],
      [1536, 680],
    ] as const) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(SECTION);
      const state = await panelState(page);
      expect(state, `${width}px`).toMatchObject({ open: true, modal: false });
      expect(state.display).not.toBe("none");
      await expect(opener(page)).toBeHidden();
      const article = await page
        .locator("article")
        .evaluate((a) => a.getBoundingClientRect().width);
      expect(article, `${width}px: ancho de la lección`).toBeGreaterThanOrEqual(minArticle);
      expect(await hasHorizontalScroll(page), `${width}px`).toBe(false);
      await page.waitForTimeout(300);
      const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
      expect(cls, `${width}px: CLS`).toBeLessThan(0.001);
    }
  });

  test("la columna de notas se queda fija al bajar", async ({ page }) => {
    await registerUser(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(SECTION);
    await page.evaluate(() => window.scrollTo(0, 4000));
    await expect.poll(async () => (await panelState(page)).top).toBe(56);
  });

  test("entre lg y xl es un panel lateral, y al ensanchar vuelve a ser columna", async ({
    page,
  }) => {
    await registerUser(page);
    await page.setViewportSize({ width: 1100, height: 900 });
    await page.goto(SECTION);
    await expect(panel(page)).toBeHidden();

    await opener(page).click();
    expect(await panelState(page)).toMatchObject({ modal: true, right: 0, width: 384 });

    await page.setViewportSize({ width: 1440, height: 900 });
    await expect.poll(async () => (await panelState(page)).modal).toBe(false);
    expect(await panelState(page)).toMatchObject({ open: true });
    await expect(panel(page)).toBeVisible();
  });
});

test.describe("móvil", () => {
  test.skip(({ isMobile }) => !isMobile, "Hoja inferior: proyecto móvil");

  test("el botón abre una hoja inferior modal; Escape y Cerrar la cierran", async ({ page }) => {
    await registerUser(page);
    await page.goto(SECTION);
    await expect(panel(page)).toBeHidden();
    await expect(opener(page)).toBeVisible();
    expect(await hasHorizontalScroll(page)).toBe(false);
    // Al cargar, el script cierra el panel que pintó el servidor: eso no debe robar el foco
    await page.waitForTimeout(200);
    await expect(opener(page)).not.toBeFocused();

    await opener(page).click();
    const state = await panelState(page);
    expect(state).toMatchObject({ modal: true, bottom: 0 });
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe(
      "hidden",
    );
    await expect(page.getByRole("heading", { name: "Mis notas" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(panel(page)).toBeHidden();
    await expect(opener(page)).toBeFocused();

    await opener(page).click();
    await page.getByRole("button", { name: "Cerrar" }).click();
    await expect(panel(page)).toBeHidden();
    await expect(opener(page)).toBeFocused();
  });

  test("con la hoja abierta no hay infracciones WCAG A/AA", async ({ page }) => {
    await registerUser(page);
    await page.goto(SECTION);
    await opener(page).click();
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(violations.map((v) => v.id)).toEqual([]);
  });
});

test("la portada del curso y la evaluación no tienen panel de notas", async ({ page }) => {
  await registerUser(page);
  for (const path of [
    "/cursos/typescript-desde-cero",
    "/cursos/typescript-desde-cero/evaluacion",
  ]) {
    await page.goto(path);
    await expect(panel(page), path).toHaveCount(0);
    await expect(opener(page), path).toHaveCount(0);
  }
});
