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
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
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

const useSetExercisePreferences = (props: SetExercisePreferencesProps) => {
  const {
    exercise_type,
    one_rep_max_value,
    target_max_value,
    preferred_weight_unit,
    default_rest_time_seconds,
  } = props;

  const [localOneRepMax, setLocalOneRepMax] = useState(
    one_rep_max_value?.toString() ?? ""
  );
  const [localTargetMax, setLocalTargetMax] = useState(
    target_max_value?.toString() ?? ""
  );
  const [localRestTime, setLocalRestTime] = useState(
    default_rest_time_seconds.toString()
  );

  useEffect(() => {
    setLocalOneRepMax(one_rep_max_value?.toString() ?? "");
  }, [one_rep_max_value]);

  useEffect(() => {
    setLocalTargetMax(target_max_value?.toString() ?? "");
  }, [target_max_value]);

  useEffect(() => {
    setLocalRestTime(default_rest_time_seconds.toString());
  }, [default_rest_time_seconds]);

  const numericOneRepMax = useMemo(
    () => Number(localOneRepMax),
    [localOneRepMax]
  );
  const numericTargetMax = useMemo(
    () => Number(localTargetMax),
    [localTargetMax]
  );
  const numericRestTime = useMemo(() => Number(localRestTime), [localRestTime]);
  const savedOneRepMax = useMemo(
    () => Number(one_rep_max_value),
    [one_rep_max_value]
  );
  const savedTargetMax = useMemo(
    () => Number(target_max_value),
    [target_max_value]
  );
  const savedRestTime = useMemo(
    () => Number(default_rest_time_seconds),
    [default_rest_time_seconds]
  );

  const oneRepMaxChanged = useMemo(
    () => numericOneRepMax !== savedOneRepMax && !!numericOneRepMax,
    [numericOneRepMax, savedOneRepMax]
  );
  const targetMaxChanged = useMemo(
    () => numericTargetMax !== savedTargetMax && !!numericTargetMax,
    [numericTargetMax, savedTargetMax]
  );
  const restTimeChanged = useMemo(
    () => numericRestTime !== savedRestTime && !!numericRestTime,
    [numericRestTime, savedRestTime]
  );

  const testIds = getExercisePreferenceTestIds(exercise_type);

  const nudgeComponent = useMemo(() => {
    if (savedOneRepMax && savedTargetMax) {
      if (savedTargetMax < 0.85 * savedOneRepMax) {
        return (
          <Stack
            direction="column"
            alignItems="flex-start"
            spacing={1}
            sx={{ ml: 1 }}>
            <Typography variant="body2" color="warning.main">
              Your Target Max is quite a bit lower than your 1 Rep Max. Most
              lifters set a target max around 90% of their 1RM. Consider if this
              is intentional, such as if you&apos;re coming back from an injury
              or getting back into lifting after a while off.
            </Typography>
            {savedOneRepMax !== 0 && !!savedOneRepMax && (
              <Button
                variant="outlined"
                size="small"
                sx={{ height: 36, minWidth: 90 }}
                onClick={() => {
                  const ninety = Math.round(savedOneRepMax * 0.9 * 100) / 100;
                  setLocalTargetMax(ninety.toString());
                }}
                data-testid={testIds.setTo90}
                disabled={false}>
                90% 1RM
              </Button>
            )}
          </Stack>
        );
      }
      if (savedTargetMax > savedOneRepMax) {
        return (
          <Typography variant="body2" color="info.main" sx={{ ml: 1 }}>
            Your Target Max is higher than your current 1 Rep Max. You might be
            due for a new 1 rep max attempt. Good luck!
          </Typography>
        );
      }
    }
    return null;
  }, [savedOneRepMax, savedTargetMax, setLocalTargetMax, testIds.setTo90]);

  return {
    localOneRepMax,
    setLocalOneRepMax,
    localTargetMax,
    setLocalTargetMax,
    localRestTime,
    setLocalRestTime,
    numericOneRepMax,
    numericTargetMax,
    numericRestTime,
    savedOneRepMax,
    savedTargetMax,
    savedRestTime,
    testIds,
    nudgeComponent,
    exercise_type,
    preferred_weight_unit,
    oneRepMaxChanged,
    targetMaxChanged,
    restTimeChanged,
  };
};

const SetExercisePreferences: React.FC<SetExercisePreferencesProps> = (
  props
) => {
  const api = useSetExercisePreferences(props);

  return (
    <Stack
      direction="column"
      spacing={1}
      data-testid="exercise-preference-row"
      sx={{ mb: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="h6" gutterBottom data-testid="exercise-name">
          {exerciseTypeUIStringLong(api.exercise_type)}
        </Typography>
        <Tooltip
          title={
            "Set your 1 rep max and target max for each exercise. Target max is typically 85-90% of your 1RM. For the way this app works, you should only ever set your 1 rep max to a value you have actually lifted. This value will get updated automatically as you log workouts, so you should not need to update it often. The target max, on the other hand, is used by a lot of training plans to determine what weight you should be doing and is necessarily reflective of a weight you have actually lifted. For example, with the 5/3/1 program, you typically set your target max to 90% of your 1 rep max, and then calculate your weight for exercises to do off of that. Since you don't do a true 1 rep max day that often, your target max will start to get closer to your highest 1 rep max. That is okay, just use that as a guide for when you're ready to have another 1 rep max day."
          }
          placement="top">
          <IconButton size="small" aria-label="Exercise maxes info">
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
      <Stack direction="row" useFlexGap flexWrap="wrap">
        <Stack direction="row" useFlexGap flexWrap="wrap" spacing={1}>
          <form
            action={updateOneRepMax.bind(
              null,
              api.exercise_type,
              api.preferred_weight_unit!,
              api.localOneRepMax
            )}>
            <TextField
              label={`1 Rep Max${api.oneRepMaxChanged ? " (changed)" : ""}`}
              sx={{ width: "17ch" }}
              name="oneRepMax"
              value={api.localOneRepMax}
              onChange={(e) => {
                api.setLocalOneRepMax(e.target.value);
              }}
              size="small"
              inputProps={{
                "data-testid": api.testIds.oneRepMaxInput,
              }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    type="submit"
                    size="small"
                    disabled={
                      !api.numericOneRepMax ||
                      api.numericOneRepMax === api.savedOneRepMax
                    }
                    data-testid={api.testIds.saveOneRepMax}
                    color={
                      !api.numericOneRepMax ||
                      api.numericOneRepMax === api.savedOneRepMax
                        ? undefined
                        : "primary"
                    }>
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
                api.exercise_type,
                api.preferred_weight_unit!,
                api.localTargetMax
              )}>
              <TextField
                label={`Target Max${api.targetMaxChanged ? " (changed)" : ""}`}
                sx={{ width: "17ch" }}
                name="targetMax"
                value={api.localTargetMax}
                onChange={(e) => api.setLocalTargetMax(e.target.value)}
                size="small"
                inputProps={{
                  "data-testid": api.testIds.targetMaxInput,
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
                      data-testid={api.testIds.saveTargetMax}
                      color={
                        !api.numericTargetMax ||
                        api.numericTargetMax === api.savedTargetMax
                          ? undefined
                          : "primary"
                      }>
                      <SendIcon />
                    </IconButton>
                  ),
                }}
              />
            </form>
          </Stack>
          <form
            action={updateDefaultRestTime.bind(
              null,
              api.exercise_type,
              api.localRestTime
            )}>
            <TextField
              label={`Rest Time${api.restTimeChanged ? " (changed)" : ""}`}
              sx={{ width: "20ch" }}
              name="defaultRestTime"
              value={api.localRestTime}
              onChange={(e) => api.setLocalRestTime(e.target.value)}
              size="small"
              inputProps={{
                "data-testid": api.testIds.restTimeInput,
              }}
              InputProps={{
                endAdornment: (
                  <>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mr: 1 }}>
                      seconds
                    </Typography>
                    <IconButton
                      type="submit"
                      size="small"
                      disabled={
                        !api.numericRestTime ||
                        api.numericRestTime === api.savedRestTime
                      }
                      data-testid={api.testIds.saveRestTime}
                      color={
                        !api.numericRestTime ||
                        api.numericRestTime === api.savedRestTime
                          ? undefined
                          : "primary"
                      }>
                      <SendIcon />
                    </IconButton>
                  </>
                ),
              }}
            />
          </form>
        </Stack>
        {/* Nudge logic for target max vs 1RM, based on saved values */}
      </Stack>
      {api.nudgeComponent}
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
