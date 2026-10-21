import { lazy, Suspense, useEffect, useState } from "react";
import NotesToolbar from "./NotesToolbar";
import { NOTE_CONTENT_CLASS } from "./note-classes";
import type { NotesEditorProps } from "./NotesEditor";

// TipTap y ProseMirror (unos 100 KB gzip) van en un trozo aparte que solo se pide si hace falta
const NotesEditor = lazy(() => import("./NotesEditor"));

interface Props extends Omit<NotesEditorProps, "fallback"> {
  /** HTML de la nota generado en el servidor (renderNoteHtml), ya escapado */
  previewHtml: string;
}

const DESKTOP = "(min-width: 80rem)"; // xl: el panel es una columna visible

export default function NotesIsland({ previewHtml, ...editorProps }: Props) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP);
    const panel = document.querySelector<HTMLDialogElement>("[data-notes-panel]");
    const activate = () => setActive(true);
    // En escritorio el panel se ve desde el principio; en móvil, al abrirlo por primera vez
    if (desktop.matches || panel?.matches(":modal")) return activate();
    document.addEventListener("da:notes-open", activate);
    desktop.addEventListener("change", activate);
    return () => {
      document.removeEventListener("da:notes-open", activate);
      desktop.removeEventListener("change", activate);
    };
  }, []);

  // Mismo esqueleto que NotesEditor: barra desactivada, contenido y línea de estado
  const preview = (
    <div className="flex flex-col gap-3">
      <NotesToolbar state={null} />
      <div>
        {/* Sin aria-label: ARIA no permite nombrar un div sin rol (axe: aria-prohibited-attr) */}
        <div className={NOTE_CONTENT_CLASS} dangerouslySetInnerHTML={{ __html: previewHtml }} />
      </div>
      <p className="min-h-5" />
    </div>
  );

  if (!active) return preview;
  return (
    <Suspense fallback={preview}>
      <NotesEditor {...editorProps} fallback={preview} />
    </Suspense>
  );
}
