"use client";
import { RDispatch, RoundingMode, WeightUnit } from "@/common-types";
import DisplayBarbell from "@/components/display/DisplayBarbell";
import SelectActivePlates from "@/components/select/SelectActivePlates";
import { useResolvableWeight } from "@/hooks";
import { actualWeightForTarget, minimalPlatesForTargetWeight } from "@/util";
import { Stack } from "@mui/material";
import { Stack as ImmutableStack } from "immutable";
import React, { useCallback, useMemo } from "react";

export interface EditBarbellProps {
  targetWeightValue: number;
  actualWeightValue: number | undefined;
  setActualWeightValue: RDispatch<number | undefined>;
  roundingMode: RoundingMode;
  barWeightValue: number;
  weightUnit: WeightUnit;
  availablePlates: number[];
  editing?: boolean;
}

const EditBarbell: React.FC<EditBarbellProps> = (props) => {
  const api = useEditBarbellAPI(props);

  // TODO: This should probably be a form control with a label at some point.
  return (
    <Stack display="flex" direction="column" alignItems="center" spacing={1}>
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
            clearDisabled={false}
            onUndo={api.handleUndo}
            undoDisabled={api.undoDisabled}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default EditBarbell;

const useEditBarbellAPI = (props: EditBarbellProps) => {
  const {
    targetWeightValue: targetWeight,
    barWeightValue,
    setActualWeightValue,
    actualWeightValue,
    availablePlates,
    roundingMode,
  } = props;

  const targetToActual = useCallback(
    (target: number) =>
      actualWeightForTarget(
        target,
        barWeightValue,
        availablePlates,
        roundingMode,
      ).actualWeight,
    [barWeightValue, availablePlates, roundingMode],
  );

  const [weight, setWeight] = useResolvableWeight(
    actualWeightValue,
    setActualWeightValue,
    targetWeight,
    targetToActual,
  );

  const plateCounts = useMemo(() => {
    const plates = minimalPlatesForTargetWeight(
      weight,
      barWeightValue,
      availablePlates,
      roundingMode,
    ).plates;
    const counts: { [key: number]: number } = {};
    for (const plate of plates) {
      counts[plate] = (counts[plate] || 0) + 1;
    }
    return counts;
  }, [weight, barWeightValue, availablePlates, roundingMode]);

  const [weightHistory, setWeightHistory] = React.useState(() =>
    ImmutableStack<number>(),
  );

  const handleAdd = React.useCallback(
    (plate: number) => {
      setWeightHistory((prev) => prev.push(weight));
      setWeight((p) => p + plate * 2);
    },
    [weight, setWeight],
  );

  const handleClear = React.useCallback(() => {
    setWeight((_) => targetToActual(targetWeight));
    setWeightHistory((prev) => prev.push(weight));
  }, [weight, setWeight, targetToActual, targetWeight]);

  const handleUndo = React.useCallback(() => {
    const previousWeight = weightHistory.peek();
    setWeight((_) => previousWeight!);
    setWeightHistory((o) => o.pop());
  }, [weightHistory, setWeightHistory, setWeight]);

  const undoDisabled = React.useMemo(
    () => weightHistory.size === 0,
    [weightHistory],
  );

  return {
    plateCounts,
    handleAdd,
    handleClear,
    handleUndo,
    undoDisabled,
  };
};
