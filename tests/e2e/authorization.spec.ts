import { expect, PASSWORD, registerUser, signOut, test } from "./fixtures";

test("sin sesión, las páginas privadas redirigen al login conservando la ruta", async ({
  page,
}) => {
  await page.goto("/temario");
  await expect(page).toHaveURL(/\/login\?redirect=%2Ftemario$/);
});

test("sin sesión, la API responde 401", async ({ request, baseURL }) => {
  const headers = { origin: baseURL! };
  expect((await request.put("/api/progress/B1.1", { headers })).status()).toBe(401);
  expect(
    (
      await request.post("/api/study-sessions/heartbeat", { headers, data: { sectionId: "B1.1" } })
    ).status(),
  ).toBe(401);
});

test("una petición de otro origen se rechaza aunque haya sesión (CSRF)", async ({ page }) => {
  await registerUser(page);
  const res = await page.request.put("/api/progress/B1.1", {
    headers: { origin: "https://evil.example" },
  });
  expect(res.status()).toBe(403);
});

test("un redirect externo tras el login acaba en el temario (sin open redirect)", async ({
  page,
}) => {
  const email = await registerUser(page);
  await signOut(page);

  await page.goto("/login?redirect=//evil.com");
  await page.getByLabel("Correo").fill(email);
  await page.getByLabel("Contraseña").fill(PASSWORD);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/^http:\/\/localhost:\d+\/temario$/);
});

test("cabeceras de seguridad y caché privada con sesión", async ({ page }) => {
  const publicRes = await page.goto("/login");
  const h = publicRes!.headers();
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["x-frame-options"]).toBe("DENY");
  expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(h["permissions-policy"]).toBe("camera=(), microphone=(), geolocation=()");

  await registerUser(page);
  for (const path of ["/temario", "/progreso", "/cursos/typescript-desde-cero"]) {
    const res = await page.goto(path);
    expect(res!.headers()["cache-control"], path).toBe("private, no-store");
  }
});
