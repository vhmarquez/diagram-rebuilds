import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { defineConfig } from "vite";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const pagesRoot = resolve(projectRoot, "pages-static");

export default defineConfig({
  base: process.env.PAGES_BASE_PATH ?? "/diagram-rebuilds/",
  plugins: [react()],
  publicDir: resolve(projectRoot, "public"),
  resolve: {
    alias: {
      "@": projectRoot,
    },
  },
  root: pagesRoot,
  build: {
    emptyOutDir: true,
    outDir: resolve(projectRoot, "dist-pages"),
    rollupOptions: {
      input: {
        index: resolve(pagesRoot, "index.html"),
        timeline: resolve(pagesRoot, "timeline/index.html"),
        navigator: resolve(pagesRoot, "navigator/index.html"),
        rls: resolve(pagesRoot, "rls/index.html"),
        liquidSpectrum: resolve(pagesRoot, "liquid-spectrum/index.html"),
      },
    },
  },
});
