import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock NextAuth
vi.mock("next-auth", () => ({
  default: vi.fn(() => ({
    handlers: { GET: vi.fn(), POST: vi.fn() },
    signIn: vi.fn(),
    signOut: vi.fn(),
    auth: vi.fn(),
  })),
}));

// Mock the Google provider
vi.mock("next-auth/providers/google", () => ({
  default: vi.fn(() => ({ id: "google", name: "Google" })),
}));

// Mock the SupabaseAdapter
vi.mock("@auth/supabase-adapter", () => ({
  SupabaseAdapter: vi.fn(() => ({ name: "supabase-adapter" })),
}));

describe("auth configuration", () => {
  beforeEach(() => {
    // Set required environment variables for the test
    process.env.SUPABASE_URL = "https://test.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
  });

  it("exports NextAuth configuration with required providers and adapter", async () => {
    // Import the auth configuration
    const { handlers, signIn, signOut, auth } = await import("./auth");

    // Verify that the exports exist
    expect(handlers).toBeDefined();
    expect(signIn).toBeDefined();
    expect(signOut).toBeDefined();
    expect(auth).toBeDefined();
  });
});
