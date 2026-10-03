import { useState } from "react";
import { cn } from "@/lib/cn";

interface Props {
  sectionId: string;
  initialRead?: boolean;
}

/** Tanda 1: solo estado visual + evento para el índice. La Tanda 4 añade la persistencia. */
export default function MarkAsReadButton({ sectionId, initialRead = false }: Props) {
  const [read, setRead] = useState(initialRead);

  function toggle() {
    const next = !read;
    setRead(next);
    document.dispatchEvent(
      new CustomEvent("da:section-read", { detail: { sectionId, read: next } }),
    );
  }

  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
      <button
        type="button"
        aria-pressed={read}
        onClick={toggle}
        className={cn(
          "inline-flex items-center gap-2 rounded-xl px-5 py-3 font-sans text-sm font-semibold transition",
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
      <p className="font-sans text-sm text-muted" aria-live="polite">
        {read ? "Sección completada." : "Márcala cuando cumplas el criterio «Lo dominas si…»."}
      </p>
    </div>
  );
}
