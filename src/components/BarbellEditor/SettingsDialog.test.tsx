import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SettingsDialog from "./SettingsDialog";

const defaultProps = {
  open: true,
  onClose: vi.fn(),
  plateSizes: [45, 25, 10, 5, 2.5],
  onSave: vi.fn(),
};

describe("SettingsDialog", () => {
  it("renders with plate selection interface", () => {
    render(<SettingsDialog {...defaultProps} />);

    expect(screen.getByText("Barbell Settings")).toBeInTheDocument();
    expect(screen.getByText("Available Plates:")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();

    // Check that selected plates are shown as filled chips
    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("2.5")).toBeInTheDocument();
  });
});
