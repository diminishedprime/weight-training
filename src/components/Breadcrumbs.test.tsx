import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Breadcrumbs from "./Breadcrumbs";

// Mock Next.js Link component
vi.mock("next/link", () => {
  return {
    default: function MockedLink({
      children,
      href,
    }: {
      children: React.ReactNode;
      href: string;
    }) {
      return <a href={href}>{children}</a>;
    },
  };
});

describe("Breadcrumbs", () => {
  it("renders breadcrumbs with home link and converts path parts to title case", () => {
    render(<Breadcrumbs pathname="/user-profile/edit-settings" />);

    // Check for home link
    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");

    // Check for breadcrumb parts with title case conversion (hyphens and underscores converted to spaces and title case)
    const userProfileLink = screen.getByRole("link", { name: "User Profile" });
    expect(userProfileLink).toBeInTheDocument();
    expect(userProfileLink).toHaveAttribute("href", "/user-profile");

    // Last part should be text (not a link) and title-cased
    expect(screen.getByText("Edit Settings")).toBeInTheDocument();
  });
});
