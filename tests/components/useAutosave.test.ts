// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAutosave } from "@/components/notes/useAutosave";

const doc = (text: string) => ({
  type: "doc",
  content: [{ type: "paragraph", content: [{ type: "text", text }] }],
});
const json = (status: number, body: unknown, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });

let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
  vi.useFakeTimers();
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

/** Las opciones de la llamada número i a fetch, y su cuerpo ya parseado */
const sent = (i: number) => fetchMock.mock.calls[i]![1] as RequestInit;
const sentBody = (i: number) => JSON.parse(sent(i).body as string) as { doc: unknown; rev: number };

const avanza = (ms: number) =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });

describe("useAutosave", () => {
  it("agrupa las teclas: una sola petición 1 s después de la última", async () => {
    fetchMock.mockResolvedValue(json(200, { rev: 1, updatedAt: "2026-10-20T10:00:00Z" }));
    const { result } = renderHook(() => useAutosave("A3.2", 0));
    act(() => {
      result.current.schedule(doc("H"));
    });
    await avanza(500);
    act(() => {
      result.current.schedule(doc("Ho"));
    });
    await avanza(999);
    expect(fetchMock).not.toHaveBeenCalled();
    await avanza(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(sentBody(0)).toEqual({ doc: doc("Ho"), rev: 0 });
    expect(result.current.status).toBe("saved");
  });

  it("envía la rev devuelta en el siguiente guardado", async () => {
    fetchMock
      .mockResolvedValueOnce(json(200, { rev: 1, updatedAt: null }))
      .mockResolvedValueOnce(json(200, { rev: 2, updatedAt: null }));
    const { result } = renderHook(() => useAutosave("A3.2", 0));
    act(() => {
      result.current.schedule(doc("a"));
    });
    await avanza(1000);
    act(() => {
      result.current.schedule(doc("ab"));
    });
    await avanza(1000);
    expect(sentBody(1).rev).toBe(1);
  });

  it("lo escrito durante un guardado se envía después, no a la vez", async () => {
    let resolver!: (r: Response) => void;
    fetchMock
      .mockImplementationOnce(
        () =>
          new Promise<Response>((r) => {
            resolver = r;
          }),
      )
      .mockResolvedValueOnce(json(200, { rev: 2, updatedAt: null }));
    const { result } = renderHook(() => useAutosave("A3.2", 0));
    act(() => {
      result.current.schedule(doc("a"));
    });
    await avanza(1000);
    act(() => {
      result.current.schedule(doc("ab"));
    });
    await avanza(1000);
    expect(fetchMock).toHaveBeenCalledTimes(1); // el primero sigue en vuelo
    await act(async () => {
      resolver(json(200, { rev: 1, updatedAt: null }));
    });
    await avanza(1000);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(sentBody(1)).toEqual({ doc: doc("ab"), rev: 1 });
  });

  it("409: para de guardar y ofrece las dos versiones", async () => {
    fetchMock
      .mockResolvedValueOnce(
        json(409, { error: "Conflicto", current: { doc: doc("de la otra pestaña"), rev: 5 } }),
      )
      .mockResolvedValueOnce(json(200, { rev: 6, updatedAt: null }));
    const { result } = renderHook(() => useAutosave("A3.2", 3));
    act(() => {
      result.current.schedule(doc("mía"));
    });
    await avanza(1000);
    expect(result.current.status).toBe("conflict");
    act(() => {
      result.current.schedule(doc("mía 2"));
    });
    await avanza(5000);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    act(() => {
      result.current.keepMine(doc("mía 2"));
    });
    await avanza(0);
    expect(sentBody(1)).toEqual({ doc: doc("mía 2"), rev: 5 });
    expect(result.current.status).toBe("saved");
  });

  it("usar la guardada descarta lo pendiente y adopta su rev", async () => {
    fetchMock
      .mockResolvedValueOnce(
        json(409, { error: "Conflicto", current: { doc: doc("servidor"), rev: 5 } }),
      )
      .mockResolvedValueOnce(json(200, { rev: 6, updatedAt: null }));
    const { result } = renderHook(() => useAutosave("A3.2", 3));
    act(() => {
      result.current.schedule(doc("mía"));
    });
    await avanza(1000);
    let devuelto: unknown;
    act(() => {
      devuelto = result.current.takeServer();
    });
    expect(devuelto).toEqual(doc("servidor"));
    act(() => {
      result.current.schedule(doc("servidor+"));
    });
    await avanza(1000);
    expect(sentBody(1).rev).toBe(5);
  });

  it("429: reintenta cuando dice Retry-After", async () => {
    fetchMock
      .mockResolvedValueOnce(json(429, { error: "Demasiadas" }, { "Retry-After": "3" }))
      .mockResolvedValueOnce(json(200, { rev: 1, updatedAt: null }));
    const { result } = renderHook(() => useAutosave("A3.2", 0));
    act(() => {
      result.current.schedule(doc("a"));
    });
    await avanza(1000);
    expect(result.current.status).toBe("error");
    await avanza(2999);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await avanza(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result.current.status).toBe("saved");
  });

  it("sin red: queda pendiente y se envía al volver la conexión", async () => {
    fetchMock
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockResolvedValueOnce(json(200, { rev: 1, updatedAt: null }));
    const { result } = renderHook(() => useAutosave("A3.2", 0));
    act(() => {
      result.current.schedule(doc("a"));
    });
    await avanza(1000);
    expect(result.current.status).toBe("offline");
    await avanza(10_000);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await act(async () => {
      window.dispatchEvent(new Event("online"));
    });
    await avanza(0);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result.current.status).toBe("saved");
  });

  it("al ocultar la pestaña envía lo pendiente con keepalive, sin esperar", async () => {
    fetchMock.mockResolvedValue(json(200, { rev: 1, updatedAt: null }));
    const { result } = renderHook(() => useAutosave("A3.2", 0));
    act(() => {
      result.current.schedule(doc("a"));
    });
    Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
    await act(async () => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(sent(0).keepalive).toBe(true);
    await avanza(2000);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("al navegar con View Transitions envía lo pendiente sin esperar al debounce", async () => {
    fetchMock.mockResolvedValue(json(200, { rev: 1, updatedAt: null }));
    const { result } = renderHook(() => useAutosave("A3.2", 0));
    act(() => {
      result.current.schedule(doc("a"));
    });
    await act(async () => {
      document.dispatchEvent(new Event("astro:before-preparation"));
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(sent(0).keepalive).toBe(true);
  });

  it("401: no reintenta y avisa", async () => {
    fetchMock.mockResolvedValue(json(401, { error: "No autenticado" }));
    const { result } = renderHook(() => useAutosave("A3.2", 0));
    act(() => {
      result.current.schedule(doc("a"));
    });
    await avanza(1000);
    expect(result.current.status).toBe("signed-out");
    await avanza(10_000);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
