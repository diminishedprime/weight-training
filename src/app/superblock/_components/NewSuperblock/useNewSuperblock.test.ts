import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";

import { useNewSuperblock } from "./useNewSuperblock";
import * as actions from "./actions";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the addNewSuperblock action
vi.mock("./actions", () => ({
  addNewSuperblock: vi.fn(),
}));

describe("useNewSuperblock", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useNewSuperblock());

    expect(result.current.name).toBe("");
    expect(result.current.notes).toBe("");
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(typeof result.current.handleSubmit).toBe("function");
    expect(typeof result.current.setName).toBe("function");
    expect(typeof result.current.setNotes).toBe("function");
  });

  it("should update name when setName is called", () => {
    const { result } = renderHook(() => useNewSuperblock());

    act(() => {
      result.current.setName("Test Superblock");
    });

    expect(result.current.name).toBe("Test Superblock");
  });

  it("should update notes when setNotes is called", () => {
    const { result } = renderHook(() => useNewSuperblock());

    act(() => {
      result.current.setNotes("Test notes");
    });

    expect(result.current.notes).toBe("Test notes");
  });

  it("should handle successful submission", async () => {
    const mockAddNewSuperblock = vi.mocked(actions.addNewSuperblock);
    mockAddNewSuperblock.mockResolvedValueOnce({
      data: { id: "superblock-123" },
      error: null,
      status: 200,
      statusText: "OK",
      count: null,
    } as ReturnType<typeof actions.addNewSuperblock> extends Promise<infer T>
      ? T
      : never);

    const { result } = renderHook(() => useNewSuperblock());

    // Set initial values
    act(() => {
      result.current.setName("New Block");
      result.current.setNotes("Some notes");
    });

    // Submit the form
    await act(async () => {
      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>;
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockAddNewSuperblock).toHaveBeenCalledWith({
      name: "New Block",
      notes: "Some notes",
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.name).toBe(""); // Should clear form
    expect(result.current.notes).toBe(""); // Should clear form
    expect(mockPush).toHaveBeenCalledWith("/superblock/superblock-123");
  });

  it("should handle submission error", async () => {
    const mockAddNewSuperblock = vi.mocked(actions.addNewSuperblock);
    const errorMessage = "Failed to create superblock";
    mockAddNewSuperblock.mockResolvedValueOnce({
      data: null,
      error: {
        message: errorMessage,
        details: "Error details",
        hint: "Error hint",
        code: "ERROR_CODE",
        name: "Error",
      },
      status: 400,
      statusText: "Bad Request",
      count: null,
    } as ReturnType<typeof actions.addNewSuperblock> extends Promise<infer T>
      ? T
      : never);

    const { result } = renderHook(() => useNewSuperblock());

    act(() => {
      result.current.setName("Error Block");
    });

    await act(async () => {
      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>;
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockAddNewSuperblock).toHaveBeenCalledWith({
      name: "Error Block",
      notes: "",
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    // Form should still be cleared even on error (current behavior)
    expect(result.current.name).toBe("");
    expect(result.current.notes).toBe("");
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("should set loading state during submission", async () => {
    const mockAddNewSuperblock = vi.mocked(actions.addNewSuperblock);
    let resolvePromise: (value: unknown) => void;
    const submitPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockAddNewSuperblock.mockReturnValueOnce(
      submitPromise as ReturnType<typeof actions.addNewSuperblock>
    );

    const { result } = renderHook(() => useNewSuperblock());

    // Start submission
    act(() => {
      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>;
      result.current.handleSubmit(mockEvent);
    });

    expect(result.current.loading).toBe(true);

    // Resolve the promise
    await act(async () => {
      resolvePromise({
        data: { id: "123" },
        error: null,
        status: 200,
        statusText: "OK",
        count: null,
      });
      await submitPromise;
    });

    expect(result.current.loading).toBe(false);
  });

  it("should clear error when starting new submission", async () => {
    const mockAddNewSuperblock = vi.mocked(actions.addNewSuperblock);

    // First, cause an error
    mockAddNewSuperblock.mockResolvedValueOnce({
      data: null,
      error: {
        message: "First error",
        details: "Error details",
        hint: "Error hint",
        code: "ERROR_CODE",
        name: "Error",
      },
      status: 400,
      statusText: "Bad Request",
      count: null,
    } as ReturnType<typeof actions.addNewSuperblock> extends Promise<infer T>
      ? T
      : never);

    const { result } = renderHook(() => useNewSuperblock());

    await act(async () => {
      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>;
      await result.current.handleSubmit(mockEvent);
    });

    expect(result.current.error).toBe("First error");

    // Now submit again successfully
    mockAddNewSuperblock.mockResolvedValueOnce({
      data: { id: "123" },
      error: null,
      status: 200,
      statusText: "OK",
      count: null,
    } as ReturnType<typeof actions.addNewSuperblock> extends Promise<infer T>
      ? T
      : never);

    await act(async () => {
      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>;
      await result.current.handleSubmit(mockEvent);
    });

    expect(result.current.error).toBeNull();
  });
});
