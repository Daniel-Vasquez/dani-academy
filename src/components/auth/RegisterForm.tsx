import { useState } from "react";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@/lib/zod-resolver";
import { registerSchema, type RegisterInput } from "@/schemas/auth";
import { FormAlert, submitButtonClass } from "./FormAlert";
import { TextField } from "./TextField";

export default function RegisterForm({ redirectTo }: { redirectTo: string }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema), mode: "onBlur" });

  const onSubmit = handleSubmit(async ({ name, email, password }) => {
    setServerError(null);
    const { error } = await authClient.signUp.email({ name, email, password });
    if (error) {
      setServerError(
        error.status === 429
          ? "Demasiados registros desde esta conexión. Vuelve a probar más tarde."
          : "No se pudo crear la cuenta. Si ya tienes una, inicia sesión.",
      );
      return;
    }
    window.location.assign(redirectTo); // recarga completa: el servidor ya ve la cookie
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <TextField
        label="Nombre"
        type="text"
        autoComplete="name"
        error={errors.name?.message}
        {...register("name")}
      />
      <TextField
        label="Correo"
        type="email"
        autoComplete="email"
        inputMode="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <TextField
        label="Contraseña"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <FormAlert message={serverError} />

      <button type="submit" disabled={isSubmitting} className={submitButtonClass}>
        {isSubmitting ? "Creando cuenta…" : "Crear cuenta"}
      </button>
    </form>
  );
}
