/** Error general del formulario (respuesta del servidor), anunciado a lectores de pantalla. */
export function FormAlert({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-xl border border-danger/50 bg-danger/10 px-4 py-3 text-sm text-danger-strong"
    >
      {message}
    </p>
  );
}

export const submitButtonClass =
  "w-full rounded-xl bg-accent-strong px-5 py-3 text-sm font-semibold text-accent-contrast transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60";
