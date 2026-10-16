import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [tailwindcss()],
  esbuild: { jsx: "automatic" },
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@components": fileURLToPath(new URL(".", import.meta.url)),
      "@ui": fileURLToPath(new URL("../mechdoctor-main/frontend/src/components", import.meta.url)),
    },
  },
  server: {
    proxy: { "/api": { target: "http://127.0.0.1:5000", changeOrigin: true } },
    fs: { allow: [fileURLToPath(new URL("..", import.meta.url))] },
  },
});
