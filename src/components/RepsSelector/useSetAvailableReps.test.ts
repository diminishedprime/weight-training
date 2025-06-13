import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useSetAvailableReps } from "./useSetAvailableReps";

describe("useSetAvailableReps", () => {
  it("should initialize with default values", () => {
    const { result } = renderHook(() =>
      useSetAvailableReps({
        repChoices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        onClose: () => {},
      }),
    );

    expect(result.current.choices).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(result.current.pendingRepInput).toBe("");
  });

  it("should handle open and cancel", () => {
    const { result } = renderHook(() =>
      useSetAvailableReps({
        repChoices: [1, 2, 3],
        onClose: () => {},
      }),
    );

    expect(result.current.open).toBe(false);

    act(() => {
      result.current.handleOpen();
    });

    expect(result.current.open).toBe(true);

    act(() => {
      result.current.handleCancel();
    });

    expect(result.current.open).toBe(false);
  });

  it("should handle pending rep input change", () => {
    const { result } = renderHook(() =>
      useSetAvailableReps({
        repChoices: [1, 2, 3],
        onClose: () => {},
      }),
    );

    act(() => {
      result.current.handlePendingRepInputChange({
        target: { value: "5" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.pendingRepInput).toBe("5");
  });

  it("should add a new rep choice", () => {
    const { result } = renderHook(() =>
      useSetAvailableReps({
        repChoices: [1, 2, 3],
        onClose: () => {},
      }),
    );

    act(() => {
      result.current.handlePendingRepInputChange({
        target: { value: "5" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleAddPendingRepAsChoice();
    });

    expect(result.current.choices).toEqual([1, 2, 3, 5]);
    expect(result.current.pendingRepInput).toBe("");
  });

  it("should add a new rep choice and sort it into the correct position", () => {
    // Render the hook with initial choices that are not consecutive to test sorting.
    const { result } = renderHook(() =>
      useSetAvailableReps({
        repChoices: [1, 5, 10],
        onClose: () => {},
      }),
    );

    // Act: Set a new pending rep input that should go in the middle.
    act(() => {
      result.current.handlePendingRepInputChange({
        target: { value: "3" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleAddPendingRepAsChoice();
    });

    expect(result.current.choices).toEqual([1, 3, 5, 10]);
    expect(result.current.pendingRepInput).toBe("");
  });

  it("should remove a rep choice and save changes", () => {
    const mockOnClose = vi.fn();
    const { result } = renderHook(() =>
      useSetAvailableReps({
        repChoices: [1, 3, 5, 7],
        onClose: mockOnClose,
      }),
    );

    act(() => {
      result.current.handleOpen();
    });

    act(() => {
      result.current.handleRemoveRep(3);
    });

    expect(result.current.choices).toEqual([1, 5, 7]);

    act(() => {
      result.current.handlePendingRepInputChange({
        target: { value: "9" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleAddPendingRepAsChoice();
    });

    expect(result.current.choices).toEqual([1, 5, 7, 9]);

    act(() => {
      result.current.handleSave();
    });

    expect(mockOnClose).toHaveBeenCalledWith([1, 5, 7, 9]);
    expect(result.current.open).toBe(false);
  });

  it("should not add an invalid rep choice (NaN)", () => {
    const { result } = renderHook(() =>
      useSetAvailableReps({
        repChoices: [1, 2, 3],
        onClose: () => {},
      }),
    );

    // Act: Set an invalid pending rep input (NaN).
    act(() => {
      result.current.handlePendingRepInputChange({
        target: { value: "abc" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleAddPendingRepAsChoice();
    });

    expect(result.current.choices).toEqual([1, 2, 3]);
    expect(result.current.pendingRepInput).toBe("");
  });

  it("should not add an invalid rep choice (non-positive)", () => {
    const { result } = renderHook(() =>
      useSetAvailableReps({
        repChoices: [1, 2, 3],
        onClose: () => {},
      }),
    );

    // Act: Set an invalid pending rep input (non-positive).
    act(() => {
      result.current.handlePendingRepInputChange({
        target: { value: "0" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleAddPendingRepAsChoice();
    });

    expect(result.current.choices).toEqual([1, 2, 3]);
    expect(result.current.pendingRepInput).toBe("");
  });

  it("should not add a duplicate rep choice", () => {
    const { result } = renderHook(() =>
      useSetAvailableReps({
        repChoices: [1, 2, 3],
        onClose: () => {},
      }),
    );

    // Act: Set a duplicate pending rep input.
    act(() => {
      result.current.handlePendingRepInputChange({
        target: { value: "3" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleAddPendingRepAsChoice();
    });

    expect(result.current.choices).toEqual([1, 2, 3]);
    expect(result.current.pendingRepInput).toBe("");
  });

  it("should directly set choices with setChoices", () => {
    const { result } = renderHook(() =>
      useSetAvailableReps({ repChoices: [1, 2], onClose: () => {} }),
    );

    act(() => {
      result.current.setChoices([3, 4, 5]);
    });

    expect(result.current.choices).toEqual([3, 4, 5]);
  });

  it("should directly set pendingRepInput with setPendingRepInput", () => {
    const { result } = renderHook(() =>
      useSetAvailableReps({ repChoices: [], onClose: () => {} }),
    );

    act(() => {
      result.current.setPendingRepInput("123");
    });

    expect(result.current.pendingRepInput).toBe("123");
  });
});
