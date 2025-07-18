"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { updateExerciseForUser as updateExerciseForUser } from "@/app/exercise/[exercise_type]/edit/[exercise_id]/_components/actions";
import TextField from "@mui/material/TextField";
import DateTimePicker from "@/components/DateTimePicker";
import { equipmentForExercise } from "@/util";
import { EquipmentWeightEditor } from "@/app/exercise/[exercise_type]/edit/[exercise_id]/_components/EquipmentWeightEditor";
import WarmupCheckbox from "@/components/WarmupCheckbox";
import SelectPercievedEffort from "@/components/select/SelectPercievedEffort";
import SelectReps from "@/components/select/SelectReps/index";
import SelectCompletionStatus from "@/components/select/SelectCompletionStatus";
import { Alert, Button, Stack } from "@mui/material";
import {
  CompletionStatus,
  ExerciseForUser,
  PercievedEffort,
  WeightUnit,
} from "@/common-types";
import React from "react";
import { useNumberInput } from "@/hooks";

interface EditLiftFormProps {
  user_id: string;
  exercise: ExerciseForUser;
  availablePlates: number[];
  availableDumbbells: number[];
}

const useEditExerciseFormAPI = (props: EditLiftFormProps) => {
  const { exercise } = props;
  const [error, setError] = useState<string | null>(null);
  const [targetWeightValue, setTargetWeightValue] = React.useState(
    exercise.target_weight_value!
  );

  const [_, actualWeightValue, setActualWeightValue] = useNumberInput(
    exercise.actual_weight_value
  );

  const [reps, setReps] = useState(exercise.reps!);
  const [warmup, setWarmup] = useState(exercise.warmup!);
  const [completionStatus, setCompletionStatus] = useState(
    exercise.completion_status!
  );
  const [notes, setNotes] = useState(exercise.notes ?? "");
  const [percievedEffort, setPercievedEffort] =
    useState<PercievedEffort | null>(exercise.relative_effort ?? null);
  const initialDate = exercise.performed_at
    ? new Date(exercise.performed_at)
    : new Date();
  const [date, setDate] = useState<Date | null>(initialDate);
  const [time, setTime] = useState<Date | null>(initialDate);

  function handleRepsChange(val: number) {
    setReps(val);
  }
  function handleWarmupChange(value: boolean) {
    setWarmup(value);
  }
  function handleCompletionStatusChange(value: CompletionStatus) {
    setCompletionStatus(value);
  }
  function handleRelativeEffortChange(val: PercievedEffort | null) {
    setPercievedEffort(val);
  }
  function handleNotesChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setNotes(e.target.value);
  }
  function handleDateChange(val: Date | null) {
    setDate(val);
  }
  function handleTimeChange(val: Date | null) {
    setTime(val);
  }

  const searchParams = useSearchParams();
  const backTo = React.useMemo(
    () => searchParams.get("backTo"),
    [searchParams]
  );

  return {
    error,
    setError,
    weightValue: targetWeightValue,
    setWeightValue: setTargetWeightValue,
    actualWeightValue,
    setActualWeightValue,
    reps,
    setReps,
    handleRepsChange,
    warmup,
    setWarmup,
    handleWarmupChange,
    completionStatus,
    setCompletionStatus,
    handleCompletionStatusChange,
    notes,
    setNotes,
    handleNotesChange,
    relativeEffort: percievedEffort,
    setRelativeEffort: setPercievedEffort,
    handleRelativeEffortChange,
    date,
    setDate,
    handleDateChange,
    time,
    setTime,
    handleTimeChange,
    backTo,
    setTargetWeightValue,
    targetWeightValue,
  };
};

export default function EditExerciseForm(props: EditLiftFormProps) {
  const api = useEditExerciseFormAPI(props);

  // TODO - `/exercise/${exercise.exercise_type!}?flash=${exercise.exercise_id}`
  // should be passed from the other page so it knows where to redirect back to.

  // TODO - implement delete functionality
  // TODO - Update form to use action instead of onSubmit
  // TODO - Update value handling to also accept a number I think?
  // TODO - Update the text input for the weight to allow you to actually type
  // in a number, right now you can't backspace since it wants it to be 45, but
  // that should be handled another way.
  // TODO - actually allow the user to change the actual weight value (which should just be a TextField)

  return (
    <form
      action={updateExerciseForUser.bind(
        null,
        props.exercise.exercise_id!,
        props.user_id,
        props.exercise.exercise_type!,
        api.targetWeightValue,
        api.actualWeightValue,
        api.reps,
        api.date && api.time
          ? new Date(api.date.getTime() + api.time.getTime()).toISOString()
          : undefined,
        props.exercise.weight_unit as WeightUnit, // TODO: This should come from user preferences eventually.
        api.warmup,
        api.completionStatus,
        api.notes || null,
        api.relativeEffort || null,
        api.backTo
      )}>
      <Stack gap={1}>
        {api.error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {api.error}
          </Alert>
        )}
        <EquipmentWeightEditor
          equipment={equipmentForExercise(props.exercise.exercise_type!)}
          weightValue={api.targetWeightValue}
          setWeightValue={api.setTargetWeightValue}
          weightUnit={"pounds" as WeightUnit} // TODO: This should come from user preferences eventually.
          availablePlates={props.availablePlates}
          availableDumbbells={props.availableDumbbells}
        />
        <Stack>
          <SelectReps
            reps={api.reps}
            onRepsChange={api.handleRepsChange}
            repChoices={[1, 3, 5, 8, 10, 12, 15]}
          />
        </Stack>
        <Stack
          gap={1}
          useFlexGap
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="center"
          sx={{ my: 1 }}>
          <DateTimePicker
            date={api.date}
            setDate={api.setDate}
            time={api.time}
            setTime={api.setTime}
          />
          <WarmupCheckbox
            checked={api.warmup}
            onChange={api.handleWarmupChange}
          />
          <SelectCompletionStatus
            completionStatus={api.completionStatus}
            onCompletionStatusChange={api.handleCompletionStatusChange}
          />
          <SelectPercievedEffort
            percievedEffort={api.relativeEffort}
            onPercievedEffortChange={api.handleRelativeEffortChange}
          />
        </Stack>
        <TextField
          label="Notes"
          name="notes"
          value={api.notes}
          onChange={api.handleNotesChange}
          fullWidth
          multiline
          minRows={2}
          maxRows={6}
        />
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          justifyContent="space-between">
          <Button color="error" variant="outlined">
            Delete
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Save Changes
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
