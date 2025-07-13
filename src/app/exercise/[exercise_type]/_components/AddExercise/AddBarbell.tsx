"use client";

import React from "react";
import { useLocalStorageState, LocalStorageKeys as LSK } from "@/clientHooks";
import Stack from "@mui/material/Stack";
import BarbellEditor from "@/components/BarbellEditor";
import SelectReps from "@/components/select/SelectReps";
import { CompletionStatus, PercievedEffort, WeightUnit } from "@/common-types";
import SelectPercievedEffort from "@/components/select/SelectPercievedEffort";
import WarmupCheckbox from "@/components/WarmupCheckbox";
import SelectCompletionStatus from "@/components/select/SelectCompletionStatus";
import { Button, TextField } from "@mui/material";
import { TestIds } from "@/test-ids";
import { addBarbellLift } from "@/app/exercise/[exercise_type]/_components/AddExercise/actions";
import { AddBarbelProps } from ".";

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
      effort: null as PercievedEffort | null,
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
  const [percievedEffort, setPercievedEffort] =
    useLocalStorageState<PercievedEffort | null>(
      LSK.AddBarbellPercievedEffort,
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

  const onRepsChange = React.useCallback(
    (newReps: number) => {
      setReps(newReps);
    },
    [setReps]
  );

  const onEffortChange = React.useCallback(
    (percievedEffort: PercievedEffort | null) => {
      setPercievedEffort(percievedEffort);
    },
    [setPercievedEffort]
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
    setPercievedEffort(initial.effort);
    setWarmup(initial.warmup);
    setCompletionStatus(initial.completionStatus);
    setNotes(initial.notes);
  }, [
    setTotalWeight,
    setWeightUnit,
    setReps,
    setPercievedEffort,
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
    reps,
    onRepsChange,
    effort: percievedEffort,
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
          availablePlates={props.availablePlates}
        />
        <Stack alignSelf="center">
          <SelectReps
            reps={api.reps}
            onRepsChange={api.onRepsChange}
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
          <SelectPercievedEffort
            percievedEffort={api.effort}
            onPercievedEffortChange={api.onEffortChange}
          />
          <SelectCompletionStatus
            completionStatus={api.completionStatus}
            onCompletionStatusChange={api.onCompletionStatusChange}
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
