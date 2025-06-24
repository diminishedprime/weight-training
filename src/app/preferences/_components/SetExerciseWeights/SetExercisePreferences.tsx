"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Typography,
  Stack,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import type { Database } from "@/database.types";
import { exerciseTypeUIStringLong } from "@/uiStrings";
import {
  updateOneRepMax,
  updateTargetMax,
  updateDefaultRestTime,
} from "./actions";

type RequireKeys<T, K extends keyof T> = T & {
  [P in K]-?: NonNullable<T[P]>;
};

type SetExercisePreferencesProps = RequireKeys<
  Database["public"]["Functions"]["get_user_preferences"]["Returns"][number],
  "exercise_type" | "default_rest_time_seconds"
>;

const SetExercisePreferences: React.FC<SetExercisePreferencesProps> = (
  props
) => {
  // Use new prop names from updated type
  const {
    exercise_type,
    one_rep_max_value,
    target_max_value,
    preferred_weight_unit,
    default_rest_time_seconds,
  } = props;

  const [localOneRepMax, setLocalOneRepMax] = useState(
    one_rep_max_value !== undefined && one_rep_max_value !== null
      ? one_rep_max_value.toString()
      : ""
  );

  const [localTargetMax, setLocalTargetMax] = useState(
    target_max_value !== undefined && target_max_value !== null
      ? target_max_value.toString()
      : ""
  );

  const [localRestTime, setLocalRestTime] = useState(
    default_rest_time_seconds.toString()
  );

  useEffect(() => {
    setLocalOneRepMax(
      one_rep_max_value !== undefined && one_rep_max_value !== null
        ? one_rep_max_value.toString()
        : ""
    );
  }, [one_rep_max_value]);

  useEffect(() => {
    setLocalTargetMax(
      target_max_value !== undefined && target_max_value !== null
        ? target_max_value.toString()
        : ""
    );
  }, [target_max_value]);

  useEffect(() => {
    setLocalRestTime(default_rest_time_seconds.toString());
  }, [default_rest_time_seconds]);

  const oneRepMaxSaveDisabled = useMemo(() => {
    const initialOne =
      one_rep_max_value !== undefined && one_rep_max_value !== null
        ? one_rep_max_value.toString()
        : "";
    return localOneRepMax === initialOne || !localOneRepMax;
  }, [localOneRepMax, one_rep_max_value]);

  const targetMaxSaveDisabled = useMemo(() => {
    const initialTarget =
      target_max_value !== undefined && target_max_value !== null
        ? target_max_value.toString()
        : "";
    return localTargetMax === initialTarget || !localTargetMax;
  }, [localTargetMax, target_max_value]);

  const restTimeSaveDisabled = useMemo(() => {
    return (
      localRestTime === default_rest_time_seconds.toString() || !localRestTime
    );
  }, [localRestTime, default_rest_time_seconds]);

  const testIds = getExercisePreferenceTestIds(exercise_type);

  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="h6" gutterBottom>
        {exerciseTypeUIStringLong(exercise_type)}
      </Typography>
      <Stack direction="row" useFlexGap flexWrap="wrap">
        <Stack direction="row" useFlexGap flexWrap="wrap" spacing={1}>
          <form
            action={updateOneRepMax.bind(
              null,
              exercise_type,
              preferred_weight_unit!,
              localOneRepMax
            )}
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
            }}>
            <TextField
              label="1 Rep Max"
              name="oneRepMax"
              value={localOneRepMax}
              onChange={(e) => {
                setLocalOneRepMax(e.target.value);
              }}
              size="small"
              inputProps={{
                "data-testid": testIds.oneRepMaxInput,
              }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    type="submit"
                    size="small"
                    disabled={oneRepMaxSaveDisabled}
                    data-testid={testIds.saveOneRepMax}
                    color={oneRepMaxSaveDisabled ? undefined : "primary"}>
                    <SendIcon />
                  </IconButton>
                ),
              }}
            />
          </form>
          <Stack direction="row" spacing={1} alignItems="center">
            <form
              action={updateTargetMax.bind(
                null,
                exercise_type,
                preferred_weight_unit!,
                localTargetMax
              )}
              style={{
                display: "flex",
                flex: 1,
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
              }}>
              <TextField
                label="Target Max"
                name="targetMax"
                value={localTargetMax}
                onChange={(e) => setLocalTargetMax(e.target.value)}
                sx={{ minWidth: 150 }}
                size="small"
                inputProps={{
                  "data-testid": testIds.targetMaxInput,
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      type="submit"
                      size="small"
                      disabled={targetMaxSaveDisabled}
                      data-testid={testIds.saveTargetMax}
                      color={targetMaxSaveDisabled ? undefined : "primary"}>
                      <SendIcon />
                    </IconButton>
                  ),
                }}
              />
              {one_rep_max_value !== undefined &&
                one_rep_max_value !== null &&
                !isNaN(Number(one_rep_max_value)) && (
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ height: 36, minWidth: 90 }}
                    onClick={() => {
                      const ninety =
                        Math.round(Number(one_rep_max_value) * 0.9 * 100) / 100;
                      setLocalTargetMax(ninety.toString());
                    }}
                    data-testid={testIds.setTo90}
                    disabled={false}>
                    set to 90%
                  </Button>
                )}
            </form>
          </Stack>
          {/* Nudge logic for target max vs 1RM, based on saved values */}
          {one_rep_max_value !== undefined &&
            target_max_value !== undefined &&
            one_rep_max_value !== null &&
            target_max_value !== null &&
            !isNaN(Number(one_rep_max_value)) &&
            !isNaN(Number(target_max_value)) &&
            (() => {
              const oneRM = Number(one_rep_max_value);
              const target = Number(target_max_value);
              if (target < 0.85 * oneRM) {
                return (
                  <Typography
                    variant="body2"
                    color="warning.main"
                    sx={{ ml: 1 }}>
                    Your Target Max is quite a bit lower than your 1 Rep Max.
                    Most lifters set a target max around 90% of their 1RM.
                    Consider if this is intentional, such as if you&apos;re
                    coming back from an injury or getting back into lifting
                    after a while off.
                  </Typography>
                );
              }
              if (target > oneRM) {
                return (
                  <Typography variant="body2" color="info.main" sx={{ ml: 1 }}>
                    Your Target Max is higher than your current 1 Rep Max. You
                    might be due for a new 1 rep max attempt. Good luck!
                  </Typography>
                );
              }
              return null;
            })()}
          <form
            action={updateDefaultRestTime.bind(
              null,
              exercise_type,
              localRestTime
            )}
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
              marginTop: 8,
            }}>
            <TextField
              label="Default Rest Time (seconds)"
              name="defaultRestTime"
              type="number"
              value={localRestTime}
              onChange={(e) => setLocalRestTime(e.target.value)}
              sx={{ minWidth: 180 }}
              size="small"
              inputProps={{
                min: 0,
                step: 1,
                "data-testid": testIds.restTimeInput,
              }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    type="submit"
                    size="small"
                    disabled={restTimeSaveDisabled}
                    data-testid={testIds.saveRestTime}
                    color={restTimeSaveDisabled ? undefined : "primary"}>
                    <SendIcon />
                  </IconButton>
                ),
              }}
            />
          </form>
        </Stack>
      </Stack>
    </Stack>
  );
};

export const getExercisePreferenceTestIds = (
  exerciseType: Database["public"]["Enums"]["exercise_type_enum"]
) => ({
  oneRepMaxInput: `one-rep-max-input-${exerciseType}`,
  saveOneRepMax: `save-one-rep-max-${exerciseType}`,
  targetMaxInput: `target-max-input-${exerciseType}`,
  saveTargetMax: `save-target-max-${exerciseType}`,
  setTo90: `set-to-90-${exerciseType}`,
  restTimeInput: `rest-time-input-${exerciseType}`,
  saveRestTime: `save-rest-time-${exerciseType}`,
});

export default SetExercisePreferences;
