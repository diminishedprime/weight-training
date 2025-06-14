import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import WarmupCheckbox from "./WarmupCheckbox";

describe("WarmupCheckbox", () => {
  it("renders checkbox with label and calls onChange when clicked", () => {
    const mockOnChange = vi.fn();
    render(<WarmupCheckbox checked={false} onChange={mockOnChange} />);

    // Check that the checkbox and label are rendered
    const checkbox = screen.getByRole("checkbox", { name: "Warmup" });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    // Click the checkbox and verify onChange is called
    fireEvent.click(checkbox);
    expect(mockOnChange).toHaveBeenCalled();
  });
});
