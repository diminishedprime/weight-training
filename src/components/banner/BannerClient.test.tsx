import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BannerClient from "./BannerClient";
import { User } from "next-auth";

// Mock the child components to focus on BannerClient logic
vi.mock("./AuthenticatedUserView", () => ({
  default: ({ user }: { user: User }) => (
    <div data-testid="authenticated-user-view">User: {user.name}</div>
  ),
}));

vi.mock("./NavDrawer", () => ({
  default: ({ open, handleDrawerToggle, navItems }: any) => (
    <div data-testid="nav-drawer">
      <span>Open: {open.toString()}</span>
      <button onClick={handleDrawerToggle}>Toggle</button>
      <div>Nav items: {navItems.length}</div>
    </div>
  ),
}));

describe("BannerClient", () => {
  it("renders app bar with menu button and title", () => {
    const mockUser: User = {
      id: "1",
      name: "Test User",
      email: "test@example.com",
    };

    render(<BannerClient user={mockUser} />);

    // Check that the app title is rendered
    expect(screen.getByText("Weight Training")).toBeInTheDocument();

    // Check that the menu icon button is rendered
    const menuButton = screen.getByRole("button", { name: "open drawer" });
    expect(menuButton).toBeInTheDocument();

    // Check that AuthenticatedUserView is rendered when user is provided
    expect(screen.getByTestId("authenticated-user-view")).toBeInTheDocument();
    expect(screen.getByText("User: Test User")).toBeInTheDocument();

    // Check that NavDrawer is rendered and initially closed
    expect(screen.getByTestId("nav-drawer")).toBeInTheDocument();
    expect(screen.getByText("Open: false")).toBeInTheDocument();

    // Check that navigation items are passed to NavDrawer
    expect(screen.getByText("Nav items: 2")).toBeInTheDocument();
  });
});
