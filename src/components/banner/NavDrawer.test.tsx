import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import NavDrawer from "./NavDrawer";

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

const mockNavItems = [
  { label: "Exercise", href: "/exercise" },
  { label: "Superblock", href: "/superblock" },
];

const mockHandleDrawerToggle = vi.fn();

const defaultProps = {
  open: true,
  handleDrawerToggle: mockHandleDrawerToggle,
  navItems: mockNavItems,
};

describe("NavDrawer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the navigation drawer with home link and nav items", () => {
    render(<NavDrawer {...defaultProps} />);

    //
    expect(screen.getByText("Weight Training")).toBeInTheDocument();

    // Check for nav items
    expect(screen.getByText("Exercise")).toBeInTheDocument();
    expect(screen.getByText("Superblock")).toBeInTheDocument();
  });

  it("calls handleDrawerToggle when drawer content is clicked", () => {
    render(<NavDrawer {...defaultProps} />);

    const drawerContent = screen.getByText("Weight Training").closest("div");
    if (drawerContent) {
      fireEvent.click(drawerContent);
      expect(mockHandleDrawerToggle).toHaveBeenCalled();
    }
  });
  it("renders with open false", () => {
    render(<NavDrawer {...defaultProps} open={false} />);

    // Component should still render the content even when closed
    expect(screen.getByText("Weight Training")).toBeInTheDocument();
  });

  it("renders empty nav items array", () => {
    render(<NavDrawer {...defaultProps} navItems={[]} />);

    // Home link should still be present
    expect(screen.getByText("Weight Training")).toBeInTheDocument();

    // But nav items should not be present
    expect(screen.queryByText("Exercise")).not.toBeInTheDocument();
    expect(screen.queryByText("Superblock")).not.toBeInTheDocument();
  });
});
