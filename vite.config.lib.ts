/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    outDir: "./dist/lib",
    lib: {
      entry: path.resolve(__dirname, "src/main.ts"),
      name: "ProzorroEds",
      formats: ["es", "iife", "cjs", "umd"],
      fileName: format => `prozorro-eds.${format}.js`,
    },
  },
  test: {
    watch: false,
    globals: true,
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@@": path.resolve(__dirname),
    },
  },
});
