import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Home from "./page";

// Mock Next.js Link component
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock the Breadcrumbs component
vi.mock("@/components/Breadcrumbs", () => ({
  default: ({ pathname }: { pathname: string }) => (
    <div data-testid="breadcrumbs">{pathname}</div>
  ),
}));

describe("Home Page Integration", () => {
  it("renders the home page with navigation buttons", () => {
    render(<Home />);

    // Check if breadcrumbs are rendered
    expect(screen.getByTestId("breadcrumbs")).toBeInTheDocument();

    // Check if navigation buttons are rendered
    expect(
      screen.getByRole("link", { name: /exercises/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /superblock/i }),
    ).toBeInTheDocument();

    // Check if buttons have correct hrefs
    expect(screen.getByRole("link", { name: /exercises/i })).toHaveAttribute(
      "href",
      "/exercise",
    );
    expect(screen.getByRole("link", { name: /superblock/i })).toHaveAttribute(
      "href",
      "/superblock",
    );
  });

  it("renders buttons with correct styling", () => {
    render(<Home />);

    const exercisesButton = screen.getByRole("link", { name: /exercises/i });
    const superblockButton = screen.getByRole("link", { name: /superblock/i });

    // Check if buttons have MUI classes (indicating proper styling)
    expect(exercisesButton).toHaveClass("MuiButton-contained");
    expect(superblockButton).toHaveClass("MuiButton-contained");
  });
});
