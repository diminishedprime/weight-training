import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RepsSelector, { RepsSelectorProps } from "./index";

// Mock the SetAvailableReps component
vi.mock("./SetAvailableReps", () => ({
  default: ({
    repChoices,
    _onClose,
  }: {
    repChoices: number[];
    _onClose: (choices: number[]) => void;
  }) => (
    <div data-testid="set-available-reps">
      Set Available Reps: {repChoices.join(", ")}
    </div>
  ),
}));

const defaultProps: RepsSelectorProps = {
  reps: 5,
  onChange: vi.fn(),
};

describe("RepsSelector", () => {
  it("renders with default rep choices and current reps value", () => {
    render(<RepsSelector {...defaultProps} />);

    expect(screen.getByText("Reps: 5")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "-" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "+" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "5" })).toHaveClass(
      "MuiButton-contained"
    );
    expect(screen.getByTestId("set-available-reps")).toHaveTextContent(
      "Set Available Reps: 1, 3, 5, 8, 10, 12, 15"
    );
  });
});
