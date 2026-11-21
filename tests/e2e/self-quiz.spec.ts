import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { api, expect, registerUser, test } from "./fixtures";

const REFLEXION =
  "En mi proyecto, el día de cada tarea se guarda como texto AAAA-MM-DD, y lo explica el ADR 0001.";

async function leerTodoP1(page: Page) {
  for (let n = 1; n <= 8; n++) {
    expect((await api(page).put(`/api/progress/P1.${n}`)).status()).toBe(204);
  }
}

async function sinInfracciones(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(violations.map((v) => v.id)).toEqual([]);
}

test("la autoevaluación de P1: escribir, ver la rúbrica, valorar y aprobar con 4/5", async ({
  page,
}) => {
  await registerUser(page);
  await leerTodoP1(page);
  await page.goto("/cursos/proyecto-integrador");
  await expect(page.getByText("preguntas abiertas sobre tu proyecto")).toBeVisible();

  await page.goto("/cursos/proyecto-integrador/evaluacion");
  await sinInfracciones(page);
  const verRubrica = page.getByRole("button", { name: "Ver la rúbrica" });

  for (let i = 0; i < 5; i++) {
    await expect(page.getByText(`Pregunta ${i + 1} de 5`)).toBeVisible();
    await page.getByLabel("Tu respuesta").fill("Muy corta");
    await expect(verRubrica).toBeDisabled();
    await page.getByLabel("Tu respuesta").fill(REFLEXION);
    await verRubrica.click();
    await expect(page.getByText("Una buena respuesta…")).toBeVisible();
    if (i === 0) await sinInfracciones(page);
    const veredicto = i === 2 ? "No los cumple todos" : "Cumple todos los puntos";
    await page.getByRole("radio", { name: veredicto }).check();
    await page.getByRole("button", { name: i === 4 ? "Enviar valoración" : "Siguiente →" }).click();
  }

  await expect(page.getByRole("heading", { name: "¡Aprobado! · 4/5" })).toBeVisible();
  await expect(page.getByText(REFLEXION)).toHaveCount(5); // las respuestas siguen ahí para copiarlas

  await page.goto("/cursos/proyecto-integrador");
  await expect(page.getByText("Aprobada · 4/5")).toBeVisible();
});

test("en la autoevaluación, el servidor solo acepta 0 y 1", async ({ page }) => {
  await registerUser(page);
  await leerTodoP1(page);
  const res = await api(page).post("/_actions/submitQuiz", {
    courseId: "P1",
    answers: [1, 1, 1, 1, 3],
  });
  expect(res.status()).toBe(400);
  expect(await res.json()).toMatchObject({
    code: "BAD_REQUEST",
    message: "Cada respuesta tiene que ser 1 (cumple) o 0 (no cumple)",
  });
});
