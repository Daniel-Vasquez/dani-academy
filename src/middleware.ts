import { defineMiddleware, sequence } from "astro:middleware";
import { auth } from "@/lib/auth";

const AUTH_PAGES = new Set(["/login", "/registro"]);
const PUBLIC_PREFIXES = ["/api/auth/", "/api/health"];

const isApi = (pathname: string) =>
  pathname.startsWith("/api/") || pathname.startsWith("/_actions/");

/** 0. Cabeceras de seguridad en todas las respuestas, y caché privada si hay sesión */
const securityHeaders = defineMiddleware(async (ctx, next) => {
  const response = await next();
  try {
    const h = response.headers;
    h.set("X-Content-Type-Options", "nosniff");
    h.set("Referrer-Policy", "strict-origin-when-cross-origin");
    h.set("X-Frame-Options", "DENY");
    h.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    if (import.meta.env.PROD) {
      h.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains");
    }
    // Ninguna respuesta con datos de usuario debe quedarse en una caché compartida (temario A6.3)
    if (ctx.locals.user) h.set("Cache-Control", "private, no-store");
  } catch {
    // Algunas respuestas (p. ej. un fetch reenviado) tienen cabeceras inmutables: se dejan tal cual
  }
  return response;
});

/** 1. Carga la sesión en Astro.locals */
const loadSession = defineMiddleware(async (ctx, next) => {
  ctx.locals.user = null;
  ctx.locals.session = null;

  if (ctx.isPrerendered || ctx.url.pathname.startsWith("/api/auth/")) return next();

  const data = await auth.api.getSession({ headers: ctx.request.headers });
  ctx.locals.user = data?.user ?? null;
  ctx.locals.session = data?.session ?? null;
  return next();
});

/** 2. Protege todo lo que no sea público */
const guard = defineMiddleware(async (ctx, next) => {
  const { pathname, search } = ctx.url;

  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) return next();

  if (AUTH_PAGES.has(pathname)) {
    return ctx.locals.user ? ctx.redirect("/") : next();
  }

  if (!ctx.locals.user) {
    if (isApi(pathname)) return Response.json({ error: "No autenticado" }, { status: 401 });
    return ctx.redirect(`/login?redirect=${encodeURIComponent(pathname + search)}`);
  }

  return next();
});

export const onRequest = sequence(securityHeaders, loadSession, guard);
