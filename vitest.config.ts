import react from "@vitejs/plugin-react";
import "dotenv/config";
import { loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => ({
  plugins: [react(), tsconfigPaths()],
  test: {
    env: loadEnv(mode, process.cwd(), ""),
    environment: "happy-dom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
    css: false,
    include: [
      "**/*.{test,spec}.{ts,tsx}",
      "**/*.integration.{test,spec}.{ts,tsx}",
    ],
    exclude: ["**/node_modules/**", "**/dist/**", "./src/database.types.ts"],
    server: {
      deps: {
        inline: ["next-auth"],
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: "./coverage",
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/.next/**",
        "**/*.config.ts",
        "**/*.d.ts",
        "**/*json",
        "src/testUtil/**", // Exclude all test utilities from coverage
        "src/database.types.ts",
        "src/middleware.ts",
        "src/app/layout.tsx",
        "eslint.config.mjs",
        "jest.config.js",
        "postcss.config.mjs",
        "stryker.conf.js",
      ],
    },
  },
}));
