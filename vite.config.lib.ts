/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";
import packageJson from "./package.json";

const getPackageNameCamelCase = () => {
  try {
    return packageJson.name.replace(/-./g, char => char[1].toUpperCase());
  } catch {
    throw new Error("Name property in package.json is missing.");
  }
};

export default defineConfig({
  base: "./",
  build: {
    outDir: "./build/dist",
    lib: {
      entry: path.resolve(__dirname, "src/main.ts"),
      name: getPackageNameCamelCase(),
      formats: ["es", "iife", "cjs", "umd"],
      fileName: format => `${packageJson.name}.${format}.js`,
    },
  },
  test: {
    watch: false,
    globals: true,
    environment: "node",
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
});
