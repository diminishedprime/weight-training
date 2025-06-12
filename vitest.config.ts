import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
    css: false,
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/dist/**", "./src/database.types.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: "./coverage",
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/*.config.ts",
        "**/*.d.ts",
        "**/*json",
        "src/database.types.ts",
        "src/app/**",
        "src/middleware.ts",
      ],
    },
  },
});
