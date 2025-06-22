import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Banner from "./index";

// Mock the auth module
vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

// Mock the BannerClient component
vi.mock("./BannerClient", () => ({
  default: ({ user }: { user: { name?: string } | null }) => (
    <div data-testid="banner-client">
      {user ? `User: ${user.name}` : "No user"}
    </div>
  ),
}));

describe("Banner", () => {
  it("renders BannerClient with user when session exists", async () => {
    const { auth } = await import("@/auth");
    const mockAuth = auth as unknown as ReturnType<typeof vi.fn>;

    mockAuth.mockResolvedValue({
      user: {
        id: "1",
        name: "Test User",
        email: "test@example.com",
      },
    });

    const BannerComponent = await Banner();
    render(BannerComponent);

    expect(screen.getByTestId("banner-client")).toBeInTheDocument();
    expect(screen.getByText("User: Test User")).toBeInTheDocument();
  });

  it("renders BannerClient with undefined user when no session", async () => {
    const { auth } = await import("@/auth");
    const mockAuth = auth as unknown as ReturnType<typeof vi.fn>;

    mockAuth.mockResolvedValue(null);

    const BannerComponent = await Banner();
    render(BannerComponent);

    expect(screen.getByTestId("banner-client")).toBeInTheDocument();
    expect(screen.getByText("No user")).toBeInTheDocument();
  });
});
