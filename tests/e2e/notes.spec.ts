import type { Page } from "@playwright/test";
import { expect, registerUser, test } from "./fixtures";

const SECTION = "/cursos/typescript-desde-cero/01-que-es-typescript";
const NEXT_SECTION = "/cursos/typescript-desde-cero/02-tipos-primitivos-e-inferencia";

const editor = (page: Page) => page.locator(".ProseMirror");
const status = (page: Page) => page.locator("[data-notes-status]");
const isEditorFile = (url: string) => /NotesEditor|@tiptap|prosemirror/i.test(url);

/**
 * Teclas a ritmo humano. A la velocidad de la automatización, ProseMirror a veces no ha leído
 * aún la selección del DOM cuando llega el clic (medido: 2 fallos de 4 sin retardo, 0 de 8 con él)
 */
async function selectWord(page: Page, start: number, length: number) {
  await page.waitForTimeout(200);
  await page.keyboard.press("Home");
  for (let i = 0; i < start; i++) await page.keyboard.press("ArrowRight", { delay: 30 });
  await page.keyboard.down("Shift");
  for (let i = 0; i < length; i++) await page.keyboard.press("ArrowRight", { delay: 30 });
  await page.keyboard.up("Shift");
}

/**
 * Errores de consola y de página durante el test. Si aparece un 504 "Outdated Optimize Dep",
 * falta una dependencia en optimizeDeps.include (astro.config.mjs)
 */
function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  return errors;
}

test.describe("escritorio", () => {
  test.skip(({ isMobile }) => isMobile, "Editor en la columna: proyecto de escritorio");
  test.beforeEach(async ({ page }) => page.setViewportSize({ width: 1440, height: 900 }));

  test("formatear, guardar solo y recuperar la nota al recargar", async ({ page, browser }) => {
    const errors = collectErrors(page);
    await registerUser(page);
    await page.goto(SECTION);

    await editor(page).click();
    await page.keyboard.type("Repasar la pirámide de tests", { delay: 10 });
    await selectWord(page, 11, 8); // "pirámide"
    await page.getByRole("button", { name: "Negrita" }).click();
    await page.getByRole("button", { name: "Color rojo" }).click();
    await expect(page.getByRole("button", { name: "Color rojo" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(status(page)).toContainText("Guardado");

    // Sin JavaScript: la vista previa del servidor ya trae el formato
    const noJs = await browser.newContext({
      javaScriptEnabled: false,
      storageState: await page.context().storageState(),
    });
    const preview = await noJs.newPage();
    await preview.goto(SECTION);
    await expect(
      preview.locator('[data-notes-panel] strong span[data-tono="rojo"]', { hasText: "pirámide" }),
    ).toHaveCount(1);
    await noJs.close();

    // Con JavaScript: el editor carga la misma nota sin mover nada
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
    await page.reload();
    const word = editor(page).locator('strong [data-tono="rojo"]', { hasText: "pirámide" });
    await expect(word).toHaveCount(1);
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => (window as unknown as { __cls: number }).__cls)).toBeLessThan(
      0.001,
    );

    // El tono cambia con el tema
    const colors: string[] = [];
    for (const theme of ["light", "dark"]) {
      await page.evaluate((t) => localStorage.setItem("da-theme", t), theme);
      await page.reload();
      colors.push(await word.evaluate((e) => getComputedStyle(e).color));
    }
    expect(colors[0]).not.toBe(colors[1]);

    expect(errors).toEqual([]);
  });

  test("dos pestañas: la que va por detrás ve el conflicto y elige", async ({ page, context }) => {
    await registerUser(page);
    const other = await context.newPage();
    await other.setViewportSize({ width: 1440, height: 900 });
    await page.goto(SECTION);
    await other.goto(SECTION);
    await expect(editor(other)).toBeVisible();

    await page.bringToFront();
    await editor(page).click();
    await page.keyboard.type("Desde la pestaña A", { delay: 10 });
    await expect(status(page)).toContainText("Guardado");

    await other.bringToFront();
    await editor(other).click();
    await other.keyboard.type("Desde la pestaña B", { delay: 10 });
    await expect(other.getByRole("alert")).toContainText("otra pestaña");
    await other.getByRole("button", { name: "Conservar la mía" }).click();
    await expect(status(other)).toContainText("Guardado");

    const saved = await (await page.request.get("/api/notes/B1.1")).json();
    expect(JSON.stringify(saved.doc)).toContain("pestaña B");
    expect(JSON.stringify(saved.doc)).not.toContain("pestaña A");
  });

  test("lo escrito justo antes de navegar a otra sección se guarda", async ({ page }) => {
    await registerUser(page);
    await page.goto(SECTION);
    await editor(page).click();
    await page.keyboard.type("Antes de navegar", { delay: 10 });
    // Sin esperar al guardado: la navegación con View Transitions lo envía
    await page.locator(`article footer a[href="${NEXT_SECTION}"]`).click();
    await expect(page).toHaveURL(NEXT_SECTION);

    await expect
      .poll(async () =>
        JSON.stringify((await (await page.request.get("/api/notes/B1.1")).json()).doc),
      )
      .toContain("Antes de navegar");
    // El panel de la sección nueva es suyo y está vacío
    await expect(page.locator("#notas-titulo + p")).toHaveText("Tipos primitivos e inferencia");
    await expect(editor(page)).toHaveText("");
  });
});

test.describe("móvil", () => {
  test.skip(({ isMobile }) => !isMobile, "Hoja inferior: proyecto móvil");

  test("el editor no se descarga hasta abrir la hoja, y entonces carga la nota", async ({
    page,
  }) => {
    const errors = collectErrors(page);
    await registerUser(page);
    expect(
      (
        await page.request.put("/api/notes/B1.1", {
          headers: { origin: new URL(page.url()).origin, "content-type": "application/json" },
          data: JSON.stringify({
            doc: {
              type: "doc",
              content: [{ type: "paragraph", content: [{ type: "text", text: "Nota del móvil" }] }],
            },
            rev: 0,
          }),
        })
      ).status(),
    ).toBe(200);

    const requested: string[] = [];
    page.on("request", (r) => {
      if (isEditorFile(r.url())) requested.push(r.url());
    });
    await page.goto(SECTION);
    await expect(page.locator("[data-notes-open]")).toHaveAttribute("data-has-note", "");
    await page.waitForTimeout(1500); // tiempo de sobra para client:idle
    expect(requested, "archivos del editor antes de abrir la hoja").toEqual([]);

    await page.locator("[data-notes-open]").click();
    await expect(editor(page)).toHaveText("Nota del móvil");
    expect(requested.length).toBeGreaterThan(0);
    expect(errors).toEqual([]);
  });
});
