import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { BETTER_AUTH_SECRET, BETTER_AUTH_URL } from "astro:env/server";
import { db, mongoClient } from "@/lib/mongo";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

/**
 * En producción solo se confía en BETTER_AUTH_URL.
 * En desarrollo también en el origen real de la petición si es local: Astro cambia de puerto
 * cuando el 4321 está ocupado y BETTER_AUTH_URL no tiene por qué coincidir.
 */
function trustedOrigins(request?: Request): string[] {
  if (!import.meta.env.DEV || !request) return [BETTER_AUTH_URL];
  const { origin, hostname } = new URL(request.url);
  return LOCAL_HOSTS.has(hostname) ? [BETTER_AUTH_URL, origin] : [BETTER_AUTH_URL];
}

export const auth = betterAuth({
  appName: "Dani Academy",
  baseURL: BETTER_AUTH_URL,
  secret: BETTER_AUTH_SECRET,
  // Pasar el cliente permite a Better Auth usar transacciones (requiere replica set: Atlas lo es)
  database: mongodbAdapter(db, { client: mongoClient }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true, // tras registrarse, la sesión queda iniciada
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    // Sin sendResetPassword: la recuperación de contraseña queda deshabilitada
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 días
    updateAge: 60 * 60 * 24, // renueva la expiración como mucho una vez al día
    cookieCache: { enabled: true, maxAge: 5 * 60 }, // evita ir a Mongo en cada petición
  },
  trustedOrigins,
});

export type AuthSession = typeof auth.$Infer.Session;
