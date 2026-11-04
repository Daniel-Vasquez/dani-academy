import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect, registerUser, test } from "./fixtures";

const SECTION = "/cursos/typescript-desde-cero/01-que-es-typescript";
const NEXT = "/cursos/typescript-desde-cero/02-tipos-primitivos-e-inferencia";

const toggle = (page: Page, name: string) => page.getByRole("button", { name, exact: true });
const mainWidth = (page: Page) =>
  page.locator("#contenido").evaluate((m) => m.getBoundingClientRect().width);
const articleWidth = (page: Page) =>
  page.locator("article").evaluate((a) => a.getBoundingClientRect().width);
const sidebarWidth = (page: Page) =>
  page.locator("#temario").evaluate((s) => s.getBoundingClientRect().width);
const stored = (page: Page) => page.evaluate(() => localStorage.getItem("da-sidebar"));

test.describe("escritorio", () => {
  test.skip(({ isMobile }) => isMobile, "El índice lateral solo existe en escritorio");

  test.beforeEach(async ({ page }) => {
    await registerUser(page);
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test("ocultar da el espacio a la lección, y mostrar lo devuelve", async ({ page }) => {
    await page.goto(SECTION);
    const open = { main: await mainWidth(page), article: await articleWidth(page) };

    await expect(toggle(page, "Ocultar temario")).toHaveAttribute("aria-expanded", "true");
    await toggle(page, "Ocultar temario").click();

    await expect(toggle(page, "Mostrar temario")).toHaveAttribute("aria-expanded", "false");
    await expect.poll(() => sidebarWidth(page)).toBe(0);
    await expect.poll(() => mainWidth(page)).toBe(open.main + 240); // los 15rem de la columna
    expect(await articleWidth(page)).toBeGreaterThan(open.article + 200);
    expect(await stored(page)).toBe("closed");

    await toggle(page, "Mostrar temario").click();
    await expect.poll(() => mainWidth(page)).toBe(open.main);
    await expect.poll(() => articleWidth(page)).toBe(open.article);
    expect(await stored(page)).toBe("open");
  });

  test("el cambio se anima, sin saltar de golpe", async ({ page }) => {
    await page.goto(SECTION);
    const start = await mainWidth(page);
    await toggle(page, "Ocultar temario").click();
    await page.waitForTimeout(120);
    const during = await mainWidth(page);
    expect(during).toBeGreaterThan(start);
    expect(during).toBeLessThan(start + 240);
  });

  test("cerrado, el temario sale del teclado y el botón sigue a mano", async ({ page }) => {
    await page.goto(SECTION);
    await toggle(page, "Ocultar temario").click();
    await expect(page.locator("#temario")).toBeHidden();
    await expect(toggle(page, "Mostrar temario")).toBeInViewport();
    await expect
      .poll(() => toggle(page, "Mostrar temario").boundingBox())
      .toMatchObject({
        x: 24, // termina de moverse en el hueco, sin salirse por el borde
        width: 28,
        height: 28,
      });

    await page.evaluate(() => window.scrollTo(0, 1500));
    await expect(toggle(page, "Mostrar temario")).toBeInViewport();

    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(violations.map((v) => v.id)).toEqual([]);

    await toggle(page, "Mostrar temario").focus();
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => document.activeElement?.closest("#temario") !== null);
    expect(focused).toBe(false);
  });

  test("al recargar sigue cerrado desde el primer pintado, sin saltos", async ({ page }) => {
    await page.goto(SECTION);
    await toggle(page, "Ocultar temario").click();
    await expect.poll(() => sidebarWidth(page)).toBe(0);

    // Ancho de la columna en cuanto existe, antes de que React llegue a hidratar el botón
    await page.addInitScript(() => {
      const w = window as unknown as { __shift: number; __first: number | null };
      w.__shift = 0;
      w.__first = null;
      new MutationObserver((_, observer) => {
        const sidebar = document.querySelector("#temario");
        if (!sidebar) return;
        w.__first = sidebar.getBoundingClientRect().width;
        observer.disconnect();
      }).observe(document, { childList: true, subtree: true });
      new PerformanceObserver((list) => {
        for (const e of list.getEntries() as unknown as { value: number }[]) w.__shift += e.value;
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.reload();
    await expect(toggle(page, "Mostrar temario")).toHaveAttribute("aria-expanded", "false");
    await page.waitForTimeout(400);

    const { first, shift } = await page.evaluate(() => {
      const w = window as unknown as { __shift: number; __first: number | null };
      return { first: w.__first, shift: w.__shift };
    });
    expect(first).toBe(0);
    expect(shift).toBeLessThan(0.001);
  });

  test("se conserva al cambiar de sección y de tema", async ({ page }) => {
    await page.goto(SECTION);
    await toggle(page, "Ocultar temario").click();
    await expect.poll(() => sidebarWidth(page)).toBe(0);

    await page.locator(`a[rel="next"][href="${NEXT}"]`).click();
    await expect(page).toHaveURL(NEXT);
    await expect(toggle(page, "Mostrar temario")).toHaveAttribute("aria-expanded", "false");
    expect(await sidebarWidth(page)).toBe(0);

    await page.locator("[data-theme-toggle]").click();
    expect(await page.locator("html").getAttribute("data-sidebar")).toBe("closed");
    expect(await sidebarWidth(page)).toBe(0);
  });

  test("también en la portada del curso, sin columna de notas", async ({ page }) => {
    await page.goto("/cursos/typescript-desde-cero");
    const open = await mainWidth(page);
    await toggle(page, "Ocultar temario").click();
    await expect.poll(() => mainWidth(page)).toBe(open + 288); // los 18rem de la columna
  });
});

test("en móvil no hay botón: el índice sigue siendo el desplegable", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Solo móvil");
  await registerUser(page);
  await page.goto(SECTION);
  await expect(page.getByRole("button", { name: "Ocultar temario" })).toBeHidden();
  await expect(page.getByText("Índice del curso")).toBeVisible();
});
