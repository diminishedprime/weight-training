import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
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
});
