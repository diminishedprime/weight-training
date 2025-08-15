"use client";
import { ExerciseType, ProgramDayType } from "@/common-types";
import DisplayEquipmentThumbnail from "@/components/display/DisplayEquipmentThumbnail";
import { EXERCISE_TYPES, EXERCISES_FOR_DAY_TYPE } from "@/constants";
import { Constants } from "@/database.types";
import { TestIds } from "@/test-ids";
import { exerciseTypeUIStringBrief, programDayTypeUIString } from "@/uiStrings";
import { equipmentForExercise } from "@/util";
import ResetIcon from "@mui/icons-material/RestartAlt";
import {
  Autocomplete,
  Box,
  Chip,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Set as ImmutableSet } from "immutable";
import React, { useCallback, useMemo, useState } from "react";

export interface SelectExerciseProps {
  exercise: ExerciseType | null;
  setExercise: React.Dispatch<React.SetStateAction<ExerciseType | null>>;
}

const SelectExercise: React.FC<SelectExerciseProps> = (props) => {
  const api = useSelectExerciseAPI(props);

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
          color="primary"
          variant="outlined"
          onClick={api.selectAllProgramDayTypes}
        />
        <Chip
          sx={{ ml: 1 }}
          label="None"
          color="error"
          variant="outlined"
          onClick={api.selectNoneProgramDayTypes}
        />
      </Stack>
      <Stack spacing={1} direction="row" useFlexGap>
        <Autocomplete
          fullWidth
          size="small"
          options={api.availableExercises.toArray()}
          value={props.exercise}
          onChange={(_, newValue) => props.setExercise((_) => newValue)}
          getOptionKey={(option) => option}
          getOptionLabel={(option) => exerciseTypeUIStringBrief(option)}
          disablePortal={true}
          renderOption={(props, option, { index }) => {
            const { key, ...rest } = props;
            return (
              <Box
                key={key}
                {...rest}
                component="li"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
                data-testid={TestIds.SelectExercise_Option(index)}
              >
                <DisplayEquipmentThumbnail
                  size={20}
                  equipmentType={equipmentForExercise(option)}
                />
                <Typography>{exerciseTypeUIStringBrief(option)}</Typography>
              </Box>
            );
          }}
          blurOnSelect={true}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Exercise"
              variant="outlined"
              data-testid={TestIds.SelectExercise_Autocomplete}
            />
          )}
        />
        <IconButton onClick={() => props.setExercise(null)}>
          <ResetIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
};

export default SelectExercise;

const useSelectExerciseAPI = (_props: SelectExerciseProps) => {
  const [selectedProgramDayTypes, setSelectedProgramDayTypes] =
    useState<ImmutableSet<ProgramDayType>>(ImmutableSet());

  const exercisesForSelectedDayTypes = useMemo(() => {
    if (selectedProgramDayTypes.isEmpty()) {
      return EXERCISE_TYPES;
    }
    return selectedProgramDayTypes.reduce(
      (acc, dayType) =>
        acc.union(EXERCISES_FOR_DAY_TYPE.get(dayType, ImmutableSet())),
      ImmutableSet() as ImmutableSet<ExerciseType>,
    );
  }, [selectedProgramDayTypes]);

  const availableExercises: ImmutableSet<ExerciseType> = useMemo(() => {
    return EXERCISE_TYPES.intersect(exercisesForSelectedDayTypes);
  }, [exercisesForSelectedDayTypes]);

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

  const selectNoneProgramDayTypes = useCallback(() => {
    setSelectedProgramDayTypes(ImmutableSet());
  }, []);

  return {
    selectNoneProgramDayTypes,
    selectAllProgramDayTypes,
    onChipClick,
    selectedProgramDayTypes,
    availableExercises,
  };
};
