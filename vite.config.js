import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import electron from "vite-plugin-electron";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  build: {
    // Excluir módulos problemáticos de Tailwind v4
    rollupOptions: {
      external: [
        "@tailwindcss/oxide",
        "@tailwindcss/oxide-wasm32-wasi",
        "@emnapi/core",
      ],
    },
  },
  plugins: [
    electron([{ entry: "electron/main.cjs" },{ entry: "electron/preload.cjs"}]),
    tailwindcss({
      config: {
        experimental: {
          optimizeUniversalDefaults: false,
        },
        theme: {
          extend: {
            keyframes: {
              "fade-in-down": {
                "0%": { opacity: "0", transform: "translateY(-10px)" },
                "100%": { opacity: "1", transform: "translateY(0)" },
              },
            },
            animation: {
              "fade-in-down": "fade-in-down 0.3s ease-out",
            },
          },
        },
      },
    }),
    react(),
  ],
  server: {
    watch: {
      usePolling: true, // 🔹 Asegura que Vite detecte cambios
    },
    hmr: {
      overlay: false, // 🔹 Evita errores bloqueantes en la pantalla
    },
  },
});
