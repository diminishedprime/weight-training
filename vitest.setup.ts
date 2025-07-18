import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// Patch console.warn globally to suppress noisy GoTrueClient warnings from Supabase during tests.
// This is necessary because Supabase emits a warning when multiple GoTrueClient instances are created
// in the same browser context, which is common in test environments. The warning is harmless in tests
// and clutters the output, so we filter it out here.
const originalWarn = console.warn;

// Use setup hooks compatible with Vitest global setup files
// (https://vitest.dev/guide/setup.html#global-setup)
console.warn = (msg, ...args) => {
  if (
    typeof msg === "string" &&
    msg.includes("Multiple GoTrueClient instances detected")
  ) {
    return;
  }
  originalWarn(msg, ...args);
};

// Patch console.error to suppress the same act warning if it appears as an error
const originalError = console.error;
console.error = (msg, ...args) => {
  if (
    typeof msg === "string" &&
    msg.includes(
      "The current testing environment is not configured to support act("
    )
  ) {
    return;
  }
  originalError(msg, ...args);
};

// Mock next/navigation
vi.mock("next/navigation", () => {
  const actual = vi.importActual("next/navigation");
  return {
    ...actual,
    redirect: vi.fn(),
    usePathname: vi.fn(), // if you use it
    useRouter: vi.fn(() => ({ push: vi.fn(), replace: vi.fn() })), // add replace if you use it
    useSearchParams: vi.fn(() => ({
      get: vi.fn(() => null),
      toString: vi.fn(() => ""),
    })),
    notFound: vi.fn(),
  };
});

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  unstable_cache: vi.fn(),
}));

// Add any other global test setup or mocks here
