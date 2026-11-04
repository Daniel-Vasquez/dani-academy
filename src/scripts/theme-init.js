// Aplica el tema antes del primer pintado (sin parpadeo) y tras cada navegación.
// Se incrusta en línea desde BaseLayout.astro, que registra su hash en la CSP.
// También el índice del curso oculto: si esperara a React, cada página se abriría y cerraría.
// "da-theme" y "da-sidebar" deben coincidir con src/lib/constants.ts.
const applyTheme = () => {
  let stored = null;
  let sidebar = null;
  try {
    stored = localStorage.getItem("da-theme");
    sidebar = localStorage.getItem("da-sidebar");
  } catch {
    // Almacenamiento bloqueado: se usa la preferencia del sistema
  }
  if (sidebar === "closed") document.documentElement.dataset.sidebar = "closed";
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
