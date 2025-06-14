import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { User } from "next-auth";
import AuthenticatedUserView from "./AuthenticatedUserView";

// Mock the actions
vi.mock("./actions", () => ({
  handleSignOut: vi.fn(),
}));

const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  image: "https://example.com/avatar.jpg",
};

describe("AuthenticatedUserView", () => {
  it("renders user avatar and info", () => {
    render(<AuthenticatedUserView user={mockUser} />);
    const avatarButton = screen.getByRole("button", { name: /John Doe/i });
    expect(avatarButton).toBeInTheDocument();
    expect(avatarButton).toHaveAttribute("aria-haspopup", "true");
    expect(avatarButton).not.toHaveAttribute("aria-expanded");
  });

  it("opens menu when avatar is clicked and shows user info", async () => {
    const user = userEvent.setup();
    render(<AuthenticatedUserView user={mockUser} />);

    // Click the avatar button to open menu
    const avatarButton = screen.getByRole("button", { name: /John Doe/i });
    await user.click(avatarButton);

    // Check that menu is now open
    expect(avatarButton).toHaveAttribute("aria-expanded", "true");

    // Check that user info appears in the menu
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: /sign out/i }),
    ).toBeInTheDocument();
  });
});
