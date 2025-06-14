import { describe, expect, it, vi } from "vitest";
import { handleSignIn, handleSignOut } from "./actions";

// Mock the auth module
vi.mock("@/auth", () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

describe("Banner Actions", () => {
  it("calls signIn with google provider when handleSignIn is called", async () => {
    const { signIn } = await import("@/auth");

    await handleSignIn();

    expect(signIn).toHaveBeenCalledWith("google");
  });

  it("calls signOut when handleSignOut is called", async () => {
    const { signOut } = await import("@/auth");

    await handleSignOut();

    expect(signOut).toHaveBeenCalledWith();
  });
});
