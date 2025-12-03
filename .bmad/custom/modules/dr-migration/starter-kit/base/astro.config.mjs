// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // Site URL - configure for production
  site: process.env.PUBLIC_SITE_URL || "http://localhost:4321",

  // Framework integrations
  integrations: [
    react(),
  ],

  // Vite configuration with Tailwind CSS v4
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["react", "react-dom"],
    },
  },

  // Image optimization
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  },

  // Build configuration
  build: {
    assets: "assets",
    inlineStylesheets: "auto",
  },

  // Server configuration
  server: {
    port: 4321,
    host: true,
  },

  // Output mode: 'static' | 'server' | 'hybrid'
  output: "static",
});
