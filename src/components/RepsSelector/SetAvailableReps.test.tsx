import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SetAvailableReps from "./SetAvailableReps";

// Mock the useSetAvailableReps hook
vi.mock("./useSetAvailableReps", () => ({
  useSetAvailableReps: () => ({
    open: false,
    choices: [5, 8, 10],
    pendingRepInput: "",
    handleOpen: vi.fn(),
    handleCancel: vi.fn(),
    handleSave: vi.fn(),
    setChoices: vi.fn(),
    handleRemoveRep: vi.fn(),
    handlePendingRepInputChange: vi.fn(),
    handleAddPendingRepAsChoice: vi.fn(),
  }),
}));

describe("SetAvailableReps", () => {
  it("renders with required props", () => {
    const mockOnClose = vi.fn();
    const mockRepChoices = [5, 8, 10];

    render(
      <SetAvailableReps repChoices={mockRepChoices} onClose={mockOnClose} />,
    );

    // Should render the settings icon button
    const settingsButton = screen.getByRole("button");
    expect(settingsButton).toBeTruthy();

    // Should have the settings icon
    const settingsIcon = screen.getByTestId("SettingsIcon");
    expect(settingsIcon).toBeTruthy();

    // Dialog should not be visible initially (open: false in mock)
    const dialogTitle = screen.queryByText("Rep Choices Settings");
    expect(dialogTitle).toBeFalsy();
  });
});
