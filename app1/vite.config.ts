import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// APP_BASE=/app/ para servir sob lettucebr.com/app; padrão "/" para o subdomínio.
export default defineConfig({
  base: process.env.APP_BASE ?? "/",
  plugins: [react()],
  build: { outDir: "dist" },
});
