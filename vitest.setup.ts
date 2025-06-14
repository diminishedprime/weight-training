import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// Mock next/navigation
vi.mock("next/navigation", () => {
  const actual = vi.importActual("next/navigation");
  return {
    ...actual,
    redirect: vi.fn(),
    usePathname: vi.fn(), // if you use it
    useRouter: vi.fn(() => ({ push: vi.fn() })), // if you use it
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
