import { Fragment, type ReactNode } from "react";

/** Convierte `texto` en <code> dentro de enunciados y opciones (sin usar HTML crudo). */
export function renderInline(text: string): ReactNode {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith("`") && part.endsWith("`") ? (
      <code key={i} className="rounded bg-surface-2 px-1 py-0.5 font-mono text-[0.9em]">
        {part.slice(1, -1)}
      </code>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
