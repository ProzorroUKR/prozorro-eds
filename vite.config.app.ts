import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  base: "./",
  build: {
    outDir: "./build/app",
    emptyOutDir: false, // so it doesn't wipe out your library build
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@@": path.resolve(__dirname),
    },
  },
});
