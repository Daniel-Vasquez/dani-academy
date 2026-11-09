import { describe, expect, it } from "vitest";
import {
  buildSearchIndex,
  fold,
  mdxToPlainText,
  normalizeQuery,
  searchIndex,
  type SearchDocument,
} from "@/lib/domain/search";

const doc = (sectionId: string, sectionTitle: string, text: string): SearchDocument => ({
  sectionId,
  sectionTitle,
  courseTitle: "Curso",
  url: `/cursos/curso/${sectionId}`,
  text,
});

const marked = (r: { snippet: { text: string; match: boolean }[] }) =>
  r.snippet.filter((p) => p.match).map((p) => p.text);

describe("fold", () => {
  it("quita mayúsculas y tildes sin cambiar la longitud", () => {
    expect(fold("Configuración ÁRBOL Ñandú")).toBe("configuracion arbol nandu");
    expect(fold("Configuración").length).toBe("Configuración".length);
  });
});

describe("mdxToPlainText", () => {
  it("las marcas de énfasis y de código no dejan espacios sueltos", () => {
    expect(mdxToPlainText("Un `useEffect`, y _la_ **trampa**. | a | b |")).toBe(
      "Un useEffect, y la trampa. a b",
    );
  });

  it("quita imports, etiquetas JSX y marcas de Markdown, pero conserva el código", () => {
    const mdx = [
      'import X from "./x";',
      "## Paso 1: el **esquema**",
      '<Callout type="risk">',
      "- Usa [la guía](https://docs.astro.build) y `getStaticPaths`.",
      "</Callout>",
      "```ts",
      "const a = 1;",
      "```",
    ].join("\n");
    expect(mdxToPlainText(mdx)).toBe(
      "Paso 1: el esquema Usa la guía y getStaticPaths. const a = 1;",
    );
  });
});

describe("normalizeQuery", () => {
  it("exige al menos 2 caracteres y limita la longitud", () => {
    expect(normalizeQuery(" a ")).toBeNull();
    expect(normalizeQuery("  JWT  ")).toBe("jwt");
    expect(normalizeQuery("x".repeat(200))).toHaveLength(80);
  });
});

describe("searchIndex", () => {
  const index = buildSearchIndex([
    doc("A1", "Tipos condicionales", "Los tipos condicionales usan extends."),
    doc("A2", "Índices en MongoDB", "Un índice compuesto acelera la consulta. Otro índice más."),
    doc("A3", "Repaso", "Aquí se menciona un índice una vez."),
  ]);

  it("no distingue mayúsculas ni tildes, y resalta el texto original", () => {
    const [r] = searchIndex(index, "INDICE");
    expect(r?.sectionId).toBe("A2");
    expect(marked(r!)).toEqual(["índice", "índice"]);
  });

  it("pone primero las coincidencias en el título, y luego las más frecuentes", () => {
    expect(searchIndex(index, "índice").map((r) => r.sectionId)).toEqual(["A2", "A3"]);
  });

  it("sin coincidencias, o con una consulta corta, no devuelve nada", () => {
    expect(searchIndex(index, "kubernetes")).toEqual([]);
    expect(searchIndex(index, "a")).toEqual([]);
  });

  it("el fragmento recorta textos largos por palabras y marca los cortes", () => {
    const largo = buildSearchIndex([
      doc("B1", "Largo", `${"palabra ".repeat(40)}objetivo ${"final ".repeat(40)}`),
    ]);
    const [r] = searchIndex(largo, "objetivo");
    const texto = r!.snippet.map((p) => p.text).join("");
    expect(texto.startsWith("…palabra")).toBe(true);
    expect(texto.endsWith("final final…")).toBe(true);
    expect(marked(r!)).toEqual(["objetivo"]);
  });

  it("respeta el límite de resultados", () => {
    const muchos = buildSearchIndex(
      Array.from({ length: 20 }, (_, i) => doc(`C${i}`, "x", "astro")),
    );
    expect(searchIndex(muchos, "astro")).toHaveLength(8);
  });
});
