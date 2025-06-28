"use client";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useCallback, useState } from "react";
import { Database } from "@/database.types";
import { setTargetMaxAction } from "@/app/exercise/[exercise_type]/_components/SetTargetMax/actions";

/**
 * Props for SetTargetMax component.
 * @property exerciseType - The exercise type (enum value)
 * @property userId - The user's ID
 * @property value - (optional) existing target max value
 * @property unit - (optional) existing target max unit
 */
type SetTargetMaxProps = {
  exerciseType: Database["public"]["Enums"]["exercise_type_enum"];
  userId: string;
  value: string | null;
  unit: Database["public"]["Enums"]["weight_unit_enum"] | null;
};

/**
 * Local hook for SetTargetMax logic and state.
 * Handles value/unit state, supports optional initial values from props.
 */
const useSetTargetMaxAPI = (props: SetTargetMaxProps) => {
  const [value, setValue] = useState<string>(props.value ?? "");
  const [unit, setUnit] = useState<
    Database["public"]["Enums"]["weight_unit_enum"]
  >(props.unit ?? "pounds");
  const [error, setError] = useState<string | null>(null);
  const onError = useCallback((err: unknown) => {
    setError((err as Error)?.message || "Unknown error");
  }, []);
  const onValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    [],
  );
  const onUnitChange = useCallback((e: SelectChangeEvent) => {
    setUnit(e.target.value as Database["public"]["Enums"]["weight_unit_enum"]);
  }, []);
  // Expose all bound values for use in the form if needed
  return {
    value,
    setValue,
    unit,
    setUnit,
    error,
    onError,
    onValueChange,
    onUnitChange,
  };
};

/**
 * Form for setting the target max for main lifts.
 * Uses server action as the form action, following Next.js/MUI standards.
 */
const SetTargetMax: React.FC<SetTargetMaxProps> = (props) => {
  const api = useSetTargetMaxAPI(props);
  return (
    <form
      action={setTargetMaxAction.bind(
        null,
        props.userId,
        props.exerciseType,
        api.value,
        api.unit,
      )}
    >
      <Stack spacing={1}>
        <Typography variant="subtitle1">
          Set your target max for {props.exerciseType}
        </Typography>
        <Stack direction="row" spacing={1} useFlexGap>
          <TextField
            name="targetMax"
            size="small"
            label="Target Max"
            value={api.value}
            onChange={api.onValueChange}
          />
          <Select
            size="small"
            name="targetMaxUnit"
            value={api.unit}
            onChange={api.onUnitChange}
            displayEmpty
            inputProps={{ "aria-label": "Unit" }}
          >
            <MenuItem value="pounds">pounds</MenuItem>
            <MenuItem value="kilograms">kilograms</MenuItem>
          </Select>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </Stack>
        {api.error && <Typography color="error">{api.error}</Typography>}
      </Stack>
    </form>
  );
};

export default SetTargetMax;
