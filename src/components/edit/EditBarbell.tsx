"use client";
import { RoundingMode, WeightUnit } from "@/common-types";
import DisplayBarbell from "@/components/display/DisplayBarbell";
import SelectActivePlates from "@/components/select/SelectActivePlates";
import TODO from "@/components/TODO";
import { minimalPlates } from "@/util";
import { Stack } from "@mui/material";
import { Stack as ImmutableStack } from "immutable";
import React, { useEffect } from "react";

export interface EditBarbellProps {
  targetWeightValue: number;
  actualWeightValue: number | undefined;
  setActualWeightValue: React.Dispatch<React.SetStateAction<number>>;
  roundingMode: RoundingMode;
  barWeightValue: number;
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
    barWeightValue,
    setActualWeightValue,
    actualWeightValue,
    availablePlates,
    roundingMode,
  } = props;

  // Calculate the actual weight: barWeightValue + sum of all plates (both sides)
  const weightPerSide = (targetWeight - barWeightValue) / 2;
  const { plates: plateList, rounded } = minimalPlates(
    weightPerSide,
    availablePlates,
    roundingMode,
  );

  useEffect(() => {
    if (actualWeightValue === undefined) {
      const sumPlates = plateList.reduce((acc, p) => acc + p, 0);
      setActualWeightValue(barWeightValue + 2 * sumPlates);
    }
  }, [actualWeightValue, barWeightValue, plateList, setActualWeightValue]);

  const plateCounts = React.useMemo(() => {
    const counts: { [key: number]: number } = {};
    for (const plate of plateList) {
      counts[plate] = (counts[plate] || 0) + 1;
    }
    return counts;
  }, [plateList]);

  const [actualWeightHistory, setActualWeightHistory] = React.useState(() =>
    ImmutableStack<number>(),
  );

  const handleAdd = React.useCallback(
    (increment: number) => {
      setActualWeightHistory((prev) =>
        prev.push(
          actualWeightValue === undefined ? barWeightValue : actualWeightValue,
        ),
      );
      setActualWeightValue((prevWeight) => prevWeight + increment * 2);
    },
    [setActualWeightValue, actualWeightValue, barWeightValue],
  );

  const handleClear = React.useCallback(() => {
    setActualWeightHistory((prev) =>
      prev.push(
        actualWeightValue === undefined ? barWeightValue : actualWeightValue,
      ),
    );
    setActualWeightValue(barWeightValue);
  }, [setActualWeightValue, barWeightValue, actualWeightValue]);

  // Undo handler
  const handleUndo = React.useCallback(() => {
    const previousWeight = actualWeightHistory.peek();
    setActualWeightValue(previousWeight!);
    setActualWeightHistory(actualWeightHistory.pop());
  }, [actualWeightHistory, setActualWeightHistory, setActualWeightValue]);

  const undoDisabled = React.useMemo(
    () => actualWeightHistory.size === 0,
    [actualWeightHistory],
  );

  const clearDisabled = React.useMemo(
    () => targetWeight <= barWeightValue,
    [targetWeight, barWeightValue],
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

  // TODO: This should probably be a form control with a label at some point.
  return (
    <Stack display="flex" direction="column" alignItems="center" spacing={1}>
      <TODO>
        The trash can should set the weight back to the target weight (or maybe
        the resetValue?) if a resetValue prop is provided.
      </TODO>
      <DisplayBarbell
        showWeight
        showDifference
        showPlateNumbers
        weightUnit={props.weightUnit}
        targetWeightValue={props.targetWeightValue}
        actualWeightValue={props.actualWeightValue}
        barWeightValue={props.barWeightValue}
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
