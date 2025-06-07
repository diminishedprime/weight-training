"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateExerciseForUserAction as updateExerciseForUserAction } from "./actions";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { Database } from "@/database.types";
import RepsSelector from "@/components/RepsSelector";
import DateTimePicker from "@/components/DateTimePicker";
import { correspondingEquipment } from "@/util";
import { EquipmentWeightEditor } from "./EquipmentWeightEditor";
import WarmupCheckbox from "@/components/WarmupCheckbox";
import CompletionStatusEditor from "@/components/CompletionStatusEditor";
import { EffortEditor } from "@/components/EffortEditor";
import { Alert, Button, Stack } from "@mui/material";

export default function EditLiftForm({
  exercise,
  user_id,
}: {
  exercise: Database["public"]["Functions"]["get_exercise_for_user"]["Returns"];
  user_id: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [weightValue, setWeightValue] = useState(exercise.weight_value!);
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

  // Split performedAt into date and time for UI
  const initialDate = exercise.performed_at
    ? new Date(exercise.performed_at)
    : new Date();
  const [date, setDate] = useState<Date | null>(initialDate);
  const [time, setTime] = useState<Date | null>(initialDate);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    // Combine date and time into a single ISO string for the DB
    let performed_at: string | undefined = undefined;
    if (date && time) {
      const combined = new Date(date);
      combined.setHours(time.getHours());
      combined.setMinutes(time.getMinutes());
      combined.setSeconds(0);
      combined.setMilliseconds(0);
      performed_at = combined.toISOString();
    }
    const result = await updateExerciseForUserAction({
      exercise_id: exercise.exercise_id!,
      user_id,
      exercise_type: exercise.exercise_type!,
      weight_value: Number(weightValue),
      reps: Number(reps),
      performed_at,
      weight_unit: weightUnit,
      warmup,
      completion_status: completionStatus,
      notes: notes || undefined,
      relative_effort: relativeEffort || undefined,
    });
    if (result?.error) {
      setError(result.error);
      return;
    }
    router.push(
      `/exercise/${exercise.exercise_type!}?flash=${exercise.exercise_id}`
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <EquipmentWeightEditor
          equipment={correspondingEquipment(exercise.exercise_type!)}
          weightValue={weightValue}
          setWeightValue={setWeightValue}
          weightUnit={weightUnit}
          setWeightUnit={(v: string) =>
            setWeightUnit(v as Database["public"]["Enums"]["weight_unit_enum"])
          }
        />
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <RepsSelector
            reps={reps}
            onChange={setReps}
            repChoices={[1, 3, 5, 8, 10, 12, 15]}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
          <DateTimePicker
            date={date}
            setDate={setDate}
            time={time}
            setTime={setTime}
          />
          <WarmupCheckbox
            checked={warmup}
            onChange={(e) => setWarmup(e.target.checked)}
            sx={{ ml: 1, mr: 1 }}
          />
          <CompletionStatusEditor
            value={completionStatus}
            onChange={(e) =>
              setCompletionStatus(
                e.target
                  .value as Database["public"]["Enums"]["completion_status_enum"]
              )
            }
          />
          <EffortEditor
            value={relativeEffort}
            onChange={setRelativeEffort}
            sx={{ ml: 1 }}
          />
        </Box>
        <TextField
          label="Notes"
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          fullWidth
          multiline
          minRows={2}
          maxRows={6}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Save Changes
        </Button>
      </Stack>
    </form>
  );
}
