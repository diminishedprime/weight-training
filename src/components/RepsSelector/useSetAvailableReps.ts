import React, { useReducer, useEffect } from "react";
import isEqual from "lodash/isEqual";

export interface UseSetAvailableRepsApi {
  open: boolean;
  choices: number[];
  pendingRepInput: string;
  handleOpen: () => void;
  handleCancel: () => void;
  handlePendingRepInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddPendingRepAsChoice: () => void;
  handleRemoveRep: (val: number) => void;
  setChoices: (choices: number[]) => void;
  setPendingRepInput: (value: string) => void;
  handleSave: () => void;
}

type State = {
  open: boolean;
  choices: number[];
  pendingRepInput: string;
};

type Action =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "SET_CHOICES"; choices: number[] }
  | { type: "SET_PENDING_REP_INPUT"; value: string }
  | { type: "ADD_PENDING_REP_AS_CHOICE" }
  | { type: "REMOVE_REP"; value: number }
  | { type: "RESET_CHOICES"; choices: number[] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "OPEN":
      return { ...state, open: true };
    case "CLOSE":
      return { ...state, open: false };
    case "SET_CHOICES":
      return { ...state, choices: action.choices };
    case "SET_PENDING_REP_INPUT":
      return { ...state, pendingRepInput: action.value };
    case "ADD_PENDING_REP_AS_CHOICE": {
      const val = Number(state.pendingRepInput);
      if (isNaN(val) || val <= 0 || state.choices.includes(val))
        return { ...state, pendingRepInput: "" };
      return {
        ...state,
        choices: [...state.choices, val].sort((a, b) => a - b),
        pendingRepInput: "",
      };
    }
    case "REMOVE_REP":
      return {
        ...state,
        choices: state.choices.filter((r) => r !== action.value),
      };
    case "RESET_CHOICES":
      return { ...state, choices: action.choices };
    default:
      return state;
  }
}

function useSetAvailableReps(
  repChoices: number[],
  onClose: (choices: number[]) => void,
): UseSetAvailableRepsApi {
  const [state, dispatch] = useReducer(reducer, {
    open: false,
    choices: repChoices,
    pendingRepInput: "",
  });

  useEffect(() => {
    if (!isEqual(state.choices, repChoices)) {
      dispatch({ type: "RESET_CHOICES", choices: repChoices });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repChoices]);

  const handleOpen = () => dispatch({ type: "OPEN" });
  const handleCancel = () => dispatch({ type: "CLOSE" });
  const handlePendingRepInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => dispatch({ type: "SET_PENDING_REP_INPUT", value: e.target.value });
  const handleAddPendingRepAsChoice = () =>
    dispatch({ type: "ADD_PENDING_REP_AS_CHOICE" });
  const handleRemoveRep = (val: number) =>
    dispatch({ type: "REMOVE_REP", value: val });
  const setChoices = (choices: number[]) =>
    dispatch({ type: "SET_CHOICES", choices });
  const setPendingRepInput = (value: string) =>
    dispatch({ type: "SET_PENDING_REP_INPUT", value });
  const handleSave = () => {
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
}

export default useSetAvailableReps;
