import { expect, registerUser, test } from "./fixtures";

test.describe("buscador del temario", () => {
  test.beforeEach(async ({ page }) => {
    await registerUser(page);
    await page.goto("/temario");
  });

  test("busca sin distinguir mayúsculas, resalta y navega a la sección", async ({ page }) => {
    const searches: string[] = [];
    page.on("request", (r) => {
      if (r.url().includes("/api/search")) searches.push(new URL(r.url()).searchParams.get("q")!);
    });

    const input = page.getByRole("combobox", { name: "Buscar en los cursos" });
    await input.pressSequentially("GETSTATICPATHS", { delay: 40 });
    await expect(page.getByText("Buscando…").first()).toBeVisible();

    const options = page.getByRole("option");
    await expect(options.first()).toBeVisible();
    // El debounce agrupa las pulsaciones: una sola petición con el texto completo
    expect(searches).toEqual(["GETSTATICPATHS"]);
    await expect(options.first().locator("mark").first()).toHaveText(/getStaticPaths/i);

    const href = await options.first().getByRole("link").getAttribute("href");
    await options.first().click();
    await expect(page).toHaveURL(href!);
  });

  test("con el teclado: flechas y Enter", async ({ page }) => {
    const input = page.getByRole("combobox", { name: "Buscar en los cursos" });
    await input.fill("hidratación");
    await expect(page.getByRole("option").first()).toBeVisible();
    await input.press("ArrowDown");
    await expect(page.getByRole("option").first()).toHaveAttribute("aria-selected", "true");
    const href = await page.getByRole("option").first().getByRole("link").getAttribute("href");
    await input.press("Enter");
    await expect(page).toHaveURL(href!);
  });

  test("sin coincidencias muestra el estado vacío, y Escape cierra", async ({ page }) => {
    const input = page.getByRole("combobox", { name: "Buscar en los cursos" });
    await input.fill("zxqwvj");
    await expect(page.getByText('No se encontraron resultados para "zxqwvj".')).toBeVisible();
    await input.press("Escape");
    await expect(page.getByText('No se encontraron resultados para "zxqwvj".')).toBeHidden();
    await expect(input).toHaveAttribute("aria-expanded", "false");
  });

  test("la API exige sesión", async ({ page }) => {
    await page.context().clearCookies();
    const res = await page.request.get("/api/search?q=astro");
    expect(res.status()).toBe(401);
  });
});
