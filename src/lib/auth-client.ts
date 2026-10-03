import { createAuthClient } from "better-auth/client";

// Sin baseURL: usa el mismo origen que la página. Sirve en islas React y en <script> de Astro.
export const authClient = createAuthClient();
