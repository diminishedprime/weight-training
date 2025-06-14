import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import DateTimePicker from "./DateTimePicker";

describe("DateTimePicker", () => {
  it("renders with required props", () => {
    const mockSetDate = vi.fn();
    const mockSetTime = vi.fn();
    const testDate = new Date("2025-06-13T10:30:00.000Z");
    const testTime = new Date("2025-06-13T10:30:00.000Z");

    const { container } = render(
      <DateTimePicker
        date={testDate}
        setDate={mockSetDate}
        time={testTime}
        setTime={mockSetTime}
      />,
    );

    // Should render the main container
    expect(container.firstChild).toBeTruthy();

    // Should render date and time picker components
    const datePickerInputs = container.querySelectorAll(
      'input[value="06/13/2025"]',
    );
    expect(datePickerInputs.length).toBeGreaterThan(0);

    // Should render the Stack container with flex direction row
    const stackContainer = container.firstChild as HTMLElement;
    expect(stackContainer).toHaveClass("MuiStack-root");
  });
});
