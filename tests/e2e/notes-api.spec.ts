import type { Page } from "@playwright/test";
import { expect, registerUser, test } from "./fixtures";

const NOTE_URL = "/api/notes/B1.1";

const doc = (text: string, marks?: unknown[]) => ({
  type: "doc",
  content: [{ type: "paragraph", content: [{ type: "text", text, ...(marks ? { marks } : {}) }] }],
});

/** PUT con la cookie de la página y su Origin, como lo enviaría el editor */
function put(page: Page, body: unknown, headers: Record<string, string> = {}, url = NOTE_URL) {
  return page.request.put(url, {
    headers: {
      origin: new URL(page.url()).origin,
      "content-type": "application/json",
      ...headers,
    },
    data: typeof body === "string" ? body : JSON.stringify(body),
  });
}

test.describe("API de notas", () => {
  test.skip(({ isMobile }) => isMobile, "Prueba de API: basta con un proyecto");

  test("crear, actualizar, conflicto y borrar al vaciar", async ({ page }) => {
    await registerUser(page);

    expect(await (await page.request.get(NOTE_URL)).json()).toEqual({
      doc: null,
      rev: 0,
      updatedAt: null,
    });

    const created = await put(page, { doc: doc("Primera nota"), rev: 0 });
    expect(created.status()).toBe(200);
    expect(await created.json()).toMatchObject({ rev: 1 });

    const updated = await put(page, { doc: doc("Segunda versión"), rev: 1 });
    expect(await updated.json()).toMatchObject({ rev: 2 });

    // Otra pestaña con la versión 1: no sobrescribe y recibe la nota actual
    const stale = await put(page, { doc: doc("Desde otra pestaña"), rev: 1 });
    expect(stale.status()).toBe(409);
    expect(await stale.json()).toMatchObject({ current: { doc: doc("Segunda versión"), rev: 2 } });

    expect(await (await page.request.get(NOTE_URL)).json()).toMatchObject({
      doc: doc("Segunda versión"),
      rev: 2,
    });

    // Vaciarla la borra: vuelve a no existir
    const empty = await put(page, {
      doc: { type: "doc", content: [{ type: "paragraph" }] },
      rev: 2,
    });
    expect(await empty.json()).toEqual({ rev: 0, updatedAt: null });
    expect(await (await page.request.get(NOTE_URL)).json()).toMatchObject({ doc: null, rev: 0 });
  });

  test("rechaza lo que no es una nota válida", async ({ page }) => {
    await registerUser(page);
    const cases: [string, Promise<{ status(): number }>, number][] = [
      [
        "otro origen",
        put(page, { doc: doc("x"), rev: 0 }, { origin: "https://evil.example" }),
        403,
      ],
      ["sin JSON", put(page, "texto", { "content-type": "text/plain" }), 400],
      ["JSON roto", put(page, "{"), 400],
      [
        "color fuera de la paleta",
        put(page, { doc: doc("x", [{ type: "tono", attrs: { tono: "#f00" } }]), rev: 0 }),
        400,
      ],
      [
        "enlace",
        put(page, {
          doc: doc("x", [{ type: "link", attrs: { href: "javascript:alert(1)" } }]),
          rev: 0,
        }),
        400,
      ],
      [
        "imagen",
        put(page, {
          doc: { type: "doc", content: [{ type: "image", attrs: { src: "x" } }] },
          rev: 0,
        }),
        400,
      ],
      ["rev negativa", put(page, { doc: doc("x"), rev: -1 }), 400],
      ["ID mal formado", put(page, { doc: doc("x"), rev: 0 }, {}, "/api/notes/B1"), 400],
      ["más de 60 000 bytes", put(page, { doc: doc("a".repeat(70_000)), rev: 0 }), 413],
      ["más de 10 000 caracteres", put(page, { doc: doc("a".repeat(11_000)), rev: 0 }), 413],
      ["sección inexistente", put(page, { doc: doc("x"), rev: 0 }, {}, "/api/notes/B1.99"), 404],
    ];
    for (const [name, response, expected] of cases) {
      expect((await response).status(), name).toBe(expected);
    }
  });

  test("sin sesión responde 401", async ({ page, baseURL }) => {
    expect((await page.request.get(`${baseURL}${NOTE_URL}`)).status()).toBe(401);
    const res = await page.request.put(`${baseURL}${NOTE_URL}`, {
      headers: { origin: baseURL!, "content-type": "application/json" },
      data: JSON.stringify({ doc: doc("x"), rev: 0 }),
    });
    expect(res.status()).toBe(401);
  });

  test("cada persona solo ve su nota de la sección", async ({ browser }) => {
    // Cada una con su IP, como el fixture: el registro está limitado por IP
    const newPage = async (ip: string) =>
      (await browser.newContext({ extraHTTPHeaders: { "x-forwarded-for": ip } })).newPage();
    const alice = await newPage("10.250.0.1");
    await registerUser(alice);
    expect((await put(alice, { doc: doc("Nota privada"), rev: 0 })).status()).toBe(200);

    const bob = await newPage("10.250.0.2");
    await registerUser(bob);
    // Misma sección, misma URL: Bob recibe la suya (vacía), nunca la de Alice
    expect(await (await bob.request.get(NOTE_URL)).json()).toMatchObject({ doc: null, rev: 0 });
    // Y escribir con la rev de Alice no toca su nota: para Bob, la nota no existe
    expect((await put(bob, { doc: doc("De Bob"), rev: 1 })).status()).toBe(409);
    expect(await (await alice.request.get(NOTE_URL)).json()).toMatchObject({
      doc: doc("Nota privada"),
    });
  });

  test("más de 60 guardados por minuto responde 429 con Retry-After", async ({ page }) => {
    await registerUser(page);
    // La ventana es fija: si el test cruza el cambio de minuto, el contador vuelve a 0 y el
    // primer 429 llega más tarde. Por eso se repite hasta verlo, con un tope
    let accepted = 0;
    let retryAfter: string | undefined;
    for (let i = 0; i < 130 && !retryAfter; i++) {
      const res = await put(page, { doc: doc(`versión ${i}`), rev: 0 });
      if (res.status() === 429) retryAfter = res.headers()["retry-after"];
      else accepted++;
    }
    expect(accepted).toBeGreaterThanOrEqual(60);
    expect(Number(retryAfter)).toBeGreaterThan(0);
  });
});
