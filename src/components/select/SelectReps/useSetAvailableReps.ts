"use client";

import React, { useState } from "react"; // Updated import

/**
 * Defines the public API of the `useSetAvailableReps` hook.
 */
export interface UseSetAvailableRepsApi {
  /** Indicates whether the dialog or interface for modifying rep choices is open. */
  open: boolean;
  /** The current list of available rep choices. */
  choices: number[];
  /** The current value in the input field for adding a new rep choice. */
  pendingRepInput: string;
  /** Opens the dialog or interface for modifying rep choices. */
  handleOpen: () => void;
  /** Closes the dialog or interface without saving changes. */
  handleCancel: () => void;
  /** Handles changes to the input field for a new rep choice. */
  handlePendingRepInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Adds the `pendingRepInput` value as a new choice to the `choices` array. */
  handleAddPendingRepAsChoice: () => void;
  /** Removes a specific rep value from the `choices` array. */
  handleRemoveRep: (val: number) => void;
  /** Directly sets the `choices` array. */
  setChoices: (choices: number[]) => void;
  /** Directly sets the `pendingRepInput` value. */
  setPendingRepInput: (value: string) => void;
  /** Saves the current `choices` and closes the dialog or interface. */
  handleSave: () => void;
}

/**
 * Props for the `useSetAvailableReps` hook.
 */
export interface UseSetAvailableRepsProps {
  /** The initial list of available rep choices. */
  repChoices: number[];
  /** Callback function invoked when the dialog is closed and changes are saved. */
  onClose: (choices: number[]) => void;
}

/**
 * Custom hook to manage the state and logic for setting available rep choices.
 *
 * This hook provides functionality to open/close a settings interface,
 * manage a list of rep choices, add new choices, remove existing ones,
 * and save the changes.
 *
 * @param props - The properties for the hook. See {@link UseSetAvailableRepsProps}.
 * @returns An API object with state and functions to interact with the rep choices settings. See {@link UseSetAvailableRepsApi}.
 */
export const useSetAvailableReps = (
  props: UseSetAvailableRepsProps,
): UseSetAvailableRepsApi => {
  const { repChoices: initialRepChoices, onClose } = props; // Renamed for clarity

  const [open, setOpen] = useState(false);
  const [choices, _setChoices] = useState<number[]>(initialRepChoices);
  const [pendingRepInput, _setPendingRepInput] = useState("");

  /** Opens the dialog or interface for modifying rep choices. */
  const handleOpen = () => setOpen(true);
  /** Closes the dialog or interface without saving changes. */
  const handleCancel = () => setOpen(false);

  /** Handles changes to the input field for a new rep choice. */
  const handlePendingRepInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => _setPendingRepInput(e.target.value);

  /** Adds the `pendingRepInput` value as a new choice to the `choices` array. */
  const handleAddPendingRepAsChoice = () => {
    const val = Number(pendingRepInput);
    // Validate: must be a number, positive, and not already a choice
    if (isNaN(val) || val <= 0 || choices.includes(val)) {
      _setPendingRepInput(""); // Clear input if invalid
      return;
    }
    _setChoices((prevChoices) => [...prevChoices, val].sort((a, b) => a - b)); // Add and sort
    _setPendingRepInput(""); // Clear input after adding
  };

  /** Removes a specific rep value from the `choices` array. */
  const handleRemoveRep = (val: number) => {
    _setChoices((prevChoices) => prevChoices.filter((r) => r !== val));
  };

  /** Directly sets the `choices` array. */
  // Note: _setChoices is used internally, setChoices is the exposed API function
  const setChoices = (newChoices: number[]) => {
    _setChoices(newChoices);
  };

  /** Directly sets the `pendingRepInput` value. */
  // Note: _setPendingRepInput is used internally, setPendingRepInput is the exposed API function
  const setPendingRepInput = (value: string) => {
    _setPendingRepInput(value);
  };

  /** Saves the current `choices` and closes the dialog or interface. */
  const handleSave = () => {
    // Call the onClose callback with the current choices and close the dialog
    onClose(choices);
    setOpen(false);
  };

  return {
    open,
    choices,
    pendingRepInput,
    handleOpen,
    handleCancel,
    handlePendingRepInputChange,
    handleAddPendingRepAsChoice,
    handleRemoveRep,
    setChoices, // Exposing the direct setter
    setPendingRepInput, // Exposing the direct setter
    handleSave,
  };
};
