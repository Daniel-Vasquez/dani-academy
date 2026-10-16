import { z } from "zod";

// Estos esquemas se usan en el navegador (formularios de login y registro). Zod 4 comprueba si puede
// usar `new Function` para acelerar la validación; aunque captura el error, la CSP estricta lo
// registra como violación (Lighthouse → Buenas prácticas). `jitless` evita esa comprobación.
z.config({ jitless: true });

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Introduce un correo válido")),
  password: z.string().min(1, "Introduce tu contraseña"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Mínimo 2 caracteres").max(60, "Máximo 60 caracteres"),
  email: z.string().trim().toLowerCase().pipe(z.email("Introduce un correo válido")),
  password: z.string().min(8, "Mínimo 8 caracteres").max(128, "Máximo 128 caracteres"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
