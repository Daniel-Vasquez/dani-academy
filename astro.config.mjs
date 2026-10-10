// @ts-check
import { defineConfig, envField } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [react(), mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      // Temas duales: global.css elige uno según [data-theme]
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
      wrap: false,
    },
  },
  security: {
    // CSP en <meta> con hashes de los scripts que emite Astro (solo en build, no en dev).
    // Shiki pinta el código con estilos en línea, así que style-src necesita 'unsafe-inline';
    // la protección importante contra XSS es la de script-src, que no la lleva.
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self' data:", // fontsource incrusta algunas fuentes pequeñas como data:
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
      styleDirective: { resources: ["'self'", "'unsafe-inline'"] },
    },
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },
  env: {
    schema: {
      MONGODB_URI: envField.string({ context: "server", access: "secret", startsWith: "mongodb" }),
      MONGODB_DB: envField.string({ context: "server", access: "secret", default: "dani_academy" }),
      BETTER_AUTH_SECRET: envField.string({ context: "server", access: "secret", min: 32 }),
      BETTER_AUTH_URL: envField.string({ context: "server", access: "secret", url: true }),
      APP_TIMEZONE: envField.string({
        context: "server",
        access: "public",
        default: "America/Mexico_City",
      }),
    },
  },
});
