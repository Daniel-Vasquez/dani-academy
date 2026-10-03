import { defineMiddleware, sequence } from "astro:middleware";
import { auth } from "@/lib/auth";

const AUTH_PAGES = new Set(["/login", "/registro"]);
const PUBLIC_PREFIXES = ["/api/auth/", "/api/health"];

const isApi = (pathname: string) =>
  pathname.startsWith("/api/") || pathname.startsWith("/_actions/");

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

export const onRequest = sequence(loadSession, guard);
