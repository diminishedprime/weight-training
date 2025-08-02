"use client";
import { EquipmentType, ExerciseType, ProgramDayType } from "@/common-types";
import {
  EQUIPMENT_TYPES,
  EXERCISES_FOR_DAY_TYPE,
  PROGRAM_DAY_TYPES,
} from "@/constants";
import { Constants } from "@/database.types";
import {
  equipmentTypeUIString,
  exerciseTypeUIStringBrief,
  exerciseTypeUIStringLong,
  programDayTypeUIString,
} from "@/uiStrings";
import { equipmentForExercise, EXERCISES_BY_EQUIPMENT } from "@/util";
import { Autocomplete, Chip, Stack, TextField } from "@mui/material";
import { Set as ImmutableSet } from "immutable";
import React, { useCallback, useMemo, useState } from "react";

export interface SelectExerciseProps {
  exercise: ExerciseType | null;
  setExercise: React.Dispatch<React.SetStateAction<ExerciseType | null>>;
}

const SelectExercise: React.FC<SelectExerciseProps> = (props) => {
  const api = useSelectExerciseAPI(props);

  // TODO: easy if we change the chips, and the selected exercise is no longer valid,
  // it should be cleared.

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {Constants.public.Enums.program_day_types_enum.map((dayType) => (
          <Chip
            key={dayType}
            label={programDayTypeUIString(dayType)}
            onClick={() => api.onChipClick(dayType)}
            variant={
              api.selectedProgramDayTypes.has(dayType) ? "filled" : "outlined"
            }
            color={
              api.selectedProgramDayTypes.has(dayType) ? "secondary" : "default"
            }
          />
        ))}
        <Chip
          sx={{ ml: 1 }}
          label="All"
          color={api.selectAllDisabled ? "default" : "primary"}
          onClick={api.selectAllProgramDayTypes}
          disabled={api.selectAllDisabled}
        />
      </Stack>
      <Stack spacing={1.25}>
        <Autocomplete
          fullWidth
          size="small"
          options={api.availableEquipment}
          value={api.selectedEquipment}
          onChange={(_, newValue) => api.handleEquipmentChange(newValue)}
          getOptionLabel={(option) => equipmentTypeUIString(option)}
          renderInput={(params) => (
            <TextField {...params} label="Equipment Type" variant="outlined" />
          )}
        />
        <Autocomplete
          fullWidth
          size="small"
          options={api.availableExercises.toArray()}
          value={props.exercise}
          onChange={(_, newValue) => api.handleExerciseChange(newValue)}
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
    </Stack>
  );
};

export default SelectExercise;

const useSelectExerciseAPI = (props: SelectExerciseProps) => {
  const { exercise, setExercise } = props;

  const [selectedEquipment, setSelectedEquipment] =
    useState<EquipmentType | null>(
      (exercise !== null && equipmentForExercise(exercise)) || null,
    );

  const [selectedProgramDayTypes, setSelectedProgramDayTypes] = useState<
    ImmutableSet<ProgramDayType>
  >(ImmutableSet(PROGRAM_DAY_TYPES));

  const exercisesForSelectedDayTypes = useMemo(
    () =>
      selectedProgramDayTypes.reduce(
        (acc, dayType) =>
          acc.union(EXERCISES_FOR_DAY_TYPE.get(dayType, ImmutableSet())),
        ImmutableSet() as ImmutableSet<ExerciseType>,
      ),
    [selectedProgramDayTypes],
  );

  const availableExercises: ImmutableSet<ExerciseType> = useMemo(() => {
    if (!selectedEquipment) {
      return exercisesForSelectedDayTypes;
    }
    const baseExercises: ImmutableSet<ExerciseType> =
      EXERCISES_BY_EQUIPMENT.get(selectedEquipment, ImmutableSet());
    return baseExercises.intersect(exercisesForSelectedDayTypes);
  }, [selectedEquipment, exercisesForSelectedDayTypes]);

  const handleExerciseChange = useCallback(
    (newExercise: ExerciseType | null) => {
      setExercise((_) => newExercise);
      setSelectedEquipment((_) =>
        newExercise ? equipmentForExercise(newExercise) : null,
      );
    },
    [setExercise],
  );

  const handleEquipmentChange = useCallback(
    (newEquipment: EquipmentType | null) => {
      setSelectedEquipment((_) => newEquipment);
      setExercise((_) =>
        newEquipment
          ? (EXERCISES_BY_EQUIPMENT.get(newEquipment)?.first() ?? null)
          : null,
      );
    },
    [setExercise],
  );

  const onChipClick = useCallback((dayType: ProgramDayType) => {
    setSelectedProgramDayTypes((old) =>
      old.has(dayType) ? old.remove(dayType) : old.add(dayType),
    );
  }, []);

  const selectAllProgramDayTypes = useCallback(() => {
    setSelectedProgramDayTypes(
      ImmutableSet(Constants.public.Enums.program_day_types_enum),
    );
  }, []);

  const selectAllDisabled = useMemo(() => {
    return (
      selectedProgramDayTypes.size ===
      Constants.public.Enums.program_day_types_enum.length
    );
  }, [selectedProgramDayTypes]);

  return {
    selectAllDisabled,
    selectAllProgramDayTypes,
    onChipClick,
    selectedProgramDayTypes,
    handleExerciseChange,
    availableExercises,
    selectedEquipment,
    handleEquipmentChange,
    availableEquipment: EQUIPMENT_TYPES,
  };
};
