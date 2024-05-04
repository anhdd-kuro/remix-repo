import * as path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    includeSource: ["./**/*.test.{ts,tsx,js,jsx}"],
    exclude: ["node_modules", "e2e", "coverage", "dist", "build"],
    coverage: {
      provider: "v8",
      enabled: true,
      include: ["./**"],
    },
    testTimeout: 1000 * 10,
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "."),
    },
  },
  plugins: [],
});
