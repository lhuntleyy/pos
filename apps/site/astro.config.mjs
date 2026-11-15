import { defineConfig } from "astro/config";

// Situs statis: beranda, harga, kebijakan. Di-deploy sebagai file statis di belakang Caddy.
export default defineConfig({
  server: { port: 4321 },
});
