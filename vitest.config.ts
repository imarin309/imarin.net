import path from "path";
import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { remarkPlugins } from "./src/lib/mdx-plugins";

export default defineConfig({
  plugins: [{ enforce: "pre", ...mdx({ remarkPlugins }) }, react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
});
