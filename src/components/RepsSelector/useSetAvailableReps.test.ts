import { renderHook } from "@testing-library/react";
import useSetAvailableReps from "./useSetAvailableReps";

describe("useSetAvailableReps", () => {
  it("initializes with given repChoices", () => {
    const onClose = jest.fn();
    const { result } = renderHook(() =>
      useSetAvailableReps([1, 2, 3], onClose)
    );
    expect(result.current.choices).toEqual([1, 2, 3]);
    expect(result.current.open).toBe(false);
    expect(result.current.pendingRepInput).toBe("");
  });
});
