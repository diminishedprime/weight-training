"use client";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useCallback, useMemo, useState } from "react";
import { setTargetMaxAction } from "@/components/SetTargetMax/actions";
import { ExerciseType, WeightUnit } from "@/common-types";

/**
 * Props for SetTargetMax component.
 * @property exerciseType - The exercise type (enum value)
 * @property userId - The user's ID
 * @property value - (optional) existing target max value
 * @property unit - (optional) existing target max unit
 * @property one_rep_max_value - (optional) existing one rep max value
 * @property one_rep_max_unit - (optional) existing one rep max unit
 */
type SetTargetMaxProps = {
  exerciseType: ExerciseType;
  userId: string;
  targetMaxValue: string | null;
  targetMaxUnit: WeightUnit | null;
  oneRepMaxValue: string | null;
  oneRepMaxUnit: WeightUnit | null;
  pathToRevalidate?: string;
};

/**
 * Local hook for SetTargetMax logic and state.
 * Handles value/unit state, supports optional initial values from props.
 */
const useSetTargetMaxAPI = (props: SetTargetMaxProps) => {
  const [targetMaxValue, setTargetMaxValue] = useState<string>(
    props.targetMaxValue ?? "",
  );
  const [targetMaxUnit, setTargetMaxUnit] = useState<WeightUnit>(
    props.targetMaxUnit ?? "pounds",
  );

  const onValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTargetMaxValue(e.target.value);
    },
    [],
  );

  const onUnitChange = useCallback((e: SelectChangeEvent) => {
    setTargetMaxUnit(e.target.value as WeightUnit);
  }, []);

  const numericalTargetMax = useMemo(() => {
    if (props.targetMaxValue === null) {
      return null;
    }
    const num = Number(targetMaxValue);
    return isNaN(num) ? null : num;
  }, [props.targetMaxValue, targetMaxValue]);

  const numericalOneRepMaxValue = useMemo(() => {
    if (props.oneRepMaxValue === null) {
      return null;
    }
    const num = Number(props.oneRepMaxValue);
    return isNaN(num) ? null : num;
  }, [props.oneRepMaxValue]);

  const percentOfOneRepMax = useMemo(() => {
    if (numericalOneRepMaxValue === null || numericalTargetMax === null) {
      return null;
    }
    return (numericalTargetMax / numericalOneRepMaxValue) * 100;
  }, [numericalTargetMax, numericalOneRepMaxValue]);

  const handleSet90 = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (numericalOneRepMaxValue !== null) {
        setTargetMaxValue((numericalOneRepMaxValue * 0.9).toFixed(2));
      }
    },
    [numericalOneRepMaxValue],
  );

  const percentHelperText = useMemo(() => {
    if (percentOfOneRepMax === null) {
      return null;
    }
    return (
      <span>
        {`${percentOfOneRepMax.toFixed(2)}% of ORM. `}
        <a href="#" onClick={handleSet90}>
          set to 90%
        </a>
      </span>
    );
  }, [percentOfOneRepMax, handleSet90]);

  const targetMaxLabel = useMemo(() => {
    if (
      props.targetMaxValue !== null &&
      props.targetMaxValue !== undefined &&
      props.targetMaxValue !== targetMaxValue
    ) {
      return `Target Max (was ${props.targetMaxValue}) `;
    }
    return "Target Max";
  }, [props.targetMaxValue, targetMaxValue]);

  // Expose all bound values for use in the form if needed
  return {
    value: targetMaxValue,
    setValue: setTargetMaxValue,
    unit: targetMaxUnit,
    setUnit: setTargetMaxUnit,
    onValueChange,
    onUnitChange,
    percentHelperText,
    targetMaxLabel,
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
        props.pathToRevalidate,
      )}
    >
      <Stack spacing={1}>
        <Stack direction="row" spacing={1} useFlexGap alignItems="flex-start">
          <TextField
            name="targetMax"
            size="small"
            label={api.targetMaxLabel}
            value={api.value}
            onChange={api.onValueChange}
            helperText={api.percentHelperText}
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
      </Stack>
    </form>
  );
};

export default SetTargetMax;
