"use client";

import React from "react";
import { useLocalStorageState, LocalStorageKeys as LSK } from "@/clientHooks";
import Stack from "@mui/material/Stack";
// import Typography from "@mui/material/Typography";
import BarbellEditor from "@/components/BarbellEditor";
import RepsSelector from "@/components/select/RepsSelector";
import { CompletionStatus, RelativeEffort, WeightUnit } from "@/common-types";
import { EffortEditor } from "@/components/select/EffortEditor";
import WarmupCheckbox from "@/components/WarmupCheckbox";
import CompletionStatusSelector from "@/components/select/CompletionStatusSelector";
import { AddBarbelProps } from ".";
import { Button, TextField } from "@mui/material";
import { TestIds } from "@/test-ids";
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
  // Initial values for reset
  const initial = React.useMemo(
    () => ({
      totalWeight: 45,
      weightUnit: "pounds" as WeightUnit,
      reps: 5,
      effort: null as RelativeEffort | null,
      warmup: false,
      completionStatus: "completed" as CompletionStatus,
      notes: "",
    }),
    []
  );
  const [totalWeight, setTotalWeight] = useLocalStorageState<number>(
    LSK.AddBarbellTotalWeight,
    45
  );
  // barWeight is always 45, not user-editable, so no need to persist
  const [barWeight] = React.useState(45);
  const [weightUnit, setWeightUnit] = useLocalStorageState<WeightUnit>(
    LSK.AddBarbellWeightUnit,
    "pounds"
  );
  const [reps, setReps] = useLocalStorageState<number>(LSK.AddBarbellReps, 5);
  const [effort, setEffort] = useLocalStorageState<RelativeEffort | null>(
    LSK.AddBarbellEffort,
    null
  );
  const [warmup, setWarmup] = useLocalStorageState<boolean>(
    LSK.AddBarbellWarmup,
    false
  );
  const [completionStatus, setCompletionStatus] =
    useLocalStorageState<CompletionStatus>(
      LSK.AddBarbellCompletionStatus,
      "completed"
    );
  const [notes, setNotes] = useLocalStorageState<string>(
    LSK.AddBarbellNotes,
    ""
  );

  const onChange = React.useCallback(
    (newTotal: number) => {
      setTotalWeight(newTotal);
    },
    [setTotalWeight]
  );

  const onUnitChange = React.useCallback(
    (unit: WeightUnit) => {
      setWeightUnit(unit);
    },
    [setWeightUnit]
  );

  const onRepsChange = React.useCallback(
    (newReps: number) => {
      setReps(newReps);
    },
    [setReps]
  );

  const onEffortChange = React.useCallback(
    (newEffort: RelativeEffort) => {
      setEffort(newEffort);
    },
    [setEffort]
  );

  const onWarmupChange = React.useCallback(
    (checked: boolean) => {
      setWarmup(checked);
    },
    [setWarmup]
  );

  const onCompletionStatusChange = React.useCallback(
    (status: CompletionStatus) => {
      setCompletionStatus(status);
    },
    [setCompletionStatus]
  );

  const onNotesChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNotes(e.target.value);
    },
    [setNotes]
  );

  // Reset all fields to initial values
  const reset = React.useCallback(() => {
    setTotalWeight(initial.totalWeight);
    setWeightUnit(initial.weightUnit);
    setReps(initial.reps);
    setEffort(initial.effort);
    setWarmup(initial.warmup);
    setCompletionStatus(initial.completionStatus);
    setNotes(initial.notes);
  }, [
    setTotalWeight,
    setWeightUnit,
    setReps,
    setEffort,
    setWarmup,
    setCompletionStatus,
    setNotes,
    initial,
  ]);

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
    notes,
    onNotesChange,
    reset,
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
        api.notes ? api.notes : null
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
          <RepsSelector
            reps={api.reps}
            onChange={api.onRepsChange}
            repChoices={[1, 3, 5, 8]}
          />
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
        <TextField
          multiline
          minRows={1}
          label="Notes"
          value={api.notes}
          onChange={api.onNotesChange}
        />
        <Stack direction="row" flexGrow={1} justifyContent="space-between">
          <Stack direction="row" spacing={1}>
            {props.cancelComponent}
            <Button
              variant="outlined"
              color="warning"
              onClick={api.reset}
              data-testid={TestIds.AddBarbellResetButton}>
              Reset
            </Button>
          </Stack>
          <Button
            variant="contained"
            type="submit"
            data-testid={TestIds.AddBarbellLiftButton}>
            Add Lift
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default AddBarbell;
