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
    env: {
      SUPABASE_URL: "https://test.supabase.co",
      SUPABASE_ANON_KEY: "test-anon-key",
      SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
      AUTH_SECRET: "test-auth-secret",
      AUTH_SUPABASE_URL: "https://test.supabase.co",
      AUTH_SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
    },
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
});
