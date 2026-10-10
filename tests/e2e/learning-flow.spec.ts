import { api, expect, registerUser, test } from "./fixtures";

const B1_SECTIONS = Array.from({ length: 8 }, (_, i) => `B1.${i + 1}`);
const B1_ANSWERS = [1, 2, 0, 3, 1]; // claves de src/content/quizzes/b1.yaml

test("registro → leer → evaluación → progreso", async ({ page }) => {
  await registerUser(page);

  // Una sección por la interfaz…
  await page.goto("/cursos/typescript-desde-cero");
  await page.getByRole("link", { name: "Empezar curso" }).click();
  await page.getByRole("button", { name: "Marcar como leído" }).click();
  await expect(page.getByRole("button", { name: "Leído" })).toHaveAttribute("aria-pressed", "true");

  // …y el resto por la API, con la misma cookie de sesión
  for (const id of B1_SECTIONS.slice(1)) {
    expect((await api(page).put(`/api/progress/${id}`)).status()).toBe(204);
  }

  await page.goto("/cursos/typescript-desde-cero/evaluacion");
  for (const [i, answer] of B1_ANSWERS.entries()) {
    await page.getByRole("radio").nth(answer).check();
    await page
      .getByRole("button", {
        name: i === B1_ANSWERS.length - 1 ? "Enviar respuestas" : "Siguiente →",
      })
      .click();
  }
  await expect(page.getByRole("heading", { name: /¡Aprobado! · 5\/5/ })).toBeVisible();

  await page.goto("/progreso");
  await expect(page.getByText(/^8\/\d+ secciones$/)).toBeVisible();
});

test("la evaluación está bloqueada hasta leer todas las secciones", async ({ page }) => {
  await registerUser(page);
  const res = await api(page).post("/_actions/submitQuiz", { courseId: "B1", answers: B1_ANSWERS });
  expect(res.status()).toBe(403);
  expect(await res.json()).toMatchObject({
    code: "FORBIDDEN",
    message: "Te faltan 8 secciones por leer",
  });
});

test("la undécima evaluación en una hora devuelve TOO_MANY_REQUESTS", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "Prueba de API: basta con un proyecto");
  await registerUser(page);
  for (const id of B1_SECTIONS) {
    expect((await api(page).put(`/api/progress/${id}`)).status()).toBe(204);
  }

  const statuses: number[] = [];
  let lastBody: unknown;
  for (let i = 0; i < 11; i++) {
    const res = await api(page).post("/_actions/submitQuiz", {
      courseId: "B1",
      answers: B1_ANSWERS,
    });
    statuses.push(res.status());
    lastBody = await res.json();
  }
  expect(statuses).toEqual([...Array(10).fill(200), 429]);
  expect(lastBody).toMatchObject({ code: "TOO_MANY_REQUESTS" });
});
