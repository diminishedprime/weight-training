"use client";

import React from "react";
import Stack from "@mui/material/Stack";
// import Typography from "@mui/material/Typography";
import BarbellEditor from "@/components/BarbellEditor";
import RepsSelector from "@/components/RepsSelector";
import { CompletionStatus, RelativeEffort, WeightUnit } from "@/common-types";
import { EffortEditor } from "@/components/EffortEditor";
import WarmupCheckbox from "@/components/WarmupCheckbox";
import CompletionStatusSelector from "@/components/CompletionStatusSelector";
import { AddBarbelProps } from ".";
import { Button } from "@mui/material";
import { addBarbellLift } from "@/app/exercise/[exercise_type]/_components/AddExercise/actions";

/**
 * Hook for managing AddBarbell form state and logic.
 * Encapsulates all local state and event handlers for the AddBarbell form, including:
 * - Barbell weight and unit
 * - Reps and effort
 * - Warmup and completion status
 *
 * Returns an API object for use in the AddBarbell component.
 */
const useAddBarbellAPI = () => {
  const [totalWeight, setTotalWeight] = React.useState(45);
  const [barWeight] = React.useState(45);
  const [weightUnit, setWeightUnit] = React.useState<WeightUnit>("pounds");
  const [reps, setReps] = React.useState<number>(5);
  const [effort, setEffort] = React.useState<RelativeEffort | null>(null);
  const [warmup, setWarmup] = React.useState(false);
  const [completionStatus, setCompletionStatus] =
    React.useState<CompletionStatus>("completed");

  const onChange = React.useCallback((newTotal: number) => {
    setTotalWeight(newTotal);
  }, []);

  const onUnitChange = React.useCallback((unit: WeightUnit) => {
    setWeightUnit(unit);
  }, []);

  const onRepsChange = React.useCallback((newReps: number) => {
    setReps(newReps);
  }, []);

  const onEffortChange = React.useCallback((newEffort: RelativeEffort) => {
    setEffort(newEffort);
  }, []);

  const onWarmupChange = React.useCallback((checked: boolean) => {
    setWarmup(checked);
  }, []);

  const onCompletionStatusChange = React.useCallback(
    (status: CompletionStatus) => {
      setCompletionStatus(status);
    },
    []
  );

  return {
    totalWeight,
    barWeight,
    onChange,
    weightUnit,
    onUnitChange,
    reps,
    onRepsChange,
    effort,
    onEffortChange,
    warmup,
    onWarmupChange,
    completionStatus,
    onCompletionStatusChange,
  };
};

/**
 * AddBarbell form for creating a new barbell exercise entry.
 *
 * Renders:
 * - BarbellEditor for weight and unit
 * - RepsSelector for reps
 * - EffortEditor, WarmupCheckbox, and CompletionStatusSelector for metadata
 * - Cancel and submit buttons
 *
 * All state and handlers are managed by useAddBarbellAPI.
 */
const AddBarbell: React.FC<AddBarbelProps> = (props) => {
  const api = useAddBarbellAPI();

  return (
    <form
      action={addBarbellLift.bind(
        null,
        props.userId,
        props.pathToRevalidate,
        props.exerciseType,
        api.totalWeight.toString(),
        api.weightUnit,
        api.reps,
        api.completionStatus,
        api.effort,
        api.warmup,
        null
      )}>
      <Stack spacing={1} direction={"column"}>
        <BarbellEditor
          totalWeight={api.totalWeight}
          barWeight={api.barWeight}
          onChange={api.onChange}
          weightUnit={api.weightUnit}
          onUnitChange={api.onUnitChange}
        />
        <Stack alignSelf="center">
          <RepsSelector reps={api.reps} onChange={api.onRepsChange} />
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          alignSelf="center">
          <WarmupCheckbox checked={api.warmup} onChange={api.onWarmupChange} />
          <EffortEditor value={api.effort} onChange={api.onEffortChange} />
          <CompletionStatusSelector
            value={api.completionStatus}
            onChange={api.onCompletionStatusChange}
          />
        </Stack>
        <Stack direction="row" flexGrow={1} justifyContent="space-between">
          {props.cancelComponent}
          <Button variant="contained" type="submit">
            Add Lift
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default AddBarbell;
