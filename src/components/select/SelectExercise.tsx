"use client";
import { EquipmentType, ExerciseType } from "@/common-types";
import { Constants } from "@/database.types";
import {
  equipmentTypeUIString,
  exerciseTypeUIStringBrief,
  exerciseTypeUIStringLong,
} from "@/uiStrings";
import { equipmentForExercise, getExercisesByEquipment } from "@/util";
import { Autocomplete, Stack, TextField } from "@mui/material";
import React, { useMemo, useState } from "react";

export interface SelectExerciseProps {
  initial_exercise: ExerciseType | null;
  onExerciseChange: (exerciseType: ExerciseType | null) => void;
}

const useSelectExerciseAPI = (props: SelectExerciseProps) => {
  const { initial_exercise, onExerciseChange } = props;

  const [selectedExercise, setSelectedExercise] = useState<ExerciseType | null>(
    initial_exercise ?? null,
  );
  const [selectedEquipment, setSelectedEquipment] =
    useState<EquipmentType | null>(
      (initial_exercise !== null && equipmentForExercise(initial_exercise)) ||
        null,
    );

  const availableExercises = useMemo(() => {
    if (!selectedEquipment) {
      return [...Constants.public.Enums.exercise_type_enum];
    }

    const exercisesByEquipment = getExercisesByEquipment();
    return exercisesByEquipment[selectedEquipment];
  }, [selectedEquipment]);

  const availableEquipment = useMemo(() => {
    return [...Constants.public.Enums.equipment_type_enum];
  }, []);

  const handleExerciseChange = (newExercise: ExerciseType | null) => {
    setSelectedExercise(newExercise);
    onExerciseChange(newExercise);

    if (newExercise && !selectedEquipment) {
      const equipment = equipmentForExercise(newExercise);
      setSelectedEquipment(equipment);
    }
  };

  const handleEquipmentChange = (newEquipment: EquipmentType | null) => {
    setSelectedEquipment(newEquipment);

    if (selectedExercise && newEquipment) {
      const exerciseEquipment = equipmentForExercise(selectedExercise);
      if (exerciseEquipment !== newEquipment) {
        setSelectedExercise(null);
        onExerciseChange(null);
      }
    }
  };

  return {
    selectedExercise,
    handleExerciseChange,
    availableExercises,
    selectedEquipment,
    handleEquipmentChange,
    availableEquipment,
  };
};

const SelectExercise: React.FC<SelectExerciseProps> = (props) => {
  const { initial_exercise, onExerciseChange } = props;

  const api = useSelectExerciseAPI({
    initial_exercise,
    onExerciseChange,
  });

  return (
    <Stack spacing={2} direction="row" flexWrap="wrap" useFlexGap>
      <Autocomplete
        sx={{ flexGrow: 1 }}
        size="small"
        options={api.availableEquipment}
        value={api.selectedEquipment}
        onChange={(_, newValue) => api.handleEquipmentChange(newValue || null)}
        getOptionLabel={(option) => equipmentTypeUIString(option)}
        renderInput={(params) => (
          <TextField {...params} label="Equipment Type" variant="outlined" />
        )}
      />
      <Autocomplete
        sx={{ flexGrow: 1 }}
        size="small"
        options={api.availableExercises}
        value={api.selectedExercise}
        onChange={(_, newValue) => api.handleExerciseChange(newValue || null)}
        getOptionLabel={(option) =>
          api.selectedEquipment
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

export default SelectExercise;
