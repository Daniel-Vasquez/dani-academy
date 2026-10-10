import { describe, expect, it, vi } from "vitest";
import { NotFoundError, TooManyRequestsError, toErrorResponse } from "@/lib/errors";

describe("toErrorResponse", () => {
  it("429 con Retry-After y un mensaje en minutos", async () => {
    const res = toErrorResponse(new TooManyRequestsError(90));
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("90");
    expect(await res.json()).toEqual({
      error: "Demasiados intentos seguidos. Vuelve a probar en 2 min.",
    });
  });

  it("los HttpError conservan su código y mensaje", async () => {
    const res = toErrorResponse(new NotFoundError("La sección no existe"));
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "La sección no existe" });
  });

  it("un error inesperado es un 500 que no filtra detalles", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = toErrorResponse(new Error("connection string mongodb+srv://secreto"));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Error interno" });
    expect(log).toHaveBeenCalled();
    log.mockRestore();
  });
});
