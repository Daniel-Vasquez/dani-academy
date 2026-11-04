const RESET_MS = 2000;

const MESSAGES = { copied: "Código copiado", error: "No se pudo copiar el código" } as const;

const timers = new WeakMap<HTMLElement, number>();

function show(button: HTMLElement, state: keyof typeof MESSAGES) {
  const status = button.nextElementSibling;
  button.dataset.state = state;
  button.setAttribute("aria-label", MESSAGES[state]);
  if (status) status.textContent = MESSAGES[state];

  clearTimeout(timers.get(button));
  timers.set(
    button,
    window.setTimeout(() => {
      button.dataset.state = "idle";
      button.setAttribute("aria-label", "Copiar código");
      if (status) status.textContent = "";
    }, RESET_MS),
  );
}

// Un solo listener en document, y no uno por bloque: una lección puede tener más de 50, los del
// Quiz los pinta React después, y document sobrevive a los cambios de página de ClientRouter
document.addEventListener("click", async (event) => {
  const button = (event.target as Element).closest<HTMLElement>("[data-copy-code]");
  const code = button?.parentElement?.parentElement?.querySelector("pre code");
  if (!button || !code) return;

  try {
    await navigator.clipboard.writeText((code.textContent ?? "").replace(/\n$/, ""));
    show(button, "copied");
  } catch {
    show(button, "error"); // sin HTTPS no hay Clipboard API, y el navegador puede denegar el permiso
  }
});
