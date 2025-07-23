"use client";
import { RoundingMode, WeightUnit } from "@/common-types";
import DisplayBarbell from "@/components/display/DisplayBarbell";
import SelectActivePlates from "@/components/select/SelectActivePlates";
import { minimalPlates } from "@/util";
import { Stack } from "@mui/material";
import { Stack as ImmutableStack } from "immutable";
import React from "react";

export interface EditBarbellProps {
  targetWeightValue: number;
  roundingMode: RoundingMode;
  // TODO: rename to barbellWeightValue
  barWeight: number;
  onTargetWeightChange: (newTargetWeight: number) => void;
  weightUnit: WeightUnit;
  availablePlates: number[];
  editing?: boolean;
  // TODO: remove later.
  onClickWeight?: () => void;
}

// TODO - there should be an easy way to pass in the default values for settings
// so they can come from user preferences.

const useEditBarbellAPI = (props: EditBarbellProps) => {
  // Sync weightInput string when actual weight changes externally
  const {
    targetWeightValue: targetWeight,
    barWeight,
    onTargetWeightChange,
  } = props;

  // Internal stack for undo history
  const [targetWeightHistory, setTargetWeightHistory] = React.useState(() =>
    ImmutableStack<number>(),
  );

  // Calculate the actual weight: barWeight + sum of all plates (both sides)
  const weightPerSide = (targetWeight - barWeight) / 2;
  const { plates: plateList, rounded } = minimalPlates(
    weightPerSide,
    props.availablePlates,
    props.roundingMode,
  );

  const plateCounts = React.useMemo(() => {
    const counts: { [key: number]: number } = {};
    for (const plate of plateList) {
      counts[plate] = (counts[plate] || 0) + 1;
    }
    return counts;
  }, [plateList]);

  const handleAdd = React.useCallback(
    (increment: number) => {
      setTargetWeightHistory((prev) => prev.push(targetWeight));
      onTargetWeightChange(targetWeight + increment * 2);
    },
    [onTargetWeightChange, targetWeight],
  );

  const handleClear = React.useCallback(() => {
    setTargetWeightHistory((prev) => prev.push(targetWeight));
    onTargetWeightChange(barWeight);
  }, [onTargetWeightChange, barWeight, targetWeight]);

  // Undo handler
  const handleUndo = React.useCallback(() => {
    const previousWeight = targetWeightHistory.peek();
    onTargetWeightChange(previousWeight!);
    setTargetWeightHistory(targetWeightHistory.pop());
  }, [targetWeightHistory, setTargetWeightHistory, onTargetWeightChange]);

  const undoDisabled = React.useMemo(
    () => targetWeightHistory.size === 0,
    [targetWeightHistory],
  );

  const clearDisabled = React.useMemo(
    () => targetWeight <= barWeight,
    [targetWeight, barWeight],
  );

  return {
    plateCounts,
    handleAdd,
    handleClear,
    handleUndo,
    undoDisabled,
    rounded,
    clearDisabled,
  };
};

const EditBarbell: React.FC<EditBarbellProps> = (props) => {
  const api = useEditBarbellAPI(props);

  // TODO this has an issue where it moves when you make it editable, but it's
  // probably something that will be fixed if I can move away from all the
  // weirdness of the useRef stuff.

  // TODO: This should probably be a form control with a label at some point.

  return (
    <Stack display="flex" direction="column" alignItems="center" spacing={1}>
      <DisplayBarbell
        showWeight
        showDifference
        showPlateNumbers
        weightUnit={props.weightUnit}
        targetWeightValue={props.targetWeightValue}
        barWeight={props.barWeight}
        availablePlates={props.availablePlates}
        roundingMode={props.roundingMode}
      />
      {props.editing && (
        <Stack
          display="flex"
          direction="row"
          flexWrap="wrap"
          useFlexGap
          gap={1}
          alignItems="flex-end"
        >
          <SelectActivePlates
            availablePlates={props.availablePlates}
            activePlates={api.plateCounts}
            onAddPlate={api.handleAdd}
            onClear={api.handleClear}
            clearDisabled={api.clearDisabled}
            onUndo={api.handleUndo}
            undoDisabled={api.undoDisabled}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default EditBarbell;
