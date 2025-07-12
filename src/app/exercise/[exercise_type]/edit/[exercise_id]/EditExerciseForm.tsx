"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateExerciseForUserAction as updateExerciseForUserAction } from "@/app/exercise/[exercise_type]/edit/[exercise_id]/actions";
import TextField from "@mui/material/TextField";
import { Database } from "@/database.types";
import RepsSelector from "@/components/RepsSelector/index";
import DateTimePicker from "@/components/DateTimePicker";
import { equipmentForExercise } from "@/util";
import { EquipmentWeightEditor } from "@/app/exercise/[exercise_type]/edit/[exercise_id]/EquipmentWeightEditor";
import WarmupCheckbox from "@/components/WarmupCheckbox";
import { EffortEditor } from "@/components/EffortEditor";
import { Alert, Button, Stack } from "@mui/material";
import CompletionStatusSelector from "@/components/CompletionStatusSelector";
import { CompletionStatus, WeightUnit } from "@/common-types";

function useEditExerciseForm(
  exercise: Database["public"]["Functions"]["get_exercise_for_user"]["Returns"],
  user_id: string
) {
  const [error, setError] = useState<string | null>(null);
  const [weightValue, setWeightValue] = useState(exercise.weight_value!);
  const [actualWeightValue, setActualWeightValue] = useState(
    exercise.actual_weight_value ?? exercise.weight_value!
  );
  const [weightUnit, setWeightUnit] = useState(exercise.weight_unit!);
  const [reps, setReps] = useState(exercise.reps!);
  const [warmup, setWarmup] = useState(exercise.warmup!);
  const [completionStatus, setCompletionStatus] = useState(
    exercise.completion_status!
  );
  const [notes, setNotes] = useState(exercise.notes ?? "");
  const [relativeEffort, setRelativeEffort] = useState<
    Database["public"]["Enums"]["relative_effort_enum"] | null
  >(exercise.relative_effort ?? null);
  const router = useRouter();
  const initialDate = exercise.performed_at
    ? new Date(exercise.performed_at)
    : new Date();
  const [date, setDate] = useState<Date | null>(initialDate);
  const [time, setTime] = useState<Date | null>(initialDate);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    let performed_at: string | undefined = undefined;
    if (date && time) {
      const combined = new Date(date);
      combined.setHours(time.getHours());
      combined.setMinutes(time.getMinutes());
      combined.setSeconds(0);
      combined.setMilliseconds(0);
      performed_at = combined.toISOString();
    }
    const result = await updateExerciseForUserAction(
      exercise.exercise_id!,
      user_id,
      exercise.exercise_type!,
      Number(weightValue),
      Number(actualWeightValue),
      Number(reps),
      performed_at,
      weightUnit,
      warmup,
      completionStatus,
      notes || undefined,
      relativeEffort || undefined
    );
    if (result?.error) {
      setError(result.error);
      return;
    }
    router.push(
      `/exercise/${exercise.exercise_type!}?flash=${exercise.exercise_id}`
    );
  }

  function handleActualWeightValueChange(val: number) {
    setActualWeightValue(val);
  }

  // Handler functions for direct use in onChange (typed to match component expectations)
  function handleWeightValueChange(val: number) {
    setWeightValue(val);
  }
  function handleWeightUnitChange(val: WeightUnit) {
    setWeightUnit(val);
  }
  function handleRepsChange(val: number) {
    setReps(val);
  }
  function handleWarmupChange(value: boolean) {
    setWarmup(value);
  }
  function handleCompletionStatusChange(value: CompletionStatus) {
    setCompletionStatus(value);
  }
  function handleRelativeEffortChange(
    val: Database["public"]["Enums"]["relative_effort_enum"] | null
  ) {
    setRelativeEffort(val);
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

  return {
    error,
    setError,
    weightValue,
    setWeightValue,
    handleWeightValueChange,
    actualWeightValue,
    setActualWeightValue,
    handleActualWeightValueChange,
    weightUnit,
    setWeightUnit,
    handleWeightUnitChange,
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
    relativeEffort,
    setRelativeEffort,
    handleRelativeEffortChange,
    date,
    setDate,
    handleDateChange,
    time,
    setTime,
    handleTimeChange,
    handleSubmit,
  };
}

interface EditLiftFormProps {
  exercise: Database["public"]["Functions"]["get_exercise_for_user"]["Returns"];
  user_id: string;
}

export default function EditExerciseForm(props: EditLiftFormProps) {
  const { exercise, user_id } = props;
  const form = useEditExerciseForm(exercise, user_id);

  // TODO - implement delete functionality
  // TODO - Update form to use action instead of onSubmit
  // TODO - Update value handling to also accept a number I think?
  // TODO - Update the text input for the weight to allow you to actually type
  // in a number, right now you can't backspace since it wants it to be 45, but
  // that should be handled another way.
  // TODO - actually allow the user to change the actual weight value (which should just be a TextField)

  return (
    <form onSubmit={form.handleSubmit}>
      <Stack gap={1}>
        {form.error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {form.error}
          </Alert>
        )}
        <EquipmentWeightEditor
          equipment={equipmentForExercise(exercise.exercise_type!)}
          weightValue={form.weightValue}
          setWeightValue={form.handleWeightValueChange}
          weightUnit={form.weightUnit}
          setWeightUnit={form.handleWeightUnitChange}
        />
        <Stack>
          <RepsSelector
            reps={form.reps}
            onChange={form.handleRepsChange}
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
            date={form.date}
            setDate={form.setDate}
            time={form.time}
            setTime={form.setTime}
          />
          <WarmupCheckbox
            checked={form.warmup}
            onChange={form.handleWarmupChange}
          />
          <CompletionStatusSelector
            value={form.completionStatus}
            onChange={(e) => form.handleCompletionStatusChange(e)}
          />
          <EffortEditor
            value={form.relativeEffort}
            onChange={form.handleRelativeEffortChange}
          />
        </Stack>
        <TextField
          label="Notes"
          name="notes"
          value={form.notes}
          onChange={form.handleNotesChange}
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
