/** Origen ficticio para resolver rutas relativas: si el resultado cambia de origen, era externa */
const ORIGEN = "https://interno.invalid";

/**
 * Evita open redirects (temario I5.3): solo se permiten rutas internas.
 * No se comprueba el texto a mano: el analizador de URL del navegador ignora tabuladores y saltos
 * de línea, y trata "\" como "/", así que "/\t/evil.com" o "/\evil.com" acaban en evil.com.
 * Se resuelve con el mismo analizador (WHATWG URL) y se exige que el origen no cambie.
 */
export function safeRedirect(target: string | null | undefined, fallback = "/"): string {
  if (!target || !target.startsWith("/")) return fallback;
  let url: URL;
  try {
    url = new URL(target, ORIGEN);
  } catch {
    return fallback;
  }
  if (url.origin !== ORIGEN) return fallback;
  return url.pathname + url.search + url.hash; // ya normalizada: sin tabuladores ni saltos de línea
}
