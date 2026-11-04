/**
 * El bloque de código y el botón comparten la única celda de una rejilla. Así el botón queda fuera
 * del `overflow-x-auto` del <pre>, no se va con el scroll horizontal, y su capa mide lo mismo que
 * el bloque: `sticky` lo acompaña al bajar y se detiene en el borde inferior, sin salirse de él.
 */
export const CODE_BLOCK_CLASS = "grid grid-cols-[minmax(0,1fr)] [&>*]:[grid-area:1/1]";

const ICON =
  "size-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]";

/** Marcado sin estado, igual en Astro y en React: el comportamiento está en src/lib/copy-code.ts */
export function CopyCodeButton() {
  return (
    <div className="pointer-events-none justify-self-end p-2">
      {/* top-16: los 3.5rem de la cabecera fija más un pequeño margen */}
      <button
        type="button"
        data-copy-code
        data-state="idle"
        aria-label="Copiar código"
        title="Copiar código"
        className="group pointer-events-auto sticky top-16 z-10 grid size-8 cursor-pointer place-items-center rounded-lg border border-surface-2 bg-surface/70 text-muted backdrop-blur-sm transition-colors hover:bg-surface-2 hover:text-fg"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={`${ICON} group-data-[state=copied]:hidden group-data-[state=error]:hidden`}
        >
          <rect x="9" y="9" width="12" height="12" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={`${ICON} hidden text-accent-strong group-data-[state=copied]:block`}
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={`${ICON} hidden text-danger-strong group-data-[state=error]:block`}
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
      <span role="status" className="sr-only" />
    </div>
  );
}
