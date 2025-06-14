import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RootLayout from "./layout";

// Mock the Banner component
vi.mock("@/components/banner", () => ({
  default: () => <div data-testid="banner">Banner</div>,
}));

// Mock MUI Next.js integration
vi.mock("@mui/material-nextjs/v15-appRouter", () => ({
  AppRouterCacheProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="cache-provider">{children}</div>
  ),
}));

describe("Root Layout Integration", () => {
  it("renders the layout with all required components", async () => {
    const TestComponent = () => (
      <div data-testid="test-child">Test Content</div>
    );

    const LayoutComponent = await RootLayout({
      children: <TestComponent />,
    });

    render(LayoutComponent);

    // Check if banner is rendered
    expect(screen.getByTestId("banner")).toBeInTheDocument();

    // Check if children are rendered
    expect(screen.getByTestId("test-child")).toBeInTheDocument();

    // Check if cache provider is rendered
    expect(screen.getByTestId("cache-provider")).toBeInTheDocument();
  });

  it("applies correct HTML structure", async () => {
    const TestComponent = () => <div>Test Content</div>;

    const LayoutComponent = await RootLayout({
      children: <TestComponent />,
    });

    const { container } = render(LayoutComponent);

    // Check if the rendered component has the expected structure
    expect(
      container.querySelector('[data-testid="cache-provider"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="banner"]'),
    ).toBeInTheDocument();
  });
});
