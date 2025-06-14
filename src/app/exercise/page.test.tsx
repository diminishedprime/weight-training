import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ExercisePage from "./page";

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

describe("Exercise Page Integration", () => {
  it("renders the exercise page with equipment sections", () => {
    render(<ExercisePage />);

    // Check if breadcrumbs are rendered
    expect(screen.getByTestId("breadcrumbs")).toBeInTheDocument();

    // Check if equipment type headings are rendered
    expect(screen.getByText("Barbell")).toBeInTheDocument();
    expect(screen.getByText("Machine")).toBeInTheDocument();
  });

  it("renders exercise type buttons for each equipment", () => {
    render(<ExercisePage />);

    // Should have buttons for barbell exercises
    expect(
      screen.getByRole("link", { name: /bench press/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /squat/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /deadlift/i })).toBeInTheDocument();

    // Should have buttons for machine exercises
    expect(
      screen.getByRole("link", { name: /leg press/i }),
    ).toBeInTheDocument();
  });
  it("generates correct href paths for exercise buttons", () => {
    render(<ExercisePage />);

    // Check that exercise buttons have correct paths
    const benchPressButton = screen.getByRole("link", { name: /bench press/i });
    expect(benchPressButton).toHaveAttribute(
      "href",
      "/exercise/barbell_bench_press",
    );

    const squatButton = screen.getByRole("link", { name: /squat/i });
    expect(squatButton).toHaveAttribute("href", "/exercise/barbell_squat");
  });
});
