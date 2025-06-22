import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NotFound from "./not-found";

// Mock Next.js Link component
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("Not Found Page Integration", () => {
  it("renders the 404 page with correct content", () => {
    render(<NotFound />);

    // Check if 404 heading is rendered
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
    expect(
      screen.getByText("Sorry, the page you are looking for does not exist.")
    ).toBeInTheDocument();
  });

  it("renders a link to go back home", () => {
    render(<NotFound />);

    const homeLink = screen.getByRole("link", { name: /go home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("applies correct styling classes", () => {
    render(<NotFound />);

    const heading = screen.getByText("404");
    expect(heading).toHaveClass("text-5xl", "font-bold", "text-gray-800");

    const homeLink = screen.getByRole("link", { name: /go home/i });
    expect(homeLink).toHaveClass("px-4", "py-2", "bg-blue-600", "text-white");
  });
});
