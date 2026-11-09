import { useEffect, useState } from "react";

/** Devuelve `value` solo cuando lleva `delay` ms sin cambiar (temario I2: efectos con limpieza) */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // cada pulsación cancela la anterior
  }, [value, delay]);

  return debounced;
}
