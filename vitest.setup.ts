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

// Add any other global test setup or mocks here
