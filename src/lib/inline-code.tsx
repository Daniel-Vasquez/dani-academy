import { Fragment, type ReactNode } from "react";

export interface InlinePart {
  code: boolean;
  text: string;
}

/**
 * Parte un texto en trozos de texto y de código en línea, con la regla de Markdown: el código se
 * abre con N acentos graves y se cierra con otros N exactamente, así que `` `get${K}` `` puede
 * contener acentos graves. Si el código empieza y acaba con un espacio, se quita uno a cada lado.
 * Unos acentos sin cierre se quedan como texto.
 */
export function splitInline(text: string): InlinePart[] {
  const parts: InlinePart[] = [];
  let plain = "";
  let i = 0;
  while (i < text.length) {
    if (text[i] !== "`") {
      plain += text[i++];
      continue;
    }
    let n = 0;
    while (text[i + n] === "`") n++;
    const delimiter = "`".repeat(n);
    // El cierre: otros n acentos que no formen parte de una tira más larga
    let close = text.indexOf(delimiter, i + n);
    while (close !== -1 && (text[close + n] === "`" || text[close - 1] === "`")) {
      let end = close;
      while (text[end] === "`") end++;
      close = text.indexOf(delimiter, end);
    }
    if (close === -1) {
      plain += delimiter;
      i += n;
      continue;
    }
    let code = text.slice(i + n, close);
    if (code.length > 2 && code.startsWith(" ") && code.endsWith(" ") && code.trim() !== "") {
      code = code.slice(1, -1);
    }
    if (plain) parts.push({ code: false, text: plain });
    parts.push({ code: true, text: code });
    plain = "";
    i = close + n;
  }
  if (plain) parts.push({ code: false, text: plain });
  return parts;
}

/** Convierte `texto` en <code> dentro de enunciados y opciones (sin usar HTML crudo). */
export function renderInline(text: string): ReactNode {
  return splitInline(text).map((part, i) =>
    part.code ? (
      <code key={i} className="rounded bg-surface-2 px-1 py-0.5 font-mono text-[0.9em]">
        {part.text}
      </code>
    ) : (
      <Fragment key={i}>{part.text}</Fragment>
    ),
  );
}
