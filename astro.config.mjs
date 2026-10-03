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
      APP_TIMEZONE: envField.string({ context: "server", access: "public", default: "UTC" }),
    },
  },
});
