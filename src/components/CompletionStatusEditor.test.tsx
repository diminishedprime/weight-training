import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CompletionStatusEditor from "./CompletionStatusEditor";

describe("CompletionStatusEditor", () => {
  it("renders select with label and all completion status options", () => {
    const mockOnChange = vi.fn();
    render(
      <CompletionStatusEditor value="not_completed" onChange={mockOnChange} />,
    );

    // Check that the select and label are rendered
    expect(screen.getByLabelText("Status")).toBeInTheDocument();

    // Open the select dropdown
    const select = screen.getByLabelText("Status");
    fireEvent.mouseDown(select);

    // Check that all completion status options are available in the dropdown menu
    expect(
      screen.getByRole("option", { name: "Completed" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Not Completed" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Failed" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Skipped" })).toBeInTheDocument();
  });
});
