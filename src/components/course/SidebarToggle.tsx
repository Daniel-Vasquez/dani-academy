import { useEffect, useState } from "react";
import { SIDEBAR_STORAGE_KEY } from "@/lib/constants";

/**
 * Oculta o muestra el índice del curso en escritorio. El servidor no conoce la preferencia, así
 * que el primer render es siempre "abierto" y se corrige en el efecto (sin error de hidratación).
 * Lo que se ve no depende de ese efecto: theme-init.js pone data-sidebar en <html> antes del
 * primer pintado, y el ancho de las columnas y la flecha salen de ahí, sin saltos al cargar.
 */
export default function SidebarToggle() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    try {
      // Es la lectura de un sistema externo al montar: en el render rompería la hidratación
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSidebarOpen(localStorage.getItem(SIDEBAR_STORAGE_KEY) !== "closed");
    } catch {
      // Almacenamiento bloqueado: se queda abierto
    }
  }, []);

  const toggle = () => {
    const next = !isSidebarOpen;
    setIsSidebarOpen(next);
    if (next) delete document.documentElement.dataset.sidebar;
    else document.documentElement.dataset.sidebar = "closed";
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, next ? "open" : "closed");
    } catch {
      // Almacenamiento bloqueado (modo privado): dura hasta cambiar de página
    }
  };

  const label = isSidebarOpen ? "Ocultar temario" : "Mostrar temario";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-expanded={isSidebarOpen}
      aria-controls="temario"
      aria-label={label}
      title={label}
      className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-lg border border-surface-2 bg-surface text-muted transition-[translate,background-color,color] duration-300 ease-in-out hover:bg-surface-2 hover:text-fg sidebar-closed:translate-x-full"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="size-4 fill-none stroke-current stroke-2 transition-transform duration-300 ease-in-out [stroke-linecap:round] [stroke-linejoin:round] sidebar-closed:rotate-180"
      >
        <path d="m11 17-5-5 5-5M18 17l-5-5 5-5" />
      </svg>
    </button>
  );
}
