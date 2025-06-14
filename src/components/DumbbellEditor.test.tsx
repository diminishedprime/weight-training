import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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
});
