import { useState } from "react";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@/lib/zod-resolver";
import { loginSchema, type LoginInput } from "@/schemas/auth";
import { FormAlert, submitButtonClass } from "./FormAlert";
import { TextField } from "./TextField";

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema), mode: "onBlur" });

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setServerError(null);
    const { error } = await authClient.signIn.email({ email, password });
    if (error) {
      // Mensaje genérico: no revela si el correo existe (temario I5.5)
      setServerError(
        error.status === 429
          ? "Demasiados intentos. Espera un momento y vuelve a probar."
          : "Correo o contraseña incorrectos.",
      );
      return;
    }
    window.location.assign(redirectTo);
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
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
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <FormAlert message={serverError} />

      <button type="submit" disabled={isSubmitting} className={submitButtonClass}>
        {isSubmitting ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
