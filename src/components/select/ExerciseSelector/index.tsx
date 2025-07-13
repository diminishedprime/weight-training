"use client";
import React from "react";
import { Autocomplete, TextField, Stack } from "@mui/material";
import { Database } from "@/database.types";
import {
  exerciseTypeUIStringBrief,
  exerciseTypeUIStringLong,
  equipmentTypeUIString,
} from "@/uiStrings";
import { useExerciseSelector } from "@/components/select/ExerciseSelector/useExerciseSelector";

type ExerciseType = Database["public"]["Enums"]["exercise_type_enum"];

/**
 * Props for ExerciseSelector component.
 */
export interface ExerciseSelectorProps {
  /** The initial exercise type */
  initial_exercise: ExerciseType | null;
  /** Callback when the exercise type changes */
  onExerciseChange: (exerciseType: ExerciseType | null) => void;
}

/**
 * ExerciseSelector provides a user-friendly way to select exercises
 * using two autocompletes - equipment type and exercise type.
 * The exercise selector is filtered based on the selected equipment.
 */
const ExerciseSelector: React.FC<ExerciseSelectorProps> = (props) => {
  const { initial_exercise, onExerciseChange } = props;

  const exerciseSelectorAPI = useExerciseSelector({
    initial_exercise,
    onExerciseChange,
  });

  return (
    <Stack spacing={2} direction="row" flexWrap="wrap" useFlexGap>
      <Autocomplete
        sx={{ flexGrow: 1 }}
        size="small"
        options={exerciseSelectorAPI.availableEquipment}
        value={exerciseSelectorAPI.selectedEquipment}
        onChange={(_, newValue) =>
          exerciseSelectorAPI.handleEquipmentChange(newValue || null)
        }
        getOptionLabel={(option) => equipmentTypeUIString(option)}
        renderInput={(params) => (
          <TextField {...params} label="Equipment Type" variant="outlined" />
        )}
      />
      <Autocomplete
        sx={{ flexGrow: 1 }}
        size="small"
        options={exerciseSelectorAPI.availableExercises}
        value={exerciseSelectorAPI.selectedExercise}
        onChange={(_, newValue) =>
          exerciseSelectorAPI.handleExerciseChange(newValue || null)
        }
        getOptionLabel={(option) =>
          exerciseSelectorAPI.selectedEquipment
            ? exerciseTypeUIStringBrief(option)
            : exerciseTypeUIStringLong(option)
        }
        renderInput={(params) => (
          <TextField {...params} label="Exercise" variant="outlined" />
        )}
      />
    </Stack>
  );
};

export default ExerciseSelector;
