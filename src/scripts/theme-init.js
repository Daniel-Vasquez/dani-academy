// Aplica el tema antes del primer pintado (sin parpadeo) y tras cada navegación.
// Se incrusta en línea desde BaseLayout.astro, que registra su hash en la CSP.
// "da-theme" debe coincidir con THEME_STORAGE_KEY (src/lib/constants.ts).
const applyTheme = () => {
  let stored = null;
  try {
    stored = localStorage.getItem("da-theme");
  } catch {
    // Almacenamiento bloqueado: se usa la preferencia del sistema
  }
  const dark = stored
    ? stored === "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = dark ? "dark" : "light";
};
applyTheme();
if (!window.__daThemeListener) {
  window.__daThemeListener = true;
  document.addEventListener("astro:after-swap", applyTheme);
}
