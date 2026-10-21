import { useCallback, useEffect, useRef, useState } from "react";
import type { JSONContent } from "@tiptap/core";

export type SaveStatus =
  "idle" | "pending" | "saving" | "saved" | "offline" | "error" | "conflict" | "signed-out";

export interface ServerNote {
  doc: JSONContent | null;
  rev: number;
}

const DEBOUNCE_MS = 1000;
const KEEPALIVE_MAX_BYTES = 63 * 1024; // el navegador rechaza un keepalive de más de 64 KiB

/**
 * Guarda la nota 1 s después de dejar de escribir, una petición cada vez, con control de
 * versiones (rev). Al ocultar o cerrar la pestaña, o al navegar a otra página con View
 * Transitions (que no dispara pagehide), envía lo pendiente con keepalive.
 */
export function useAutosave(sectionId: string, initialRev: number) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [conflict, setConflict] = useState<ServerNote | null>(null);
  const rev = useRef(initialRev);
  const pending = useRef<JSONContent | null>(null);
  const inFlight = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const inConflict = useRef(false); // espejo de `conflict` para los callbacks
  const url = `/api/notes/${encodeURIComponent(sectionId)}`;

  const flush = useCallback(
    async (keepalive = false): Promise<void> => {
      clearTimeout(timer.current);
      const doc = pending.current;
      if (!doc || inFlight.current) return;
      pending.current = null;
      inFlight.current = true;
      setStatus("saving");

      const body = JSON.stringify({ doc, rev: rev.current });
      let next: number | null = null; // ms hasta el siguiente intento; null = no reintentar
      try {
        const res = await fetch(url, {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body,
          keepalive: keepalive && body.length < KEEPALIVE_MAX_BYTES,
        });
        if (res.ok) {
          const data = (await res.json()) as { rev: number; updatedAt: string | null };
          rev.current = data.rev;
          setSavedAt(data.updatedAt ? new Date(data.updatedAt) : new Date());
          setStatus(pending.current ? "pending" : "saved");
          if (pending.current) next = DEBOUNCE_MS; // se escribió mientras se guardaba
        } else if (res.status === 409) {
          pending.current ??= doc; // lo de esta pestaña no se pierde
          const data = (await res.json()) as { current: ServerNote | null };
          inConflict.current = true;
          setConflict(data.current ?? { doc: null, rev: 0 });
          setStatus("conflict");
        } else if (res.status === 401) {
          pending.current ??= doc;
          setStatus("signed-out");
        } else {
          pending.current ??= doc;
          setStatus("error");
          const retryAfter = Number(res.headers.get("Retry-After"));
          next = res.status === 429 && retryAfter > 0 ? retryAfter * 1000 : 5000;
        }
      } catch {
        pending.current ??= doc;
        setStatus("offline"); // se reintenta con el evento "online"
      } finally {
        inFlight.current = false;
      }
      // Sin red se espera al evento "online"; con 401 o 409, a que la persona actúe
      if (next !== null) timer.current = setTimeout(() => void flush(), next);
    },
    [url],
  );

  const schedule = useCallback(
    (doc: JSONContent) => {
      pending.current = doc;
      if (inConflict.current) return; // no se guarda nada hasta que se resuelva
      setStatus("pending");
      clearTimeout(timer.current);
      timer.current = setTimeout(() => void flush(), DEBOUNCE_MS);
    },
    [flush],
  );

  /** "Conservar la mía": se guarda encima de la versión del servidor */
  const keepMine = useCallback(
    (doc: JSONContent) => {
      rev.current = conflict?.rev ?? 0;
      inConflict.current = false;
      setConflict(null);
      pending.current = doc;
      void flush();
    },
    [conflict, flush],
  );

  /** "Usar la guardada": se descarta lo de esta pestaña y se devuelve la del servidor */
  const takeServer = useCallback(() => {
    rev.current = conflict?.rev ?? 0;
    pending.current = null;
    inConflict.current = false;
    setConflict(null);
    setStatus("saved");
    return conflict?.doc ?? null;
  }, [conflict]);

  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") void flush(true);
    };
    const onPageHide = () => void flush(true);
    const onOnline = () => void flush();
    const onNavigate = () => void flush(true); // ClientRouter: antes de pedir la página nueva
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (pending.current || inFlight.current) e.preventDefault();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("online", onOnline);
    document.addEventListener("astro:before-preparation", onNavigate);
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("online", onOnline);
      document.removeEventListener("astro:before-preparation", onNavigate);
      window.removeEventListener("beforeunload", onBeforeUnload);
      clearTimeout(timer.current);
    };
  }, [flush]);

  return { status, savedAt, conflict, schedule, flush, keepMine, takeServer };
}
