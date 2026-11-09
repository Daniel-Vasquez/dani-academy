/**
 * Búsqueda de texto en las secciones de los cursos. Lógica pura (sin astro:*): el índice lo
 * construye search.service a partir de las Content Collections.
 */

export const SEARCH_MIN_LENGTH = 2;
export const SEARCH_MAX_LENGTH = 80;
export const SEARCH_LIMIT = 8;
const SNIPPET_RADIUS = 70; // caracteres a cada lado de la primera coincidencia

export interface SearchDocument {
  sectionId: string;
  sectionTitle: string;
  courseTitle: string;
  url: string;
  text: string; // texto plano de la sección
}

/** Un trozo del fragmento: `match` indica si es la palabra buscada (para resaltarla) */
export interface SnippetPart {
  text: string;
  match: boolean;
}

export interface SearchResult {
  sectionId: string;
  sectionTitle: string;
  courseTitle: string;
  url: string;
  snippet: SnippetPart[];
}

interface IndexedDocument extends SearchDocument {
  foldedTitle: string;
  foldedText: string;
}

/**
 * Minúsculas y sin tildes, carácter a carácter: "Configuración" → "configuracion". Cada carácter
 * se convierte en uno solo, así que una posición en el texto plegado es la misma en el original.
 */
export function fold(text: string): string {
  let folded = "";
  for (const char of text) {
    const base = char.normalize("NFD")[0] ?? char;
    const lower = base.toLowerCase();
    // Si la conversión cambia la longitud (p. ej. "İ"), se conserva el original
    folded += lower.length === char.length ? lower : char;
  }
  return folded;
}

/** MDX → texto plano legible: sin imports, etiquetas JSX ni marcas de Markdown */
export function mdxToPlainText(mdx: string): string {
  return mdx
    .replace(/^(import|export)\s.*$/gm, " ")
    .replace(/^```.*$/gm, " ") // vallas de código: el código se conserva, es buscable
    .replace(/<\/?[A-Za-z][^>]*>/g, " ") // <Callout type="risk">, </Callout>
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "")
    .replace(/^\|?[\s:|-]+\|[\s:|-]*$/gm, " ") // separadores de tablas
    .replace(/\|/g, " ")
    .replace(/[*`~]|(^|\s)_+|_+(?=\s|$)/g, "$1") // énfasis y código en línea: solo las marcas
    .replace(/\s+/g, " ")
    .trim();
}

export function buildSearchIndex(documents: SearchDocument[]): IndexedDocument[] {
  return documents.map((d) => ({
    ...d,
    foldedTitle: fold(d.sectionTitle),
    foldedText: fold(d.text),
  }));
}

/** Normaliza la consulta; devuelve null si es demasiado corta para buscar */
export function normalizeQuery(raw: string): string | null {
  const query = fold(raw.trim().replace(/\s+/g, " ")).slice(0, SEARCH_MAX_LENGTH);
  return query.length >= SEARCH_MIN_LENGTH ? query : null;
}

function countOccurrences(haystack: string, needle: string): number {
  let count = 0;
  for (
    let i = haystack.indexOf(needle);
    i !== -1;
    i = haystack.indexOf(needle, i + needle.length)
  ) {
    count++;
  }
  return count;
}

/** Un fragmento alrededor de la primera coincidencia, cortado en palabras completas */
export function buildSnippet(text: string, foldedText: string, query: string): SnippetPart[] {
  const first = foldedText.indexOf(query);
  if (first === -1) {
    const end = text.lastIndexOf(" ", SNIPPET_RADIUS * 2);
    return [{ text: text.slice(0, end > 0 ? end : SNIPPET_RADIUS * 2) + "…", match: false }];
  }

  let start = Math.max(0, first - SNIPPET_RADIUS);
  let end = Math.min(text.length, first + query.length + SNIPPET_RADIUS);
  if (start > 0) start = text.indexOf(" ", start) + 1 || start;
  if (end < text.length)
    end = text.lastIndexOf(" ", end) > first ? text.lastIndexOf(" ", end) : end;

  const parts: SnippetPart[] = [];
  let cursor = start;
  for (
    let i = foldedText.indexOf(query, start);
    i !== -1 && i + query.length <= end;
    i = foldedText.indexOf(query, i + query.length)
  ) {
    if (i > cursor) parts.push({ text: text.slice(cursor, i), match: false });
    parts.push({ text: text.slice(i, i + query.length), match: true });
    cursor = i + query.length;
  }
  if (cursor < end) parts.push({ text: text.slice(cursor, end), match: false });

  if (start > 0) parts.unshift({ text: "…", match: false });
  if (end < text.length) parts.push({ text: "…", match: false });
  return parts;
}

/**
 * Busca sin distinguir mayúsculas ni tildes. Primero las secciones cuyo título coincide, luego
 * las que más veces mencionan la consulta.
 */
export function searchIndex(
  index: IndexedDocument[],
  rawQuery: string,
  limit = SEARCH_LIMIT,
): SearchResult[] {
  const query = normalizeQuery(rawQuery);
  if (!query) return [];

  return index
    .map((doc) => {
      const inTitle = doc.foldedTitle.includes(query);
      const hits = countOccurrences(doc.foldedText, query);
      return { doc, score: (inTitle ? 1000 : 0) + hits };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ doc }) => ({
      sectionId: doc.sectionId,
      sectionTitle: doc.sectionTitle,
      courseTitle: doc.courseTitle,
      url: doc.url,
      snippet: buildSnippet(doc.text, doc.foldedText, query),
    }));
}
