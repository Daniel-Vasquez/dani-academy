import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { api, expect, registerUser, test } from "./fixtures";

const THEMES = ["light", "dark"] as const;

async function expectNoViolations(page: Page, path: string) {
  for (const theme of THEMES) {
    await page.evaluate((t) => localStorage.setItem("da-theme", t), theme);
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`),
      `${path} (${theme})`,
    ).toEqual([]);
  }
}

test("páginas públicas sin infracciones WCAG A/AA (claro y oscuro)", async ({ page }) => {
  await page.goto("/login");
  for (const path of ["/login", "/registro"]) await expectNoViolations(page, path);
});

test("páginas privadas sin infracciones WCAG A/AA (claro y oscuro)", async ({ page }) => {
  await registerUser(page);
  for (const id of Array.from({ length: 8 }, (_, i) => `B1.${i + 1}`)) {
    expect((await api(page).put(`/api/progress/${id}`)).status()).toBe(204);
  }
  for (const path of [
    "/temario",
    "/cursos/typescript-desde-cero",
    "/cursos/typescript-desde-cero/06-uniones-y-narrowing",
    "/cursos/typescript-desde-cero/evaluacion",
    "/progreso",
  ]) {
    await expectNoViolations(page, path);
  }
});
