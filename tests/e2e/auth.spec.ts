import { api, expect, PASSWORD, registerUser, signOut, test } from "./fixtures";

test("registro, cierre de sesión e inicio de sesión", async ({ page }) => {
  const email = await registerUser(page);

  await signOut(page);

  await page.getByLabel("Correo").fill(email);
  await page.getByLabel("Contraseña").fill(PASSWORD);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/temario$/);
});

test("una contraseña incorrecta muestra un error genérico", async ({ page }) => {
  const email = await registerUser(page);
  await signOut(page);

  await page.getByLabel("Correo").fill(email);
  await page.getByLabel("Contraseña").fill("no-es-la-contraseña");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByText("Correo o contraseña incorrectos.")).toBeVisible();
});

test("más de 5 intentos de login en un minuto devuelven 429", async ({ page }) => {
  await page.goto("/login");
  const statuses: number[] = [];
  for (let i = 0; i < 6; i++) {
    const res = await api(page).post("/api/auth/sign-in/email", {
      email: "nadie@e2e.test",
      password: "intento-de-fuerza-bruta",
    });
    statuses.push(res.status());
  }
  expect(statuses).toEqual([401, 401, 401, 401, 401, 429]);

  // Y el formulario lo explica en lugar de decir "contraseña incorrecta"
  await page.getByLabel("Correo").fill("nadie@e2e.test");
  await page.getByLabel("Contraseña").fill("intento-de-fuerza-bruta");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByText(/Demasiados intentos/)).toBeVisible();
});
