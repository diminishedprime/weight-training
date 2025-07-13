"use client";

import React, { useCallback, useState, useMemo } from "react";
import { Stack, TextField, Button, Typography } from "@mui/material";
import { updateUserPreferences } from "@/app/preferences/_components/UpdateUserPreferences/actions";
import { UserPreferences, WeightUnit } from "@/common-types";
import SelectPlates from "@/components/select/SelectPlates";
import { AVAILABLE_PLATES, COMMON_AVAILABLE_PLATES } from "@/constants";
import SelectWeightUnit from "@/components/select/SelectWeightUnit";
import { nullableArrayEquals } from "@/util";
import { useSearchParams } from "next/navigation";
import { userPreferenceUIString } from "@/uiStrings";

type UpdateUserPreferencesProps = {
  userId: string;
  preferences: UserPreferences;
};

const useUpdateUserPreferencesAPI = (props: UpdateUserPreferencesProps) => {
  const {
    preferences: { preferred_weight_unit, default_rest_time, available_plates },
  } = props;

  const params = useSearchParams();
  const backTo = params.get("backTo");
  const requiredPreferences = useMemo(() => {
    const reqPrefString = params.get("requiredPreferences");
    return reqPrefString?.split(",") as (keyof UserPreferences)[] | null;
  }, [params]);

  const [localPreferredWeightUnit, setLocalPreferredWeightUnit] = useState(
    preferred_weight_unit || ("pounds" as WeightUnit)
  );
  const [localDefaultRestTime, setLocalDefaultRestTime] = useState(
    default_rest_time?.toString() ?? "120"
  );
  const [localAvailablePlates, setLocalAvailablePlates] = useState<number[]>(
    available_plates || COMMON_AVAILABLE_PLATES
  );

  const unitModified = React.useMemo(() => {
    return localPreferredWeightUnit !== preferred_weight_unit;
  }, [localPreferredWeightUnit, preferred_weight_unit]);

  const restTimeModified = React.useMemo(() => {
    return localDefaultRestTime !== default_rest_time?.toString();
  }, [localDefaultRestTime, default_rest_time]);

  const availablePlatesModified = React.useMemo(() => {
    return !nullableArrayEquals(localAvailablePlates, available_plates);
  }, [localAvailablePlates, available_plates]);

  const preferencesModified = React.useMemo(() => {
    return unitModified || restTimeModified || availablePlatesModified;
  }, [unitModified, restTimeModified, availablePlatesModified]);

  // Check if all required preferences are set
  const requiredPreferencesSet = useMemo(() => {
    if (!requiredPreferences) return true;

    return requiredPreferences.every((prefKey) => {
      switch (prefKey) {
        case "preferred_weight_unit":
          return !!localPreferredWeightUnit;
        case "default_rest_time":
          return !!localDefaultRestTime && !isNaN(Number(localDefaultRestTime));
        case "available_plates":
          return localAvailablePlates && localAvailablePlates.length > 0;
        default:
          return true;
      }
    });
  }, [
    requiredPreferences,
    localPreferredWeightUnit,
    localDefaultRestTime,
    localAvailablePlates,
  ]);

  const canSave = useMemo(() => {
    return preferencesModified && requiredPreferencesSet;
  }, [preferencesModified, requiredPreferencesSet]);

  const restTimeLabel = React.useMemo(() => {
    const isRequired = requiredPreferences?.includes("default_rest_time");
    const requiredIndicator = isRequired ? " *" : "";
    const modifiedIndicator = restTimeModified ? " (modified)" : "";
    return `Rest Time (seconds)${requiredIndicator}${modifiedIndicator}`;
  }, [restTimeModified, requiredPreferences]);

  const requiredPreferencesMessage = useMemo(() => {
    if (!requiredPreferences || requiredPreferences.length === 0) {
      return null;
    }
    const friendlyNames = requiredPreferences.map(userPreferenceUIString);
    return `Please set the following required preferences to continue: ${friendlyNames.join(", ")}`;
  }, [requiredPreferences]);

  const handleWeightUnitChange = useCallback((unit: WeightUnit) => {
    setLocalPreferredWeightUnit(unit);
  }, []);

  const handleRestTimeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLocalDefaultRestTime(event.target.value);
    },
    []
  );

  const handleAvailablePlatesChange = useCallback((plates: number[]) => {
    setLocalAvailablePlates(plates);
  }, []);

  return {
    preferredWeightUnit: localPreferredWeightUnit,
    defaultRestTime: localDefaultRestTime,
    availablePlates: localAvailablePlates,
    unitModified,
    restTimeModified,
    availablePlatesModified,
    preferencesModified,
    requiredPreferencesSet,
    canSave,
    restTimeLabel,
    requiredPreferencesMessage,
    backTo,
    requiredPreferences,
    handleWeightUnitChange,
    handleRestTimeChange,
    handleAvailablePlatesChange,
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
        api.availablePlates,
        api.backTo
      )}
      data-testid="update-user-preferences-form">
      <Typography variant="h6" sx={{ mb: 2 }}>
        Update Preferences
      </Typography>
      {api.requiredPreferencesMessage && (
        <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
          {api.requiredPreferencesMessage}
        </Typography>
      )}
      <Stack spacing={2}>
        <Stack spacing={1}>
          <SelectWeightUnit
            modified={api.unitModified}
            weightUnit={api.preferredWeightUnit}
            onWeightUnitChange={api.handleWeightUnitChange}
          />
          <Typography variant="body2" color="text.secondary">
            The default weight unit that will be used for all exercises.
            {api.requiredPreferences?.includes("preferred_weight_unit") && (
              <strong> * Required</strong>
            )}
            <br />
            (Don&apos;t change this to kilograms yet because the app is not
            really ready for that lol)
          </Typography>
        </Stack>
        <Stack spacing={1}>
          <TextField
            label={api.restTimeLabel}
            name="default_rest_time"
            value={api.defaultRestTime}
            onChange={api.handleRestTimeChange}
            size="small"
            fullWidth
            required={api.requiredPreferences?.includes("default_rest_time")}
          />
          <Typography variant="body2" color="text.secondary">
            The rest time that will be used to indicate when you&apos;re ready
            for the next set.
            <br />
            (In the future, this will be able to be set per-exercise.)
          </Typography>
        </Stack>
        <Stack spacing={1}>
          <SelectPlates
            modified={api.availablePlatesModified}
            availablePlates={AVAILABLE_PLATES}
            selectedPlates={api.availablePlates}
            onSelectedPlatesChange={api.handleAvailablePlatesChange}
          />
          <Typography variant="body2" color="text.secondary">
            The plates that are available in your gym. i.e. Some gyms have 55s,
            or 100s, and some folks bother with small change plates.
            {api.requiredPreferences?.includes("available_plates") && (
              <strong> * Required</strong>
            )}
            <br />
            (In the future you will be able to set preferences per gym.)
            <br />
            (Also in the future, you can set the number of available plates
            which can help with weight calculations if you need to like double
            up on 35s to meet a given weight.)
          </Typography>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center">
          <span>
            {api.preferencesModified && (
              <Typography variant="caption" color="text.secondary">
                <strong>* indicates modified values</strong>
              </Typography>
            )}
            {!api.requiredPreferencesSet && api.requiredPreferences && (
              <Typography variant="caption" color="error">
                <strong>Required preferences must be set</strong>
              </Typography>
            )}
          </span>
          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={!api.canSave}>
            Save
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default UpdateUserPreferences;
