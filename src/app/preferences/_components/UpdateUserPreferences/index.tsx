"use client";

import React, { useCallback, useState } from "react";
import { Stack, TextField, Button, Typography } from "@mui/material";
import { updateUserPreferences } from "@/app/preferences/_components/UpdateUserPreferences/actions";
import { UserPreferences, WeightUnit } from "@/common-types";

type UpdateUserPreferencesProps = {
  userId: string;
  preferences: UserPreferences;
};

// TODO - don't feel like it right now, but I think I have a component that
//        handles available plates already in one of the settings dialog things.
const useUpdateUserPreferencesAPI = (props: UpdateUserPreferencesProps) => {
  const [preferredWeightUnit, setPreferredWeightUnit] = useState(
    props.preferences.preferred_weight_unit || ("lbs" as WeightUnit)
  );
  const [defaultRestTime, setDefaultRestTime] = useState(
    props.preferences.default_rest_time || 120
  );
  // const [availablePlates, setAvailablePlates] = useState<number[] | null>(
  //   props.preferences.available_plates
  // );

  const handleWeightUnitChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPreferredWeightUnit(event.target.value as WeightUnit);
    },
    []
  );

  const handleRestTimeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setDefaultRestTime(Number(event.target.value));
    },
    []
  );

  // const handlePlatesChange = useCallback(
  //   (event: React.ChangeEvent<HTMLInputElement>) => {
  //     setAvailablePlates(event.target.value);
  //   },
  //   []
  // );

  return {
    preferredWeightUnit,
    defaultRestTime,
    // availablePlates,
    handleWeightUnitChange,
    handleRestTimeChange,
    // handlePlatesChange,
  };
};

export const UpdateUserPreferences: React.FC<UpdateUserPreferencesProps> = (
  props
) => {
  const api = useUpdateUserPreferencesAPI(props);
  return (
    <form
      action={updateUserPreferences.bind(
        null,
        props.userId,
        api.preferredWeightUnit,
        api.defaultRestTime,
        [] // TODO - fix this later
      )}
      style={{ maxWidth: 400 }}
      data-testid="update-user-preferences-form">
      <Stack spacing={2}>
        <Typography variant="h6">Update Preferences</Typography>
        <TextField
          label="Default Rest Time (seconds)"
          name="default_rest_time"
          type="number"
          value={api.defaultRestTime}
          onChange={api.handleRestTimeChange}
          fullWidth
        />
        <Button type="submit" variant="contained">
          Save Preferences
        </Button>
      </Stack>
    </form>
  );
};

export default UpdateUserPreferences;
