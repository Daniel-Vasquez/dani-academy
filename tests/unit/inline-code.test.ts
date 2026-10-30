import { readdirSync, readFileSync } from "node:fs";
import { parse } from "yaml";
import { describe, expect, it } from "vitest";
import { splitInline } from "@/lib/inline-code";

const code = (text: string) => ({ code: true, text });
const plain = (text: string) => ({ code: false, text });

describe("splitInline", () => {
  it("convierte `texto` en código y deja el resto como texto", () => {
    expect(splitInline("Usa `const` y `let`.")).toEqual([
      plain("Usa "),
      code("const"),
      plain(" y "),
      code("let"),
      plain("."),
    ]);
  });

  it("con dos acentos graves, el código puede contener acentos graves", () => {
    expect(splitInline("El tipo `` `get${K}` `` añade el prefijo")).toEqual([
      plain("El tipo "),
      code("`get${K}`"),
      plain(" añade el prefijo"),
    ]);
  });

  it("solo cierra con el mismo número de acentos graves", () => {
    expect(splitInline("``a ` b`` y `c`")).toEqual([code("a ` b"), plain(" y "), code("c")]);
  });

  it("quita un espacio a cada lado solo si los dos lados lo tienen", () => {
    expect(splitInline("` x `")).toEqual([code("x")]);
    expect(splitInline("` x`")).toEqual([code(" x")]);
    expect(splitInline("`  `")).toEqual([code("  ")]);
  });

  it("unos acentos sin cierre se quedan como texto", () => {
    expect(splitInline("una plantilla ` sin cerrar")).toEqual([
      plain("una plantilla ` sin cerrar"),
    ]);
    expect(splitInline("`` abre dos y cierra uno `")).toEqual([
      plain("`` abre dos y cierra uno `"),
    ]);
  });

  it("la explicación de la pregunta 2 de A1 sale con su código entero", () => {
    const parts = splitInline(
      "En A1.2, `` [K in keyof T as `get${Capitalize<string & K>}`] `` convierte minutos en getMinutos, y `T[K] extends V ? K : never` filtra",
    );
    expect(parts.filter((p) => p.code).map((p) => p.text)).toEqual([
      "[K in keyof T as `get${Capitalize<string & K>}`]",
      "T[K] extends V ? K : never",
    ]);
    expect(parts.some((p) => !p.code && p.text.includes("`"))).toBe(false);
  });

  it("ningún texto de las evaluaciones deja un acento grave suelto", () => {
    const textos = readdirSync("src/content/quizzes")
      .filter((f) => f.endsWith(".yaml"))
      .flatMap((f) => {
        const quiz = parse(readFileSync(`src/content/quizzes/${f}`, "utf8")) as {
          questions: { prompt: string; options?: string[]; explanation?: string }[];
        };
        return quiz.questions.flatMap((q) => [q.prompt, ...(q.options ?? []), q.explanation ?? ""]);
      });
    const sueltos = textos.filter((t) =>
      splitInline(t).some((p) => !p.code && p.text.includes("`")),
    );
    expect(sueltos).toEqual([]);
    expect(textos.length).toBeGreaterThan(400);
  });
});
