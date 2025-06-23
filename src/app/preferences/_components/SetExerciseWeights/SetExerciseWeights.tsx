"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Typography,
  Stack,
  TextField,
  Button,
  Chip,
  InputAdornment,
} from "@mui/material";
import type { Database } from "@/database.types";
import {
  exerciseTypeUIStringBrief,
  exerciseTypeUIStringLong,
} from "@/uiStrings";
import { updateOneRepMax, updateTargetMax } from "./actions";
import { getExercisesByEquipment } from "@/util";

interface SetExerciseWeightsProps {
  exerciseType: Database["public"]["Enums"]["exercise_type_enum"];
  oneRepMax?: number;
  targetMax?: number;
  weightUnit: Database["public"]["Enums"]["weight_unit_enum"];
}

const equipmentGroups = getExercisesByEquipment();
const allEquipmentTypes = Object.keys(equipmentGroups);

const SetExerciseWeights: React.FC<SetExerciseWeightsProps> = (props) => {
  const { exerciseType, oneRepMax, targetMax, weightUnit } = props;

  const [localOneRepMax, setLocalOneRepMax] = useState(oneRepMax ?? "");
  const [localTargetMax, setLocalTargetMax] = useState(targetMax ?? "");

  useEffect(() => {
    setLocalOneRepMax(oneRepMax ?? "");
  }, [oneRepMax]);

  useEffect(() => {
    setLocalTargetMax(targetMax ?? "");
  }, [targetMax]);

  const oneRepMaxSaveDisabled = useMemo(() => {
    const initialOne = oneRepMax ?? "";
    return localOneRepMax === initialOne || !localOneRepMax;
  }, [localOneRepMax, oneRepMax]);

  const targetMaxSaveDisabled = useMemo(() => {
    const initialTarget = targetMax ?? "";
    return localTargetMax === initialTarget || !localTargetMax;
  }, [localTargetMax, targetMax]);

  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="h6" gutterBottom>
        {exerciseTypeUIStringLong(exerciseType)}
      </Typography>
      <Stack direction="column" spacing={2} useFlexGap flexWrap="wrap">
        <Stack direction="column" spacing={1}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            component="form"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!oneRepMaxSaveDisabled) {
                const result = await updateOneRepMax(
                  exerciseType,
                  Number(localOneRepMax),
                  weightUnit
                );
              }
            }}>
            <TextField
              label="1 Rep Max"
              value={localOneRepMax}
              onChange={(e) => setLocalOneRepMax(e.target.value)}
              sx={{ minWidth: 150 }}
              size="small"
              slotProps={{
                input: {
                  endAdornment: weightUnit,
                },
              }}
            />
            <Button
              variant="contained"
              size="small"
              disabled={oneRepMaxSaveDisabled}
              sx={{ height: 36 }}
              type="submit">
              Save
            </Button>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              component="form"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!targetMaxSaveDisabled) {
                  const result = await updateTargetMax(
                    exerciseType,
                    Number(localTargetMax),
                    weightUnit
                  );
                }
              }}
              sx={{ flex: 1 }}>
              <TextField
                label="Target Max"
                value={localTargetMax}
                onChange={(e) => setLocalTargetMax(e.target.value)}
                sx={{ minWidth: 150 }}
                size="small"
                slotProps={{
                  input: {
                    endAdornment: weightUnit,
                  },
                }}
              />
              {oneRepMax !== undefined && !isNaN(Number(oneRepMax)) && (
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ height: 36, minWidth: 90 }}
                  onClick={() => {
                    const ninety =
                      Math.round(Number(oneRepMax) * 0.9 * 100) / 100;
                    setLocalTargetMax(ninety.toString());
                  }}
                  disabled={false}>
                  set to 90%
                </Button>
              )}
              <Button
                variant="contained"
                size="small"
                disabled={targetMaxSaveDisabled}
                sx={{ height: 36 }}
                type="submit">
                Save
              </Button>
            </Stack>
          </Stack>
          {/* Nudge logic for target max vs 1RM, based on saved values */}
          {oneRepMax !== undefined &&
            targetMax !== undefined &&
            !isNaN(Number(oneRepMax)) &&
            !isNaN(Number(targetMax)) &&
            (() => {
              const oneRM = Number(oneRepMax);
              const target = Number(targetMax);
              if (target < 0.85 * oneRM) {
                return (
                  <Typography
                    variant="body2"
                    color="warning.main"
                    sx={{ ml: 1 }}>
                    Your Target Max is quite a bit lower than your 1 Rep Max.
                    Most lifters set a target max around 90% of their 1RM.
                    Consider if this is intentional, such as if you're coming
                    back from an injury or getting back into lifting after a
                    while off.
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
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SetExerciseWeights;
