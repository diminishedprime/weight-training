"use client";

import React, { useReducer, useEffect } from "react";
import isEqual from "lodash/isEqual";

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
 * Represents the internal state of the `useSetAvailableReps` hook.
 */
type State = {
  /** Indicates whether the dialog or interface for modifying rep choices is open. */
  open: boolean;
  /** The current list of available rep choices. */
  choices: number[];
  /** The current value in the input field for adding a new rep choice. */
  pendingRepInput: string;
};

/**
 * Defines the actions that can be dispatched to update the hook's state.
 */
type Action =
  /** Opens the dialog or interface for modifying rep choices. */
  | { type: "OPEN" }
  /** Closes the dialog or interface. */
  | { type: "CLOSE" }
  /** Directly sets the available rep choices. */
  | { type: "SET_CHOICES"; choices: number[] }
  /** Updates the input field for a new rep value. */
  | { type: "SET_PENDING_REP_INPUT"; value: string }
  /** Adds the current pending rep input as a new choice. */
  | { type: "ADD_PENDING_REP_AS_CHOICE" }
  /** Removes a specific rep value from the choices. */
  | { type: "REMOVE_REP"; value: number }
  /** Resets the choices to the initial `repChoices` prop. */
  | { type: "RESET_CHOICES"; choices: number[] };

/**
 * Reducer function to manage the state of the `useSetAvailableReps` hook.
 *
 * @param state - The current state.
 * @param action - The action to perform.
 * @returns The new state.
 */
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "OPEN":
      // Opens the dialog or interface for modifying rep choices
      return { ...state, open: true };
    case "CLOSE":
      // Closes the dialog or interface
      return { ...state, open: false };
    case "SET_CHOICES":
      // Directly sets the available rep choices
      return { ...state, choices: action.choices };
    case "SET_PENDING_REP_INPUT":
      // Updates the input field for a new rep value
      return { ...state, pendingRepInput: action.value };
    case "ADD_PENDING_REP_AS_CHOICE": {
      // Adds the current pending rep input as a new choice
      const val = Number(state.pendingRepInput);
      // Validate: must be a number, positive, and not already a choice
      if (isNaN(val) || val <= 0 || state.choices.includes(val))
        return { ...state, pendingRepInput: "" }; // Clear input if invalid
      return {
        ...state,
        choices: [...state.choices, val].sort((a, b) => a - b), // Add and sort
        pendingRepInput: "", // Clear input after adding
      };
    }
    case "REMOVE_REP":
      // Removes a specific rep value from the choices
      return {
        ...state,
        choices: state.choices.filter((r) => r !== action.value),
      };
    case "RESET_CHOICES":
      // Resets the choices to the initial `repChoices` prop
      return { ...state, choices: action.choices };
    // Stryker disable all
    default: {
      // This will cause a type error if a new enum value is added and not handled
      const _exhaustiveCheck: never = action;
      return _exhaustiveCheck;
    }
    // Stryker restore all
  }
};

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
  props: UseSetAvailableRepsProps
): UseSetAvailableRepsApi => {
  const { repChoices, onClose } = props;
  const [state, dispatch] = useReducer(reducer, {
    open: false,
    choices: repChoices,
    pendingRepInput: "",
  });

  useEffect(() => {
    // If the initial repChoices prop changes externally, reset the internal state
    // This ensures that if the parent component updates the repChoices,
    // the hook reflects these changes.
    if (!isEqual(state.choices, repChoices)) {
      dispatch({ type: "RESET_CHOICES", choices: repChoices });
    }
    // The `state.choices` dependency is intentionally omitted here.
    // Including it would cause an infinite loop because `useEffect` would run,
    // potentially update `state.choices` via `dispatch`, which would then trigger `useEffect` again.
    // We only want this effect to run when the `repChoices` prop itself changes from the parent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repChoices]); // Only re-run if repChoices prop changes

  /** Opens the dialog or interface for modifying rep choices. */
  const handleOpen = () => dispatch({ type: "OPEN" });
  /** Closes the dialog or interface without saving changes. */
  const handleCancel = () => dispatch({ type: "CLOSE" });
  /** Handles changes to the input field for a new rep choice. */
  const handlePendingRepInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => dispatch({ type: "SET_PENDING_REP_INPUT", value: e.target.value });
  /** Adds the `pendingRepInput` value as a new choice to the `choices` array. */
  const handleAddPendingRepAsChoice = () =>
    dispatch({ type: "ADD_PENDING_REP_AS_CHOICE" });
  /** Removes a specific rep value from the `choices` array. */
  const handleRemoveRep = (val: number) =>
    dispatch({ type: "REMOVE_REP", value: val });
  /** Directly sets the `choices` array. */
  const setChoices = (choices: number[]) =>
    dispatch({ type: "SET_CHOICES", choices });
  /** Directly sets the `pendingRepInput` value. */
  const setPendingRepInput = (value: string) =>
    dispatch({ type: "SET_PENDING_REP_INPUT", value });
  /** Saves the current `choices` and closes the dialog or interface. */
  const handleSave = () => {
    // Call the onClose callback with the current choices and close the dialog
    onClose(state.choices);
    dispatch({ type: "CLOSE" });
  };

  return {
    open: state.open,
    choices: state.choices,
    pendingRepInput: state.pendingRepInput,
    handleOpen,
    handleCancel,
    handlePendingRepInputChange,
    handleAddPendingRepAsChoice,
    handleRemoveRep,
    setChoices,
    setPendingRepInput,
    handleSave,
  };
};
