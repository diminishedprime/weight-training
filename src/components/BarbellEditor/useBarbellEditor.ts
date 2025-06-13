"use client";

import React from "react";
import { minimalPlates } from "@/util";
import { PLATE_COLORS } from "@/constants";

export interface UseBarbellEditorProps {
  /** The current total weight on the barbell. */
  totalWeight: number;
  /** The weight of the barbell itself. */
  barWeight: number;
  /** Callback function invoked when the total weight changes. */
  onChange: (newTotal: number) => void;
  /** Array of available plate weights. */
  initialPlateSizes: number[];
}

export interface BadgeMetadata {
  /** The number of plates of a specific size on one side of the barbell. */
  count: number;
  /** MUI sx prop for styling the badge. */
  sx: {
    "& .MuiBadge-badge": {
      backgroundColor: string;
      color: string;
    };
  };
}

export interface UseBarbellEditorAPI {
  /** An array of available plate weights. Can be updated via settings. */
  plateSizes: number[];
  /** An object mapping plate sizes to their count and styling for UI display (per side). */
  badgeMetadata: { [key: number]: BadgeMetadata };
  /** A boolean indicating if the plate size settings dialog is open. */
  settingsOpen: boolean;
  /** A function to toggle the settings dialog. */
  setSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** A function to add or remove weight from the barbell (symmetrically). Takes the increment per side. */
  handleAdd: (increment: number) => void;
  /** A function to save new custom plate sizes from the settings dialog. */
  handleSaveSettings: (newPlateSizes: number[]) => void;
  /** A function to reset the `totalWeight` to just the `barWeight`. */
  handleClear: () => void;
}

/**
 * Custom hook to manage the state and logic for a barbell weight editor.
 *
 * This hook calculates the plates needed on each side of the barbell to reach the `totalWeight`,
 * considering the `barWeight`. It uses a list of available `plateSizes` (which can be customized
 * via a settings dialog) and the `minimalPlates` utility to determine the optimal combination of plates.
 *
 * @param props - The properties for the hook.
 * @returns An API object with state and functions to interact with the barbell editor. See {@link UseBarbellEditorAPI}.
 */
export const useBarbellEditor = (props: UseBarbellEditorProps): UseBarbellEditorAPI => {
  const { totalWeight, barWeight, onChange, initialPlateSizes } = props;

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
    onChange(totalWeight + increment * 2);
  };

  const handleSaveSettings = (newPlateSizes: number[]) => {
    setPlateSizes(newPlateSizes);
    setSettingsOpen(false);
  };

  const handleClear = () => {
    onChange(barWeight);
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
