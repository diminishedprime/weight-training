"use client";

import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import BarbellEditor from "@/components/BarbellEditor";
import SelectReps from "@/components/select/SelectReps";
import {
  CompletionStatus,
  PercievedEffort,
  RoundingMode,
  WeightUnit,
} from "@/common-types";
import SelectPercievedEffort from "@/components/select/SelectPercievedEffort";
import WarmupCheckbox from "@/components/WarmupCheckbox";
import SelectCompletionStatus from "@/components/select/SelectCompletionStatus";
import { Button, TextField } from "@mui/material";
import { TestIds } from "@/test-ids";
import {
  addBarbellLift,
  saveBarbellFormDraft,
} from "@/app/exercise/[exercise_type]/_components/AddExercise/actions";
import { AddBarbelProps } from ".";
import { useDebouncedCallback } from "use-debounce";

/**
 * Hook for managing AddBarbell form state and logic.
 * Encapsulates all local state and event handlers for the AddBarbell form, including:
 * - Barbell weight and unit
 * - Reps and effort
 * - Warmup and completion status
 *
 * Returns an API object for use in the AddBarbell component.
 */
const useAddBarbellAPI = (props: AddBarbelProps) => {
  // Initial values for reset
  const initial = React.useMemo(
    () => ({
      // Use initialFormData if provided, otherwise use defaults
      ...(props.initialFormData || {
        totalWeight: 45,
        weightUnit: "pounds" as WeightUnit,
        reps: 5,
        effort: null as PercievedEffort | null,
        warmup: false,
        completionStatus: "completed" as CompletionStatus,
        notes: "",
      }),
      // barWeight is always 45, not user-editable and not part of BarbellFormDraft
      barWeight: 45,
    }),
    [props.initialFormData]
  );
  const [totalWeight, setTotalWeight] = useState<number>(initial.totalWeight);
  // barWeight is always 45, not user-editable, so no need to persist
  // TODO: However this should eventually be configurable so we're keeping it around.
  // TODO: We could actually do a SelectBarbell component in the future to support that.
  const [barWeight] = React.useState(initial.barWeight);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(initial.weightUnit);
  const [reps, setReps] = useState<number>(initial.reps);
  const [percievedEffort, setPercievedEffort] =
    useState<PercievedEffort | null>(initial.effort);
  const [warmup, setWarmup] = useState<boolean>(initial.warmup);
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus>(
    initial.completionStatus
  );
  const [notes, setNotes] = useState<string>(initial.notes);

  // Debounced save function
  const debouncedSave = useDebouncedCallback(
    async (formData: {
      totalWeight: number;
      weightUnit: WeightUnit;
      reps: number;
      effort: PercievedEffort | null;
      warmup: boolean;
      completionStatus: CompletionStatus;
      notes: string;
    }) => {
      try {
        await saveBarbellFormDraft(
          props.userId,
          `/exercise/${props.exerciseType}`,
          formData
        );
      } catch (error) {
        console.error("Failed to save form draft:", error);
      }
    },
    1000
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

  useEffect(() => {
    // Save form data whenever it changes
    const formData = {
      totalWeight,
      weightUnit,
      reps,
      effort: percievedEffort,
      warmup,
      completionStatus,
      notes,
    };

    debouncedSave(formData);
  }, [
    totalWeight,
    weightUnit,
    reps,
    percievedEffort,
    warmup,
    completionStatus,
    notes,
    debouncedSave,
  ]);

  // Reset all fields to initial values
  const reset = React.useCallback(async () => {
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
  const api = useAddBarbellAPI(props);

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
          editing
          targetWeight={api.totalWeight}
          barWeight={api.barWeight}
          onTargetWeightChange={api.onChange}
          weightUnit={api.weightUnit}
          availablePlates={props.availablePlates}
          roundingMode={RoundingMode.NEAREST}
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
