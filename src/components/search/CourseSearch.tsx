import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import { SEARCH_MAX_LENGTH, SEARCH_MIN_LENGTH, type SearchResult } from "@/lib/domain/search";
import { useDebouncedValue } from "./useDebouncedValue";

const DEBOUNCE_MS = 300;

/** Lo que respondió el servidor, y para qué texto: así se sabe si sigue correspondiendo al input */
interface Answer {
  term: string;
  results: SearchResult[];
  failed: boolean;
}

/** Buscador del contenido de los cursos: un combobox con la lista de resultados debajo */
export default function CourseSearch() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const optionId = (i: number) => `${listId}-opcion-${i}`;

  const term = query.trim();
  const debouncedTerm = useDebouncedValue(term, DEBOUNCE_MS);
  const searchable = term.length >= SEARCH_MIN_LENGTH;
  // Mientras se escribe o se espera al servidor, la respuesta anterior ya no corresponde al input
  const current = answer?.term === term ? answer : null;
  const waiting = searchable && !current;
  const failed = current?.failed ?? false;
  const results = current?.results ?? [];

  useEffect(() => {
    if (debouncedTerm.length < SEARCH_MIN_LENGTH) return;
    // Una respuesta lenta de una búsqueda anterior no debe pisar la actual
    const controller = new AbortController();
    fetch(`/api/search?q=${encodeURIComponent(debouncedTerm)}`, { signal: controller.signal })
      .then(async (res) => {
        if (res.status === 401) {
          window.location.assign(`/login?redirect=${encodeURIComponent(location.pathname)}`);
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { results: SearchResult[] };
        setAnswer({ term: debouncedTerm, results: data.results, failed: false });
        setActive(-1);
      })
      .catch((error: unknown) => {
        if ((error as Error).name === "AbortError") return;
        setAnswer({ term: debouncedTerm, results: [], failed: true });
      });
    return () => controller.abort();
  }, [debouncedTerm]);

  // Cerrar al hacer clic fuera del buscador
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const showPanel = open && searchable;
  const showResults = showPanel && !waiting && !failed && results.length > 0;

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      if (showPanel) setOpen(false);
      else setQuery("");
      return;
    }
    if (!showResults) {
      if (event.key === "ArrowDown") setOpen(true);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((i) => (i + step + results.length) % results.length);
    } else if (event.key === "Enter" && active >= 0) {
      event.preventDefault();
      window.location.assign(results[active]!.url);
    }
  }

  const announcement = !searchable
    ? ""
    : waiting
      ? "Buscando…"
      : failed
        ? "No se pudo completar la búsqueda"
        : results.length === 0
          ? `No se encontraron resultados para "${term}"`
          : `${results.length} ${results.length === 1 ? "resultado" : "resultados"}`;

  return (
    <div ref={rootRef} className="relative mt-8 max-w-2xl">
      <label htmlFor={`${listId}-input`} className="sr-only">
        Buscar en los cursos
      </label>
      <div className="relative">
        <svg
          className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="m20 20-3.5-3.5" />
        </svg>
        <input
          id={`${listId}-input`}
          type="search"
          role="combobox"
          aria-expanded={showResults}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showResults && active >= 0 ? optionId(active) : undefined}
          autoComplete="off"
          spellCheck={false}
          maxLength={SEARCH_MAX_LENGTH}
          placeholder="Busca un concepto: getStaticPaths, índices, JWT…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(-1);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className={cn(
            "block w-full rounded-2xl border border-surface-2 bg-bg py-3.5 pr-4 pl-12 font-sans text-base text-fg shadow-sm",
            "placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none",
            "[&::-webkit-search-cancel-button]:cursor-pointer",
          )}
        />
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>

      {showPanel && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-surface-2 bg-bg shadow-lg">
          {waiting && (
            <p className="flex items-center gap-2 px-4 py-3 font-sans text-sm text-muted">
              <span
                className="size-3.5 animate-spin rounded-full border-2 border-accent/30 border-t-accent motion-reduce:animate-none"
                aria-hidden="true"
              />
              Buscando…
            </p>
          )}
          {!waiting && failed && (
            <p className="px-4 py-3 font-sans text-sm text-danger-strong">
              No se pudo completar la búsqueda. Inténtalo de nuevo.
            </p>
          )}
          {!waiting && !failed && results.length === 0 && (
            <p className="px-4 py-3 font-sans text-sm text-muted">
              No se encontraron resultados para "{term}".
            </p>
          )}
          {/* El listbox existe siempre que hay panel: aria-controls debe apuntar a algo */}
          <ul
            id={listId}
            role="listbox"
            aria-label="Resultados de la búsqueda"
            className={cn("max-h-[min(28rem,60vh)] overflow-y-auto", !showResults && "hidden")}
          >
            {showResults &&
              results.map((r, i) => (
                <li
                  key={r.sectionId}
                  id={optionId(i)}
                  role="option"
                  aria-selected={i === active}
                  className="border-t border-surface-2 first:border-t-0"
                >
                  <a
                    href={r.url}
                    tabIndex={-1}
                    onMouseEnter={() => setActive(i)}
                    className={cn(
                      "block px-4 py-3 transition-colors hover:bg-accent/10",
                      i === active && "bg-accent/10",
                    )}
                  >
                    <span className="block font-sans text-xs font-medium tracking-wide text-accent-strong uppercase">
                      {r.courseTitle}
                    </span>
                    <span className="mt-0.5 block font-sans font-semibold text-fg">
                      {r.sectionTitle}
                    </span>
                    <span className="mt-1 line-clamp-2 block font-serif text-sm text-muted">
                      {r.snippet.map((part, j) =>
                        part.match ? (
                          <mark key={j} className="rounded-sm bg-accent/20 px-0.5 text-fg">
                            {part.text}
                          </mark>
                        ) : (
                          <span key={j}>{part.text}</span>
                        ),
                      )}
                    </span>
                  </a>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
