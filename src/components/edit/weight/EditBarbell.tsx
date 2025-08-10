"use client";
import DisplayBarbell from "@/components/display/DisplayBarbell";
import { EquipmentWeightEditorProps } from "@/components/edit/weight/EquipmentWeightEditor";
import SelectActivePlates from "@/components/select/SelectActivePlates";
import { actualWeightForTarget, minimalPlatesForTargetWeight } from "@/util";
import { Stack } from "@mui/material";
import React, { useCallback, useMemo } from "react";
import useEditableWeight from "./useEditableWeight";

export interface EditBarbellProps extends EquipmentWeightEditorProps {
  availablePlates: number[];
  barWeight: number;
}

const EditBarbell: React.FC<EditBarbellProps> = (props) => {
  const api = useEditBarbellAPI(props);

  return (
    <Stack alignItems="center" spacing={1} useFlexGap>
      <DisplayBarbell
        showWeight
        showDifference
        showPlateNumbers
        weightUnit={props.weightUnit}
        targetWeight={props.ignoreTarget ? api.actual : api.target}
        actualWeight={api.actual}
        barWeightValue={props.barWeight}
        availablePlates={props.availablePlates}
        roundingMode={props.roundingMode}
        platesForSide={api.platesForSide}
      />
      <SelectActivePlates
        editing={props.editing}
        availablePlates={props.availablePlates}
        activePlates={api.plateCounts}
        onAddPlate={api.onAddPlate}
        onRemovePlate={api.onRemovePlate}
        removePlateDisabled={api.removePlateDisabled}
        onClear={api.resetToResolvedTarget}
        clearDisabled={api.resetDisabled}
        onUndo={api.undo}
        undoDisabled={api.undoDisabled}
      />
    </Stack>
  );
};

export default EditBarbell;

const useEditBarbellAPI = (props: EditBarbellProps) => {
  const {
    barWeight,
    availablePlates,
    roundingMode,
    serverActual,
    serverTarget,
    onActualChange,
    onTargetChange,
  } = props;

  const targetToActual = useCallback(
    (target: number) =>
      actualWeightForTarget(target, barWeight, availablePlates, roundingMode)
        .actualWeight,
    [barWeight, availablePlates, roundingMode],
  );

  const {
    actual,
    setActual,
    target,
    undo,
    undoDisabled,
    resetToResolvedTarget,
    resetDisabled,
  } = useEditableWeight(
    serverTarget,
    serverActual,
    targetToActual,
    onActualChange,
    onTargetChange,
  );

  const platesForSide = useMemo(
    () =>
      minimalPlatesForTargetWeight(
        actual,
        barWeight,
        availablePlates,
        roundingMode,
      ).plates,
    [actual, barWeight, availablePlates, roundingMode],
  );

  const plateCounts = useMemo(() => {
    const counts: { [key: number]: number } = {};
    for (const plate of platesForSide) {
      counts[plate] = (counts[plate] || 0) + 1;
    }
    return counts;
  }, [platesForSide]);

  const onAddPlate = useCallback(
    (plate: number) => {
      setActual((p) => p + plate * 2);
    },
    [setActual],
  );

  const onRemovePlate = useCallback(
    (plate: number) => setActual((p) => p - plate * 2),
    [setActual],
  );

  const removePlateDisabled = useCallback(
    (plate: number) => plate * 2 > actual - barWeight,
    [actual, barWeight],
  );

  return {
    actual,
    target,
    plateCounts,
    onAddPlate,
    onRemovePlate,
    removePlateDisabled,
    undo,
    undoDisabled,
    resetToResolvedTarget,
    platesForSide,
    resetDisabled,
  };
};
