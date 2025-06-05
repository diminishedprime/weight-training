"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateLiftForUserAction } from "./actions";
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
import { Database } from "@/database.types";

export default function EditLiftForm({
  lift,
  user_id,
}: {
  lift: Database["public"]["Functions"]["get_lift_for_user"]["Returns"];
  user_id: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [weightValue, setWeightValue] = useState(lift.weight_value!);
  const [weightUnit, setWeightUnit] = useState(lift.weight_unit!);
  const [reps, setReps] = useState(lift.reps!);
  const [performedAt, setPerformedAt] = useState(
    lift.performed_at
      ? new Date(lift.performed_at).toISOString().slice(0, 16)
      : ""
  );
  const [warmup, setWarmup] = useState(lift.warmup!);
  const [completionStatus, setCompletionStatus] = useState(
    lift.completion_status!
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const result = await updateLiftForUserAction({
      lift_id: lift.lift_id!,
      user_id,
      lift_type: lift.lift_type!,
      weight_value: Number(weightValue),
      reps: Number(reps),
      performed_at: performedAt ? new Date(performedAt).toISOString() : null,
      weight_unit: weightUnit,
      warmup,
      completion_status: completionStatus,
    });
    if (result?.error) {
      setError(result.error);
      return;
    }
    router.push(`/exercise/${lift.lift_type!}?flash=${lift.lift_id}`);
  }

  if (error)
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          label="Weight"
          type="number"
          name="weight_value"
          value={weightValue}
          onChange={(e) => setWeightValue(Number(e.target.value))}
          required
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel id="unit-label">Unit</InputLabel>
          <Select
            labelId="unit-label"
            name="weight_unit"
            value={weightUnit}
            label="Unit"
            onChange={(e) =>
              setWeightUnit(
                e.target
                  .value as Database["public"]["Enums"]["weight_unit_enum"]
              )
            }
          >
            <MenuItem value="pounds">Pounds</MenuItem>
            <MenuItem value="kilograms">Kilograms</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Reps"
          type="number"
          name="reps"
          value={reps}
          onChange={(e) => setReps(Number(e.target.value))}
          required
          inputProps={{ min: 1, step: 1 }}
          fullWidth
        />
        <TextField
          label="Date/Time"
          type="datetime-local"
          name="performed_at"
          value={performedAt}
          onChange={(e) => setPerformedAt(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
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
        />
        <FormControl fullWidth>
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
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Not Completed">Not Completed</MenuItem>
            <MenuItem value="Failed">Failed</MenuItem>
            <MenuItem value="Skipped">Skipped</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Save Changes
        </Button>
      </Stack>
    </form>
  );
}
