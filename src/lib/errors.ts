export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Petición no válida") {
    super(400, message);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "No autenticado") {
    super(401, message);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "No permitido") {
    super(403, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "No encontrado") {
    super(404, message);
  }
}

export class TooManyRequestsError extends HttpError {
  constructor(public readonly retryAfterSeconds: number) {
    super(429, "Demasiadas peticiones");
  }
}

/** Convierte cualquier error en una respuesta JSON con el código correcto. */
export function toErrorResponse(error: unknown): Response {
  if (error instanceof TooManyRequestsError) {
    return Response.json(
      { error: error.message },
      { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } },
    );
  }
  if (error instanceof HttpError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  console.error("[api] Error no controlado", error);
  return Response.json({ error: "Error interno" }, { status: 500 });
}
