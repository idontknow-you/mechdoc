import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [tailwindcss()],
  esbuild: { jsx: "automatic" },
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@components": fileURLToPath(new URL("../../TANVI doc", import.meta.url)),
      "@ui": fileURLToPath(new URL("./src/components", import.meta.url)),
    },
  },
  server: {
    host: "127.0.0.1",
    proxy: { "/api": { target: "http://127.0.0.1:5000", changeOrigin: true } },
    fs: { allow: [fileURLToPath(new URL("../..", import.meta.url))] },
  },
});
