import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EffortEditor } from "./EffortEditor";

describe("EffortEditor", () => {
  it("renders effort toggle buttons and calls onChange when clicked", () => {
    const mockOnChange = vi.fn();
    render(<EffortEditor value={null} onChange={mockOnChange} />);

    // Check that all effort buttons are rendered using role
    expect(screen.getByRole("button", { name: "Easy" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Okay" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hard" })).toBeInTheDocument();

    // Click the "Okay" button and verify onChange is called
    const okayButton = screen.getByRole("button", { name: "Okay" });
    fireEvent.click(okayButton);
    expect(mockOnChange).toHaveBeenCalledWith("okay");
  });
});
