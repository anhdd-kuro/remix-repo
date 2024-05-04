import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    "process.env.NODE_ENV": JSON.stringify(mode),
  },
  minify: true,
  plugins: [],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "."),
      "@": path.resolve(__dirname, "."),
    },
  },
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, "index.ts"),
      },
      formats: ["es"],
    },
    cssMinify: true,
    minify: "esbuild",
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled into your library
      external: [],
    },
  },
}));
