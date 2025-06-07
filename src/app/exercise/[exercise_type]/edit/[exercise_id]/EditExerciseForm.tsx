"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateExerciseForUserAction as updateExerciseForUserAction } from "./actions";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { Database, Constants } from "@/database.types";
import { completionStatusUIString } from "@/uiStrings";
import BarbellEditor from "@/components/BarbellEditor";
import RepsSelector from "@/components/RepsSelector";
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Box from "@mui/material/Box";

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
    let performed_at: string | null = null;
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
        <BarbellEditor
          totalWeight={weightValue}
          barWeight={45}
          onChange={setWeightValue}
          weightUnit={weightUnit}
          onUnitChange={(unit) =>
            setWeightUnit(
              unit as Database["public"]["Enums"]["weight_unit_enum"]
            )
          }
        />
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <RepsSelector
            reps={reps}
            onChange={setReps}
            repChoices={[1, 3, 5, 8, 10, 12, 15]}
          />
        </Box>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems="center"
          >
            <DatePicker
              label="Date"
              value={date}
              onChange={(newDate) => setDate(newDate)}
              slotProps={{
                textField: {
                  sx: {
                    minWidth: 0,
                    width: "auto",
                    "& .MuiInputBase-root": {
                      minWidth: 0,
                      width: "auto",
                    },
                    "& .MuiOutlinedInput-root": {
                      minWidth: 0,
                      width: "auto",
                    },
                    "& .MuiPickersSectionList-root": {
                      minWidth: 0,
                      width: "auto",
                    },
                  },
                },
              }}
            />
            <TimePicker
              label="Time"
              value={time}
              onChange={(newTime) => setTime(newTime)}
              views={["hours", "minutes", "seconds"]}
              format="HH:mm:ss"
              slotProps={{
                textField: {
                  sx: {
                    minWidth: 0,
                    width: "auto",
                    "& .MuiInputBase-root": {
                      minWidth: 0,
                      width: "auto",
                    },
                    "& .MuiOutlinedInput-root": {
                      minWidth: 0,
                      width: "auto",
                    },
                    "& .MuiPickersSectionList-root": {
                      minWidth: 0,
                      width: "auto",
                    },
                  },
                },
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="warmup"
                  checked={warmup}
                  onChange={(e) => setWarmup(e.target.checked)}
                />
              }
              label="Warmup"
              sx={{ ml: 1, mr: 1 }}
            />
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="completion-status-label">
                Completion Status
              </InputLabel>
              <Select
                labelId="completion-status-label"
                name="completion_status"
                value={completionStatus}
                label="Completion Status"
                onChange={(e) =>
                  setCompletionStatus(
                    e.target
                      .value as Database["public"]["Enums"]["completion_status_enum"]
                  )
                }
              >
                {Constants.public.Enums.completion_status_enum.map((status) => (
                  <MenuItem key={status} value={status}>
                    {completionStatusUIString(status)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </LocalizationProvider>
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
