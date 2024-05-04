import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: false,
  plugins: [],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "app"),
    },
  },
  build: {
    lib: {
      entry: {
        customer: path.resolve(
          __dirname,
          "app/global/domain/customer/index.extension.ts"
        ),
        "customer-qr": path.resolve(
          __dirname,
          "app/routes/app.api.customer.token._index/customer-qr.extension.ts"
        ),
      },
      name: "KbcWebComponents",
      formats: ["cjs"],
    },
    rollupOptions: {
      external: [],
      output: {
        dir: "extensions/customer/assets",
        entryFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
        chunkFileNames: "[name].js",
      },
    },
    cssCodeSplit: true,
    minify: "esbuild",
    emptyOutDir: true,
  },
});
