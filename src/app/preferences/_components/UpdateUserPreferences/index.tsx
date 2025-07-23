"use client";

import { updateUserPreferences } from "@/app/preferences/_components/UpdateUserPreferences/actions";
import { UserPreferences, WeightUnit } from "@/common-types";
import SelectAvailableDumbbells from "@/components/select/SelectAvailableDumbbells";
import SelectPlates from "@/components/select/SelectPlates";
import SelectWeightUnit from "@/components/select/SelectWeightUnit";
import { DEFAULT_VALUES } from "@/constants";
import { useRequiredModifiableLabel } from "@/hooks";
import { TestIds } from "@/test-ids";
import { userPreferenceUIString } from "@/uiStrings";
import { nullableArrayEquals } from "@/util";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";

type UpdateUserPreferencesProps = {
  userId: string;
  preferences: UserPreferences;
};

const useUserPreferencesModified = (
  preferred_weight_unit: WeightUnit,
  default_rest_time: number | null,
  available_plates_lbs: number[] | null,
  available_dumbbells_lbs: number[] | null,
  localPreferredWeightUnit: WeightUnit,
  localDefaultRestTime: string,
  localAvailablePlatesLbs: number[],
  localAvailableDumbbellsLbs: number[],
) => {
  const unitModified = React.useMemo(() => {
    return localPreferredWeightUnit !== preferred_weight_unit;
  }, [localPreferredWeightUnit, preferred_weight_unit]);

  const restTimeModified = React.useMemo(() => {
    return localDefaultRestTime !== (default_rest_time?.toString() ?? "");
  }, [localDefaultRestTime, default_rest_time]);

  const platesLBSModified = React.useMemo(() => {
    return !nullableArrayEquals(localAvailablePlatesLbs, available_plates_lbs);
  }, [localAvailablePlatesLbs, available_plates_lbs]);

  const dumbbellsLBSModified = React.useMemo(() => {
    if (!available_dumbbells_lbs) return true;
    const a = (available_dumbbells_lbs || []).slice().sort((a, b) => a - b);
    const b = (localAvailableDumbbellsLbs || []).slice().sort((a, b) => a - b);
    if (a.length !== b.length) return true;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return true;
    }
    return false;
  }, [localAvailableDumbbellsLbs, available_dumbbells_lbs]);

  const preferencesModified = React.useMemo(() => {
    return (
      unitModified ||
      restTimeModified ||
      platesLBSModified ||
      dumbbellsLBSModified
    );
  }, [unitModified, restTimeModified, platesLBSModified, dumbbellsLBSModified]);

  return {
    unitModified,
    restTimeModified,
    platesLBSModified,
    dumbbellsLBSModified,
    preferencesModified,
  };
};

const useRequiredPreferences = (
  localPreferredWeightUnit: WeightUnit,
  localDefaultRestTime: string,
  localAvailablePlatesLbs: number[],
  localAvailableDumbbellsLbs: number[],
) => {
  const params = useSearchParams();
  const backTo = params.get("backTo");
  const requiredPreferences = useMemo(() => {
    const reqPrefString = params.get("requiredPreferences");
    return reqPrefString?.split(",") as (keyof UserPreferences)[] | null;
  }, [params]);

  const requiredPreferencesSet = useMemo(() => {
    if (!requiredPreferences) {
      return true;
    }

    return requiredPreferences.every((prefKey) => {
      switch (prefKey) {
        case "preferred_weight_unit":
          return !!localPreferredWeightUnit;
        case "default_rest_time":
          return !!localDefaultRestTime && !isNaN(Number(localDefaultRestTime));
        case "available_plates_lbs":
          return localAvailablePlatesLbs && localAvailablePlatesLbs.length > 0;
        case "available_dumbbells_lbs":
          return (
            localAvailableDumbbellsLbs && localAvailableDumbbellsLbs.length > 0
          );
        default:
          return true;
      }
    });
  }, [
    requiredPreferences,
    localPreferredWeightUnit,
    localDefaultRestTime,
    localAvailablePlatesLbs,
    localAvailableDumbbellsLbs,
  ]);

  const requiredPreferencesMessage = useMemo(() => {
    if (!requiredPreferences || requiredPreferences.length === 0) {
      return null;
    }
    const friendlyNames = requiredPreferences.map(userPreferenceUIString);
    return `Please set the following required preferences to continue: ${friendlyNames.join(", ")}`;
  }, [requiredPreferences]);

  return {
    backTo,
    requiredPreferences,
    requiredPreferencesSet,
    requiredPreferencesMessage,
  };
};

const useUpdateUserPreferencesAPI = (props: UpdateUserPreferencesProps) => {
  const {
    preferences: {
      preferred_weight_unit,
      default_rest_time,
      available_plates_lbs,
      available_dumbbells_lbs,
    },
  } = props;

  const [localPreferredWeightUnit, setLocalPreferredWeightUnit] = useState(
    preferred_weight_unit || DEFAULT_VALUES.PREFERRED_WEIGHT_UNIT,
  );
  const [localDefaultRestTime, setLocalDefaultRestTime] = useState(
    default_rest_time?.toString() ??
      DEFAULT_VALUES.REST_TIME_SECONDS.toString(),
  );

  const [localAvailablePlatesLbs, setLocalAvailablePlatesLbs] = useState<
    number[]
  >(available_plates_lbs ?? DEFAULT_VALUES.SELECTED_PLATES);

  const [localAvailableDumbbellsLbs, setLocalAvailableDumbbellsLbs] = useState<
    number[]
  >(available_dumbbells_lbs ?? DEFAULT_VALUES.AVAILABLE_DUMBBELLS_LBS);

  // Use the new modification-tracking hook
  const modifications = useUserPreferencesModified(
    preferred_weight_unit ?? "pounds",
    default_rest_time,
    available_plates_lbs,
    available_dumbbells_lbs,
    localPreferredWeightUnit,
    localDefaultRestTime,
    localAvailablePlatesLbs,
    localAvailableDumbbellsLbs,
  );

  const {
    backTo,
    requiredPreferences,
    requiredPreferencesSet,
    requiredPreferencesMessage,
  } = useRequiredPreferences(
    localPreferredWeightUnit,
    localDefaultRestTime,
    localAvailablePlatesLbs,
    localAvailableDumbbellsLbs,
  );

  const canSave = useMemo(() => {
    return modifications.preferencesModified && requiredPreferencesSet;
  }, [modifications.preferencesModified, requiredPreferencesSet]);

  // TODO: create a useModifidableLabel hook to handle this logic.
  const restTimeLabel = useRequiredModifiableLabel(
    "Rest Time (seconds)",
    !!requiredPreferences?.includes("default_rest_time"),
    modifications.restTimeModified,
  );

  const handleWeightUnitChange = useCallback((unit: WeightUnit) => {
    setLocalPreferredWeightUnit(unit);
  }, []);

  const handleRestTimeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLocalDefaultRestTime(event.target.value);
    },
    [],
  );

  const handleAvailablePlatesChange = useCallback((plates: number[]) => {
    setLocalAvailablePlatesLbs(plates);
  }, []);

  const handleAvailableDumbbellsChange = React.useCallback(
    (dumbbells: number[]) => {
      setLocalAvailableDumbbellsLbs(dumbbells);
    },
    [],
  );

  return {
    preferredWeightUnit: localPreferredWeightUnit,
    defaultRestTime: localDefaultRestTime,
    availablePlatesLbs: localAvailablePlatesLbs,
    availableDumbbellsLbs: localAvailableDumbbellsLbs,
    backTo,
    requiredPreferences,
    requiredPreferencesSet,
    canSave,
    restTimeLabel,
    requiredPreferencesMessage,
    handleWeightUnitChange,
    handleRestTimeChange,
    handleAvailablePlatesChange,
    handleAvailableDumbbellsChange,
    ...modifications,
  };
};

export const UpdateUserPreferences: React.FC<UpdateUserPreferencesProps> = (
  props,
) => {
  const api = useUpdateUserPreferencesAPI(props);

  return (
    <form
      action={updateUserPreferences.bind(
        null,
        props.userId,
        api.preferredWeightUnit,
        api.defaultRestTime,
        api.availablePlatesLbs,
        api.availableDumbbellsLbs,
        api.backTo,
      )}
      data-testid="update-user-preferences-form"
    >
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
          <Typography variant="caption" color="text.secondary">
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
          <Typography variant="caption" color="text.secondary">
            The rest time that will be used to indicate when you&apos;re ready
            for the next set.
            <br />
            (In the future, this will be able to be set per-exercise.)
          </Typography>
        </Stack>
        <Stack spacing={1}>
          <SelectPlates
            modified={api.platesLBSModified}
            // Intentionally hard-coded. When we want to support kg, we'll add
            // an additional control similiar to this one.
            unit="pounds"
            availablePlates={DEFAULT_VALUES.AVAILABLE_PLATES_LBS}
            initialSelectedPlates={api.availablePlatesLbs}
            onSelectedPlatesChange={api.handleAvailablePlatesChange}
          />
          <Typography variant="caption" color="text.secondary">
            The plates that are available in your gym. i.e. Some gyms have 55s,
            or 100s, and some folks bother with small change plates.
            {api.requiredPreferences?.includes("available_plates_lbs") && (
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
        <Stack spacing={1}>
          <SelectAvailableDumbbells
            modified={api.dumbbellsLBSModified}
            initiallyAvailableDumbbells={DEFAULT_VALUES.AVAILABLE_DUMBBELLS_LBS}
            initiallySelectedDumbbells={api.availableDumbbellsLbs}
            unit={api.preferredWeightUnit}
            onSelectedDumbbellsChange={api.handleAvailableDumbbellsChange}
          />
          <Typography variant="caption" color="text.secondary">
            The dumbbells that are available in your gym. Some gyms have 100s,
            some only go up to 50, and some have odd increments.
            {/* TODO: Add required indicator and per-gym note when supported */}
            <br />
            (In the future you will be able to set preferences per gym.)
          </Typography>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
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
            data-testid={TestIds.Preferences_SavePreferencesButton}
            disabled={!api.canSave}
          >
            Save
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default UpdateUserPreferences;
