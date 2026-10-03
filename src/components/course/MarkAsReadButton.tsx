import { useState } from "react";
import { cn } from "@/lib/cn";

interface Props {
  sectionId: string;
  initialRead?: boolean;
}

/** Avisa al índice lateral (CourseSidebar) para que se actualice sin recargar */
const emit = (sectionId: string, read: boolean) =>
  document.dispatchEvent(new CustomEvent("da:section-read", { detail: { sectionId, read } }));

/** Actualización optimista con rollback si la API falla (temario I2.5) */
export default function MarkAsReadButton({ sectionId, initialRead = false }: Props) {
  const [read, setRead] = useState(initialRead);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    const previous = read;
    const next = !previous;
    setRead(next);
    emit(sectionId, next);
    setError(null);
    setPending(true);

    try {
      const res = await fetch(`/api/progress/${encodeURIComponent(sectionId)}`, {
        method: next ? "PUT" : "DELETE",
      });
      if (res.status === 401) {
        window.location.assign(`/login?redirect=${encodeURIComponent(location.pathname)}`);
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch {
      setRead(previous); // rollback
      emit(sectionId, previous);
      setError("No se pudo guardar. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
      <button
        type="button"
        aria-pressed={read}
        aria-busy={pending}
        disabled={pending}
        onClick={toggle}
        className={cn(
          "inline-flex items-center gap-2 rounded-xl px-5 py-3 font-sans text-sm font-semibold transition disabled:cursor-wait",
          read
            ? "bg-accent/10 text-accent-strong ring-1 ring-accent/40 ring-inset hover:bg-accent/15"
            : "bg-accent-strong text-accent-contrast hover:opacity-90",
        )}
      >
        <svg
          className="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
        </svg>
        {read ? "Leído" : "Marcar como leído"}
      </button>
      <p
        className={cn("font-sans text-sm", error ? "text-danger-strong" : "text-muted")}
        aria-live="polite"
      >
        {error ??
          (read
            ? "Sección completada. Se ha guardado tu progreso."
            : "Márcala cuando cumplas el criterio «Lo dominas si…».")}
      </p>
    </div>
  );
}
