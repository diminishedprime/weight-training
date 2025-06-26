"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Typography, Stack, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import type { Database } from "@/database.types";
import { exerciseTypeUIStringLong } from "@/uiStrings";
import {
  updateOneRepMax,
  updateDefaultRestTime,
} from "@/app/preferences/_components/SetExercisePreferences/actions";
import UserTargetMax from "@/components/UserTargetMax";
import { equipmentForExercise } from "@/util";

/**
 * Utility type: RequireKeys<T, K> makes keys K required and non-nullable in T.
 */
type RequireKeys<T, K extends keyof T> = T & {
  [P in K]-?: NonNullable<T[P]>;
};

type UserPreferences =
  Database["public"]["Functions"]["get_user_preferences"]["Returns"][number];

type UserExercisePreferences = RequireKeys<
  UserPreferences,
  "exercise_type" | "default_rest_time_seconds"
>;

/**
 * API hook for SetExercisePreferences component.
 * Encapsulates all state, logic, and event handlers for editing user exercise preferences.
 * All handlers are wrapped in useCallback for referential stability.
 */
const useSetExercisePreferencesAPI = (props: UserExercisePreferences) => {
  const {
    exercise_type,
    one_rep_max_value,
    preferred_weight_unit,
    default_rest_time_seconds,
  } = props;

  const [localOneRepMax, setLocalOneRepMax] = useState<string>(
    one_rep_max_value?.toString() ?? "",
  );
  const [localRestTime, setLocalRestTime] = useState<string>(
    default_rest_time_seconds.toString(),
  );

  useEffect(() => {
    setLocalOneRepMax(one_rep_max_value?.toString() ?? "");
  }, [one_rep_max_value]);

  useEffect(() => {
    setLocalRestTime(default_rest_time_seconds.toString());
  }, [default_rest_time_seconds]);

  const numericOneRepMax = useMemo(
    () => Number(localOneRepMax),
    [localOneRepMax],
  );
  const numericRestTime = useMemo(() => Number(localRestTime), [localRestTime]);
  const savedOneRepMax = useMemo(
    () => Number(one_rep_max_value),
    [one_rep_max_value],
  );
  const savedRestTime = useMemo(
    () => Number(default_rest_time_seconds),
    [default_rest_time_seconds],
  );

  const oneRepMaxChanged = useMemo(
    () => numericOneRepMax !== savedOneRepMax && !!numericOneRepMax,
    [numericOneRepMax, savedOneRepMax],
  );
  const restTimeChanged = useMemo(
    () => numericRestTime !== savedRestTime && !!numericRestTime,
    [numericRestTime, savedRestTime],
  );

  const testIds = useMemo(
    () => getExercisePreferenceTestIds(exercise_type),
    [exercise_type],
  );

  // Use util to determine if this is a bodyweight exercise
  const isBodyweight = useMemo(
    () => equipmentForExercise(exercise_type) === "bodyweight",
    [exercise_type],
  );

  /**
   * Handlers for input changes, wrapped in useCallback for referential stability.
   */
  const handleOneRepMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setLocalOneRepMax(e.target.value),
    [],
  );
  const handleRestTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setLocalRestTime(e.target.value),
    [],
  );

  return {
    localOneRepMax,
    setLocalOneRepMax,
    localRestTime,
    setLocalRestTime,
    numericOneRepMax,
    numericRestTime,
    savedOneRepMax,
    savedRestTime,
    testIds,
    exercise_type,
    preferred_weight_unit,
    oneRepMaxChanged,
    restTimeChanged,
    handleOneRepMaxChange,
    handleRestTimeChange,
    isBodyweight,
  };
};

/**
 * Renders a row for editing user exercise preferences (1RM, target max, rest time).
 * All logic and handlers are provided by useSetExercisePreferencesAPI.
 *
 * @param props - User exercise preferences for a single exercise type.
 */
const SetExercisePreferences: React.FC<UserExercisePreferences> = (props) => {
  const api = useSetExercisePreferencesAPI(props);

  return (
    <Stack
      direction="column"
      spacing={1}
      data-testid="exercise-preference-row"
      sx={{ mb: 2 }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="h6" gutterBottom data-testid="exercise-name">
          {exerciseTypeUIStringLong(api.exercise_type)}
        </Typography>
        <Tooltip
          title={
            "Set your 1 rep max and target max for each exercise. Target max is typically 85-90% of your 1RM. For the way this app works, you should only ever set your 1 rep max to a value you have actually lifted. This value will get updated automatically as you log workouts, so you should not need to update it often. The target max, on the other hand, is used by a lot of training plans to determine what weight you should be doing and is necessarily reflective of a weight you have actually lifted. For example, with the 5/3/1 program, you typically set your target max to 90% of your 1 rep max, and then calculate your weight for exercises to do off of that. Since you don't do a true 1 rep max day that often, your target max will start to get closer to your highest 1 rep max. That is okay, just use that as a guide for when you're ready to have another 1 rep max day."
          }
          placement="top"
        >
          <IconButton size="small" aria-label="Exercise maxes info">
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
      <Stack direction="column" spacing={2}>
        {!api.isBodyweight && (
          <form
            action={updateOneRepMax.bind(
              null,
              api.exercise_type,
              api.preferred_weight_unit!,
              api.localOneRepMax,
            )}
          >
            <TextField
              label={`1 Rep Max${api.oneRepMaxChanged ? " (changed)" : ""}`}
              sx={{ width: "17ch" }}
              name="oneRepMax"
              value={api.localOneRepMax}
              onChange={api.handleOneRepMaxChange}
              size="small"
              inputProps={{ "data-testid": api.testIds.oneRepMaxInput }}
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
                    }
                  >
                    <SendIcon />
                  </IconButton>
                ),
              }}
            />
          </form>
        )}
        <Stack direction="row" spacing={1} alignItems="center">
          {!api.isBodyweight && (
            <UserTargetMax
              exerciseType={api.exercise_type}
              preferredWeightUnit={props.preferred_weight_unit!}
              oneRepMax={props.one_rep_max_value}
              targetMax={props.target_max_value}
              currentPath="/preferences"
            />
          )}
        </Stack>
        <form
          action={updateDefaultRestTime.bind(
            null,
            api.exercise_type,
            api.localRestTime,
          )}
        >
          <TextField
            label={`Rest Time${api.restTimeChanged ? " (changed)" : ""}`}
            sx={{ width: "20ch" }}
            name="defaultRestTime"
            value={api.localRestTime}
            onChange={api.handleRestTimeChange}
            size="small"
            inputProps={{ "data-testid": api.testIds.restTimeInput }}
            InputProps={{
              endAdornment: (
                <>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mr: 1 }}
                  >
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
                    }
                  >
                    <SendIcon />
                  </IconButton>
                </>
              ),
            }}
          />
        </form>
      </Stack>
    </Stack>
  );
};

/**
 * Returns test IDs for exercise preference fields for a given exercise type.
 *
 * @param exerciseType - The exercise type enum value.
 * @returns Object with data-testid strings for each field.
 */
export const getExercisePreferenceTestIds = (
  exerciseType: Database["public"]["Enums"]["exercise_type_enum"],
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
