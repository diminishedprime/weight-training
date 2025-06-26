"use client";

import React from "react";
import {
  TextField,
  IconButton,
  Tooltip,
  Stack,
  Button,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import UndoIcon from "@mui/icons-material/Undo";
import type { Database } from "@/database.types";
import { updateUserTargetMax } from "@/components/UserTargetMax/actions";
import { getBumpAmountForExerciseType } from "@/util";

/**
 * Type alias for exercise type enum.
 */
type ExerciseType = Database["public"]["Enums"]["exercise_type_enum"];
/**
 * Type alias for weight unit enum.
 */
type WeightUnit = Database["public"]["Enums"]["weight_unit_enum"];

/**
 * Returns test IDs for UserTargetMax fields for a given exercise type.
 * @param exerciseType - The exercise type enum value.
 * @returns Object with data-testid strings for each field.
 */
export const getUserTargetMaxTestIds = (exerciseType: ExerciseType) => ({
  targetMaxInput: `target-max-input-${exerciseType}`,
  saveTargetMax: `save-target-max-${exerciseType}`,
  setTo90: `set-to-90-${exerciseType}`,
});

/**
 * API hook for UserTargetMax. Encapsulates all state, logic, and event handlers.
 * @param props - UserTargetMaxProps
 * @returns API object for UserTargetMax
 */
const useUserTargetMaxAPI = (props: UserTargetMaxProps) => {
  const [localTargetMax, setLocalTargetMax] = React.useState<string>(
    props.targetMax?.toString() ?? "",
  );
  React.useEffect(() => {
    setLocalTargetMax(props.targetMax?.toString() ?? "");
  }, [props.targetMax]);

  const numericTargetMax = React.useMemo(
    () => Number(localTargetMax),
    [localTargetMax],
  );
  const savedTargetMax = React.useMemo(
    () => Number(props.targetMax),
    [props.targetMax],
  );
  const numericOneRepMax = React.useMemo(
    () => Number(props.oneRepMax),
    [props.oneRepMax],
  );
  const targetMaxChanged = React.useMemo(
    () => numericTargetMax !== savedTargetMax && !!numericTargetMax,
    [numericTargetMax, savedTargetMax],
  );
  const bumpAmount = React.useMemo(
    () => getBumpAmountForExerciseType(props.exerciseType),
    [props.exerciseType],
  );

  const targetMaxSummary = React.useMemo(() => {
    if (isNaN(numericTargetMax) || isNaN(savedTargetMax)) return undefined;
    const diff = numericTargetMax - savedTargetMax;
    const absDiff = Math.abs(diff);
    const diffStr = diff === 0 ? "" : `${diff > 0 ? "+" : "-"}${absDiff}`;
    if (numericOneRepMax > 0 && numericTargetMax > 0) {
      const percent = Math.round((numericTargetMax / numericOneRepMax) * 100);
      return diffStr
        ? `${percent}% of 1RM, ${diffStr} from current target max`
        : `${percent}% of 1RM`;
    }
    return diffStr ? `${diffStr} from current target max` : undefined;
  }, [numericTargetMax, savedTargetMax, numericOneRepMax]);

  const targetMaxSummaryParts = React.useMemo(() => {
    if (isNaN(numericTargetMax) || isNaN(savedTargetMax)) return undefined;
    const diff = numericTargetMax - savedTargetMax;
    const absDiff = Math.abs(diff);
    let diffPart:
      | {
          text: string;
          color: "success.main" | "warning.main" | "text.secondary";
        }
      | undefined;
    if (diff !== 0) {
      const direction = diff > 0 ? "increase" : "decrease";
      const color = diff > 0 ? "success.main" : "warning.main";
      diffPart = {
        text: `${absDiff} pound ${direction}`,
        color,
      };
    }
    let percentPart:
      | {
          text: string;
          color: "success.main" | "warning.main" | "text.secondary";
        }
      | undefined;
    if (numericOneRepMax > 0 && numericTargetMax > 0) {
      const percent = Math.round((numericTargetMax / numericOneRepMax) * 100);
      let color: "success.main" | "warning.main" | "text.secondary" =
        "text.secondary";
      if (percent > 100) color = "success.main";
      else if (percent < 100) color = "warning.main";
      percentPart = {
        text: `${percent}% of 1RM`,
        color,
      };
    }
    if (!percentPart && !diffPart) return undefined;
    return { percentPart, diffPart };
  }, [numericTargetMax, savedTargetMax, numericOneRepMax]);

  const handleTargetMaxChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalTargetMax(e.target.value);
    },
    [],
  );

  const handleSetTo90 = React.useCallback(() => {
    if (numericOneRepMax) {
      const ninety = Math.round(numericOneRepMax * 0.9 * 100) / 100;
      setLocalTargetMax(ninety.toString());
    }
  }, [numericOneRepMax]);

  const handleReset = React.useCallback(() => {
    setLocalTargetMax(props.targetMax?.toString() ?? "");
  }, [props.targetMax]);

  const handleBumpUp = React.useCallback(() => {
    if (!isNaN(numericTargetMax)) {
      setLocalTargetMax((prev) => (Number(prev) + bumpAmount).toString());
    }
  }, [numericTargetMax, bumpAmount]);

  const handleBumpDown = React.useCallback(() => {
    if (!isNaN(numericTargetMax)) {
      setLocalTargetMax((prev) => (Number(prev) - bumpAmount).toString());
    }
  }, [numericTargetMax, bumpAmount]);

  const targetMaxLabel = React.useMemo(() => {
    let label = "Target Max";
    if (targetMaxChanged) label += " (changed)";
    return label;
  }, [targetMaxChanged]);

  return {
    localTargetMax,
    setLocalTargetMax,
    numericTargetMax,
    savedTargetMax,
    numericOneRepMax,
    targetMaxChanged,
    bumpAmount,
    targetMaxLabel,
    targetMaxSummary,
    targetMaxSummaryParts,
    handleTargetMaxChange,
    handleSetTo90,
    handleReset,
    handleBumpUp,
    handleBumpDown,
  };
};

/**
 * Props for UserTargetMax component.
 * @field exerciseType - The exercise type enum value.
 * @field preferredWeightUnit - The user's preferred weight unit.
 * @field oneRepMax - The user's current 1RM for this exercise (if any).
 * @field targetMax - The user's current target max for this exercise (if any).
 */
export interface UserTargetMaxProps {
  exerciseType: ExerciseType;
  preferredWeightUnit: WeightUnit;
  oneRepMax?: number | null;
  targetMax?: number | null;
  currentPath: string;
}

/**
 * UserTargetMax component: allows editing the target max for an exercise, with 1RM context and 90% nudge.
 * All logic and handlers are provided by useUserTargetMaxAPI.
 * @param props - UserTargetMaxProps
 */
const UserTargetMax: React.FC<UserTargetMaxProps> = (props) => {
  const api = useUserTargetMaxAPI(props);
  const testIds = getUserTargetMaxTestIds(props.exerciseType);

  // This UI is a bit ugly right now, but it works so that's okay for now.

  return (
    <Stack direction="column">
      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        useFlexGap
        alignItems="flex-start"
      >
        <Tooltip title="Reset to saved value">
          <span>
            <IconButton
              onClick={api.handleReset}
              size="small"
              aria-label="Reset to saved value"
              data-testid={`reset-target-max-${props.exerciseType}`}
              disabled={!api.targetMaxChanged}
            >
              <UndoIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Button
          onClick={api.handleBumpDown}
          aria-label={`Subtract ${api.bumpAmount}`}
          data-testid={`bump-down-${props.exerciseType}`}
          disabled={isNaN(api.numericTargetMax)}
          variant="outlined"
        >
          {`Sub ${api.bumpAmount}`}
        </Button>
        <form
          action={updateUserTargetMax.bind(
            null,
            props.exerciseType,
            props.preferredWeightUnit,
            api.localTargetMax,
            props.currentPath,
          )}
          style={{ display: "flex", alignItems: "center", margin: 0 }}
        >
          <TextField
            label={api.targetMaxLabel}
            sx={{ width: "17ch" }}
            name="targetMax"
            value={api.localTargetMax}
            onChange={api.handleTargetMaxChange}
            size="small"
            inputProps={{
              "data-testid": testIds.targetMaxInput,
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  type="submit"
                  size="small"
                  disabled={
                    !api.numericTargetMax ||
                    api.numericTargetMax === api.savedTargetMax
                  }
                  data-testid={testIds.saveTargetMax}
                  color={
                    !api.numericTargetMax ||
                    api.numericTargetMax === api.savedTargetMax
                      ? undefined
                      : "primary"
                  }
                  sx={{ alignSelf: "center" }}
                >
                  <SendIcon />
                </IconButton>
              ),
            }}
          />
        </form>
        <Button
          onClick={api.handleBumpUp}
          aria-label={`Add ${api.bumpAmount}`}
          data-testid={`bump-up-${props.exerciseType}`}
          disabled={isNaN(api.numericTargetMax)}
          variant="outlined"
        >
          {`Add ${api.bumpAmount}`}
        </Button>
      </Stack>
      {(api.targetMaxSummaryParts?.percentPart ||
        api.targetMaxSummaryParts?.diffPart) && (
        <Stack direction="column" justifyContent="center" alignItems="center">
          {api.targetMaxSummaryParts.percentPart && (
            <Typography
              variant="body2"
              sx={{ color: api.targetMaxSummaryParts.percentPart.color }}
              data-testid="target-max-percent-summary"
            >
              {api.targetMaxSummaryParts.percentPart.text}
            </Typography>
          )}
          {api.targetMaxSummaryParts.diffPart && (
            <Typography
              variant="body2"
              sx={{ color: api.targetMaxSummaryParts.diffPart.color }}
              data-testid="target-max-diff-summary"
            >
              {api.targetMaxSummaryParts.diffPart.text}
            </Typography>
          )}
        </Stack>
      )}
    </Stack>
  );
};

export default UserTargetMax;
