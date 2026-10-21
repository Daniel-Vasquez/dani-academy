import { cn } from "@/lib/cn";
import { NOTE_TONES, NOTE_TONE_LABELS, type NoteTone } from "@/lib/notes/palette";

// Sin imports de TipTap: el esqueleto de la isla la usa antes de descargar el editor

export interface ToolbarState {
  bold: boolean;
  italic: boolean;
  tone: NoteTone | null;
}

export type ToolbarCommand =
  { type: "bold" } | { type: "italic" } | { type: "tone"; tone: NoteTone } | { type: "unsetTone" };

interface Props {
  /** null mientras el editor carga: se pinta igual, desactivada, para que nada salte */
  state: ToolbarState | null;
  onCommand?: (command: ToolbarCommand) => void;
}

const BUTTON =
  "inline-flex size-9 items-center justify-center rounded-lg font-sans text-sm transition hover:bg-surface-2 disabled:pointer-events-none disabled:opacity-50 aria-pressed:bg-surface-2 aria-pressed:ring-1 aria-pressed:ring-accent/50";

export default function NotesToolbar({ state, onCommand }: Props) {
  const disabled = !state;
  const send = (command: ToolbarCommand) => () => onCommand?.(command);

  return (
    <div
      role="toolbar"
      aria-label="Formato de la nota"
      className="flex flex-wrap items-center gap-1"
    >
      <button
        type="button"
        className={cn(BUTTON, "font-bold")}
        aria-pressed={state?.bold ?? false}
        aria-label="Negrita"
        title="Negrita (Ctrl/⌘ + B)"
        disabled={disabled}
        onClick={send({ type: "bold" })}
      >
        B
      </button>
      <button
        type="button"
        className={cn(BUTTON, "font-serif italic")}
        aria-pressed={state?.italic ?? false}
        aria-label="Cursiva"
        title="Cursiva (Ctrl/⌘ + I)"
        disabled={disabled}
        onClick={send({ type: "italic" })}
      >
        I
      </button>
      <span className="mx-1 h-5 w-px bg-surface-2" aria-hidden="true" />
      {NOTE_TONES.map((tone) => (
        <button
          key={tone}
          type="button"
          className={BUTTON}
          aria-pressed={state?.tone === tone}
          aria-label={`Color ${NOTE_TONE_LABELS[tone].toLowerCase()}`}
          title={NOTE_TONE_LABELS[tone]}
          disabled={disabled}
          onClick={send({ type: "tone", tone })}
        >
          <span data-tono={tone} className="nota-tono font-semibold" aria-hidden="true">
            A
          </span>
        </button>
      ))}
      <button
        type="button"
        className={cn(BUTTON, "w-auto px-2 text-xs text-muted")}
        aria-label="Quitar el color"
        disabled={disabled || !state.tone}
        onClick={send({ type: "unsetTone" })}
      >
        Sin color
      </button>
    </div>
  );
}
