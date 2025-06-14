import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DumbbellEditor from "./DumbbellEditor";

// Mock the Dumbbell component since it's a dependency
vi.mock("./Dumbell", () => ({
  default: ({ weight, weightUnit }: { weight: number; weightUnit: string }) => (
    <div data-testid="dumbbell-mock">
      {weight} {weightUnit}
    </div>
  ),
}));

describe("DumbbellEditor", () => {
  it("renders with required props", () => {
    const mockOnChange = vi.fn();
    const mockOnUnitChange = vi.fn();

    render(
      <DumbbellEditor
        weight={25}
        weightUnit="pounds"
        onChange={mockOnChange}
        onUnitChange={mockOnUnitChange}
      />,
    );

    // Should render the Dumbbell component
    const dumbbellMock = screen.getByTestId("dumbbell-mock");
    expect(dumbbellMock).toBeTruthy();
    expect(dumbbellMock).toHaveTextContent("25 pounds");

    // Should render weight input field
    const weightInput = screen.getByLabelText("Value");
    expect(weightInput).toBeTruthy();
    expect(weightInput).toHaveValue("25");

    // Should render unit selector
    const unitSelector = screen.getByLabelText("Unit");
    expect(unitSelector).toBeTruthy();

    // Should render up/down buttons
    const downButton = screen.getByRole("button", { name: "Down" });
    const upButton = screen.getByRole("button", { name: "Up" });
    expect(downButton).toBeTruthy();
    expect(upButton).toBeTruthy();
  });

  it("calls onChange when up/down buttons are clicked", async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    const mockOnUnitChange = vi.fn();

    render(
      <DumbbellEditor
        weight={25}
        weightUnit="pounds"
        onChange={mockOnChange}
        onUnitChange={mockOnUnitChange}
      />,
    );

    // Click up button should increase weight to next available weight (30)
    const upButton = screen.getByRole("button", { name: "Up" });
    await user.click(upButton);
    expect(mockOnChange).toHaveBeenCalledWith(30);

    // Click down button should decrease weight to previous available weight (20)
    const downButton = screen.getByRole("button", { name: "Down" });
    await user.click(downButton);
    expect(mockOnChange).toHaveBeenCalledWith(20);
  });

  it("handles settings dialog interaction", async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    const mockOnUnitChange = vi.fn();

    render(
      <DumbbellEditor
        weight={25}
        weightUnit="pounds"
        onChange={mockOnChange}
        onUnitChange={mockOnUnitChange}
      />,
    );

    // Open settings dialog by clicking the settings icon button
    const settingsButton = screen.getByTestId("SettingsIcon").closest("button");
    expect(settingsButton).toBeTruthy();
    await user.click(settingsButton!);

    // Should show dialog
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeTruthy();

    // Cancel the dialog
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    await user.click(cancelButton);

    // Dialog should close
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeFalsy();
    });
  });
});
