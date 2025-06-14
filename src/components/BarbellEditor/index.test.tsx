import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import BarbellEditor, { BarbellEditorProps } from "./index";

// Mock the child components
vi.mock("@/components/Barbell", () => ({
  default: ({
    weight,
    barWeight,
    plateSizes,
  }: {
    weight: number;
    barWeight: number;
    plateSizes: number[];
  }) => (
    <div data-testid="barbell">
      Barbell: weight={weight}, barWeight={barWeight}, plateSizes=
      {plateSizes.join(",")}
    </div>
  ),
}));

vi.mock("./SettingsDialog", () => ({
  default: ({
    open,
    onClose,
    plateSizes,
    onSave,
  }: {
    open: boolean;
    onClose: () => void;
    plateSizes: number[];
    onSave: (sizes: number[]) => void;
  }) => (
    <div
      data-testid="settings-dialog"
      style={{ display: open ? "block" : "none" }}
    >
      Settings Dialog: plateSizes={plateSizes.join(",")}
    </div>
  ),
}));

// Mock the hook
vi.mock("./useBarbellEditor", () => ({
  useBarbellEditor: () => ({
    settingsOpen: false,
    setSettingsOpen: vi.fn(),
    plateSizes: [45, 25, 10, 5, 2.5],
    handleSaveSettings: vi.fn(),
    badgeMetadata: {
      45: { sx: {}, count: 0 },
      25: { sx: {}, count: 0 },
      10: { sx: {}, count: 0 },
      5: { sx: {}, count: 0 },
      2.5: { sx: {}, count: 0 },
    },
    handleAdd: vi.fn(),
    handleClear: vi.fn(),
  }),
}));

const defaultProps: BarbellEditorProps = {
  totalWeight: 135,
  barWeight: 45,
  onChange: vi.fn(),
  weightUnit: "pounds",
  onUnitChange: vi.fn(),
};

describe("BarbellEditor", () => {
  it("renders with required components and controls", () => {
    render(<BarbellEditor {...defaultProps} />);
    expect(screen.getByTestId("barbell")).toHaveTextContent(
      "Barbell: weight=135, barWeight=45, plateSizes=45,25,10,5,2.5",
    );
    expect(screen.getByLabelText("Value")).toHaveValue("135");
    expect(screen.getByDisplayValue("pounds")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "45" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "25" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
    expect(screen.getByTestId("settings-dialog")).toHaveStyle("display: none");
  });
});
