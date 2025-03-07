import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import electron from "vite-plugin-electron";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [electron({ entry: "electron/main.cjs" }), tailwindcss(), react()],
  server: {
    watch: {
      usePolling: true, // 🔹 Asegura que Vite detecte cambios
    },
    hmr: {
      overlay: false, // 🔹 Evita errores bloqueantes en la pantalla
    },
  },
});
