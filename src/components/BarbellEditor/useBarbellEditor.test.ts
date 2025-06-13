import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useBarbellEditor } from "./useBarbellEditor";
import { DEFAULT_BAR_WEIGHT, DEFAULT_PLATE_SIZES } from "@/constants";

describe("useBarbellEditor", () => {
  it("should initialize with default values", () => {
    const mockOnChange = vi.fn();
    const { result } = renderHook(() =>
      useBarbellEditor({
        totalWeight: 45,
        onChange: mockOnChange,
        initialPlateSizes: DEFAULT_PLATE_SIZES,
        barWeight: DEFAULT_BAR_WEIGHT,
      }),
    );

    // Check initial state based on the hook's actual return values
    expect(result.current.plateSizes).toEqual(DEFAULT_PLATE_SIZES);
    expect(result.current.settingsOpen).toBe(false);

    // Check badgeMetadata for initial state (empty plates as totalWeight is barWeight)
    Object.keys(result.current.badgeMetadata).forEach((plateSizeKey) => {
      const plateSize = parseFloat(plateSizeKey);
      expect(result.current.badgeMetadata[plateSize].count).toBe(0);
    });
  });

  it("should calculate correct plateCounts and badgeMetadata when weight is added", () => {
    const mockOnChange = vi.fn();
    // Total weight of 135 lbs = 45lb bar + two 45lb plates (one on each side)
    const { result } = renderHook(() =>
      useBarbellEditor({
        totalWeight: 135,
        onChange: mockOnChange,
        initialPlateSizes: DEFAULT_PLATE_SIZES,

        barWeight: DEFAULT_BAR_WEIGHT,
      }),
    );

    expect(result.current.plateSizes).toEqual(DEFAULT_PLATE_SIZES);

    // Check badgeMetadata for 135 lbs total weight
    // Expect one 45lb plate on each side, so count for 45 in badgeMetadata (which is per side) should be 1
    Object.keys(result.current.badgeMetadata).forEach((plateSizeKey) => {
      const plateSize = parseFloat(plateSizeKey);
      if (plateSize === 45) {
        expect(result.current.badgeMetadata[plateSize].count).toBe(1);
      } else {
        expect(result.current.badgeMetadata[plateSize].count).toBe(0);
      }
    });
  });

  it("should call onChange with barWeight when handleClear is called", () => {
    const mockOnChange = vi.fn();
    const barWeight = 45; // Assuming default bar weight
    const { result } = renderHook(() =>
      useBarbellEditor({
        totalWeight: 135,
        barWeight,
        onChange: mockOnChange,
        initialPlateSizes: DEFAULT_PLATE_SIZES,
      }),
    );

    act(() => {
      result.current.handleClear();
    });

    expect(mockOnChange).toHaveBeenCalledWith(barWeight);
  });

  it("should call onChange with the new total weight when handleAdd is called", () => {
    const mockOnChange = vi.fn();
    const initialTotalWeight = 135;
    const increment = 10; // Adding 10lb plate (5lb on each side)
    const { result } = renderHook(() =>
      useBarbellEditor({
        totalWeight: initialTotalWeight,
        onChange: mockOnChange,
        initialPlateSizes: DEFAULT_PLATE_SIZES,
        barWeight: DEFAULT_BAR_WEIGHT,
      }),
    );

    act(() => {
      result.current.handleAdd(increment);
    });

    expect(mockOnChange).toHaveBeenCalledWith(
      initialTotalWeight + increment * 2,
    );
  });

  it("should update plateSizes and close settings when handleSaveSettings is called", () => {
    const mockOnChange = vi.fn();
    const { result } = renderHook(() =>
      useBarbellEditor({
        totalWeight: 45,
        onChange: mockOnChange,
        initialPlateSizes: DEFAULT_PLATE_SIZES,

        barWeight: DEFAULT_BAR_WEIGHT,
      }),
    );
    const newPlateSizes = [50, 25, 10, 5]; // Example new plate sizes

    // First, open settings
    act(() => {
      result.current.setSettingsOpen(true);
    });
    expect(result.current.settingsOpen).toBe(true);

    // Then, save new settings
    act(() => {
      result.current.handleSaveSettings(newPlateSizes);
    });

    expect(result.current.plateSizes).toEqual(newPlateSizes);
    expect(result.current.settingsOpen).toBe(false);
  });

  it("should recalculate plateCounts when available plateSizes change", () => {
    const mockOnChange = vi.fn();
    const initialPlates = [5, 2.5];
    const totalWeight = 55; // (55 - 45) / 2 = 5 per side. Initially: one 5lb plate.
    const barWeight = DEFAULT_BAR_WEIGHT; // 45 lbs

    const { result } = renderHook(() =>
      useBarbellEditor({
        totalWeight,
        barWeight,
        onChange: mockOnChange,
        initialPlateSizes: initialPlates,
      }),
    );

    // Initial check: one 5lb plate, zero 2.5lb plates
    expect(result.current.badgeMetadata[5].count).toBe(1);
    expect(result.current.badgeMetadata[2.5].count).toBe(0);

    // Change available plates to only 2.5lb plates
    const newPlateConfiguration = [2.5];
    act(() => {
      result.current.handleSaveSettings(newPlateConfiguration);
    });

    // Now, plateSizes should be [2.5]
    expect(result.current.plateSizes).toEqual(newPlateConfiguration);

    // With only 2.5lb plates, to make 5lbs per side, we need two 2.5lb plates.
    // The totalWeight (55lbs) hasn't changed, so the required weight per side (5lbs) is the same.
    expect(result.current.badgeMetadata[2.5].count).toBe(2);

    // The 5lb plate should no longer be considered available or used
    // Check if 5 is still a key in badgeMetadata; if so, its count should be 0.
    // More accurately, it shouldn't be in plateSizes, and thus its metadata might be gone
    // or reflect count 0 if metadata keys are preserved.
    // The minimalPlates function would not use it if it's not in the provided plateSizes array.
    expect(result.current.plateSizes).not.toContain(5);
    if (result.current.badgeMetadata[5]) {
      expect(result.current.badgeMetadata[5].count).toBe(0);
    }
  });

  it("should use default badge colors for plate sizes not in PLATE_COLORS", () => {
    const mockOnChange = vi.fn();
    const barWeight = 45;
    // Total weight 155 lbs = 45lb bar + 110lbs of plates
    // Weight per side = (155 - 45) / 2 = 110 / 2 = 55 lbs
    // We'll use a custom plate set that includes a 55lb plate
    const customPlateSizes = [55, 10];
    const { result } = renderHook(() =>
      useBarbellEditor({
        totalWeight: 155,
        barWeight,
        onChange: mockOnChange,
        initialPlateSizes: customPlateSizes,
      }),
    );

    // Expect one 55lb plate on each side
    expect(result.current.badgeMetadata[55].count).toBe(1);
    // Check default colors for the 55lb plate
    expect(
      result.current.badgeMetadata[55].sx["& .MuiBadge-badge"].backgroundColor,
    ).toBe("gray");
    expect(result.current.badgeMetadata[55].sx["& .MuiBadge-badge"].color).toBe(
      "white",
    );
  });
});
