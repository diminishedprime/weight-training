import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import useSetAvailableReps from "./useSetAvailableReps";

describe("useSetAvailableReps", () => {
  it("initializes with given repChoices", () => {
    const onClose = vi.fn();
    const { result } = renderHook(() =>
      useSetAvailableReps([1, 2, 3], onClose),
    );
    expect(result.current.choices).toEqual([1, 2, 3]);
    expect(result.current.open).toBe(false);
    expect(result.current.pendingRepInput).toBe("");
  });

  it("sets open to true when handleOpen is called", () => {
    const onClose = vi.fn();
    const { result } = renderHook(() =>
      useSetAvailableReps([1, 2, 3], onClose),
    );

    expect(result.current.open).toBe(false); // Initial state

    act(() => {
      result.current.handleOpen();
    });

    expect(result.current.open).toBe(true);
  });
});
