"use client";

import React from "react";
import { minimalPlates } from "@/util";
import { PLATE_COLORS } from "@/constants";

export interface UseBarbellEditorProps {
  totalWeight: number;
  barWeight: number; // Make this required
  onChange: (newTotal: number) => void;
  initialPlateSizes: number[];
}

export interface BadgeMetadata {
  count: number;
  sx: {
    "& .MuiBadge-badge": {
      backgroundColor: string;
      color: string;
    };
  };
}

/**
 * Custom hook to manage the state and logic for a barbell weight editor.
 *
 * @param props - The properties for the hook.
 * @param props.totalWeight - The current total weight on the barbell.
 * @param props.barWeight - The weight of the barbell itself. (Required)
 * @param props.onChange - Callback function invoked when the total weight changes. (Required)
 * @param props.initialPlateSizes - Array of available plate weights.
 *
 * This hook calculates the plates needed on each side of the barbell to reach the `totalWeight`,
 * considering the `barWeight`. It uses a list of available `plateSizes` (which can be customized
 * via a settings dialog) and the `minimalPlates` utility to determine the optimal combination of plates.
 *
 * It returns:
 * - `plateSizes`: An array of available plate weights.
 * - `badgeMetadata`: An object mapping plate sizes to their count and styling for UI display (per side).
 * - `settingsOpen`: A boolean indicating if the plate size settings dialog is open.
 * - `setSettingsOpen`: A function to toggle the settings dialog.
 * - `handleAdd`: A function to add or remove weight from the barbell (symmetrically).
 * - `handleSaveSettings`: A function to save new custom plate sizes.
 * - `handleClear`: A function to reset the `totalWeight` to just the `barWeight`.
 */
export const useBarbellEditor = (props: UseBarbellEditorProps) => {
  const { totalWeight, barWeight, onChange, initialPlateSizes } = props; // Remove default for barWeight

  const [plateSizes, setPlateSizes] = React.useState(initialPlateSizes);
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  const weightPerSide = (totalWeight - barWeight) / 2;
  const plateList = minimalPlates(weightPerSide, plateSizes);

  const plateCounts = React.useMemo(() => {
    const counts: { [key: number]: number } = {};
    for (const plate of plateList) {
      counts[plate] = (counts[plate] || 0) + 1;
    }
    return counts;
  }, [plateList]);

  const badgeMetadata = React.useMemo(() => {
    const metadata: { [key: number]: BadgeMetadata } = {};
    plateSizes.forEach((size) => {
      metadata[size] = {
        count: plateCounts[size] || 0,
        sx: {
          "& .MuiBadge-badge": {
            backgroundColor: PLATE_COLORS[size]?.bg || "gray",
            color: PLATE_COLORS[size]?.fg || "white",
          },
        },
      };
    });
    return metadata;
  }, [plateSizes, plateCounts]);

  const handleAdd = (increment: number) => {
    onChange(totalWeight + increment * 2); // Remove conditional check
  };

  const handleSaveSettings = (newPlateSizes: number[]) => {
    setPlateSizes(newPlateSizes);
    setSettingsOpen(false);
  };

  const handleClear = () => {
    onChange(barWeight); // Remove conditional check
  };

  return {
    plateSizes,
    badgeMetadata,
    settingsOpen,
    setSettingsOpen,
    handleAdd,
    handleSaveSettings,
    handleClear,
  };
};
