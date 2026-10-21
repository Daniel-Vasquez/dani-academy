import { useEffect, type ReactNode } from "react";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import { CharacterCount, Placeholder, UndoRedo } from "@tiptap/extensions";
import type { JSONContent } from "@tiptap/core";
import { NOTE_LIMITS } from "@/lib/constants";
import { noteExtensions } from "@/lib/notes/extensions";
import NotesToolbar, { type ToolbarCommand, type ToolbarState } from "./NotesToolbar";
import { NOTE_CONTENT_CLASS } from "./note-classes";
import { useAutosave, type SaveStatus } from "./useAutosave";

export interface NotesEditorProps {
  sectionId: string;
  initialDoc: JSONContent | null;
  initialRev: number;
  /** Lo que se ve mientras TipTap crea el editor (el primer render llega con editor === null) */
  fallback: ReactNode;
}

/**
 * Fuera del componente a propósito: useEditor compara las opciones en cada render y, si un
 * array u objeto es nuevo, llama a setOptions(), que reescribe la selección del DOM con la que
 * tenía ProseMirror. Como useEditorState repinta en cada cambio de selección, unas opciones
 * creadas dentro del componente deshacían la selección recién hecha (medido: la negrita se
 * aplicaba a medio texto o a nada).
 */
const EXTENSIONS = [
  ...noteExtensions,
  UndoRedo,
  Placeholder.configure({ placeholder: "Escribe aquí tus notas de esta sección…" }),
  CharacterCount.configure({ limit: NOTE_LIMITS.maxChars }),
];
const EDITOR_PROPS = {
  attributes: {
    class: NOTE_CONTENT_CLASS,
    "aria-label": "Notas de esta sección",
    "aria-multiline": "true",
    role: "textbox",
  },
};

function runCommand(editor: Editor, command: ToolbarCommand) {
  const chain = editor.chain().focus();
  if (command.type === "bold") chain.toggleBold().run();
  else if (command.type === "italic") chain.toggleItalic().run();
  else if (command.type === "tone") chain.setTono(command.tone).run();
  else chain.unsetTono().run();
}

const time = new Intl.DateTimeFormat("es", { hour: "2-digit", minute: "2-digit" });

function statusText(status: SaveStatus, savedAt: Date | null): string {
  switch (status) {
    case "pending":
      return "Cambios sin guardar";
    case "saving":
      return "Guardando…";
    case "saved":
      return savedAt ? `Guardado a las ${time.format(savedAt)}` : "Guardado";
    case "offline":
      return "Sin conexión: se guardará al volver";
    case "error":
      return "No se pudo guardar. Reintentando…";
    case "signed-out":
      return "Tu sesión ha caducado. Copia el texto y vuelve a iniciar sesión.";
    default:
      return "";
  }
}

export default function NotesEditor({
  sectionId,
  initialDoc,
  initialRev,
  fallback,
}: NotesEditorProps) {
  const { status, savedAt, conflict, schedule, keepMine, takeServer } = useAutosave(
    sectionId,
    initialRev,
  );

  const editor = useEditor({
    immediatelyRender: false, // el servidor ya pintó la vista previa
    injectCSS: false, // sus reglas están en global.css (sin <style> en línea)
    extensions: EXTENSIONS,
    content: initialDoc ?? undefined,
    editorProps: EDITOR_PROPS,
    onUpdate: ({ editor: e }) => schedule(e.getJSON()),
  });

  // Solo la barra se repinta al mover el cursor: el selector devuelve 3 valores
  const toolbar = useEditorState({
    editor,
    selector: ({ editor: e }): ToolbarState | null =>
      e && {
        bold: e.isActive("bold"),
        italic: e.isActive("italic"),
        tone: (e.getAttributes("tono").tono as ToolbarState["tone"] | undefined) ?? null,
      },
  });

  // El punto del botón flotante indica si la sección tiene nota
  useEffect(() => {
    if (status !== "saved" || !editor) return;
    document.querySelector("[data-notes-open]")?.toggleAttribute("data-has-note", !editor.isEmpty);
  }, [status, editor]);

  if (!editor) return fallback;
  const chars = editor.storage.characterCount.characters();

  return (
    <div className="flex flex-col gap-3">
      <NotesToolbar state={toolbar} onCommand={(c) => runCommand(editor, c)} />
      {conflict && (
        <div
          role="alert"
          className="rounded-xl border-l-4 border-warning bg-surface px-4 py-3 font-sans text-sm"
        >
          <p>Esta nota se cambió en otra pestaña. ¿Con cuál te quedas?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-lg bg-surface-2 px-3 py-1.5 font-semibold"
              onClick={() => editor.commands.setContent(takeServer() ?? "", { emitUpdate: false })}
            >
              Usar la guardada
            </button>
            <button
              type="button"
              className="rounded-lg bg-accent-strong px-3 py-1.5 font-semibold text-accent-contrast"
              onClick={() => keepMine(editor.getJSON())}
            >
              Conservar la mía
            </button>
          </div>
        </div>
      )}
      <EditorContent editor={editor} />
      <p className="flex min-h-5 justify-between gap-2 font-sans text-xs text-muted">
        <span aria-live="polite" data-notes-status>
          {statusText(status, savedAt)}
        </span>
        {chars > NOTE_LIMITS.maxChars * 0.9 && (
          <span className="tabular-nums">
            {chars.toLocaleString("es")} / {NOTE_LIMITS.maxChars.toLocaleString("es")}
          </span>
        )}
      </p>
    </div>
  );
}
