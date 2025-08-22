"use client";

import Notifications from "@/app/preferences/_components/Notifications";
import RequiredPreferences from "@/app/preferences/_components/RequiredPreferences";
import RestTime from "@/app/preferences/_components/RestTime";
import SelectDumbbells from "@/app/preferences/_components/SelectDumbbells";
import SelectKettlebells from "@/app/preferences/_components/SelectKettlebells";
import SelectPlates from "@/app/preferences/_components/SelectPlates";
import SelectWeightUnit from "@/app/preferences/_components/SelectWeightUnit";
import Theme from "@/app/preferences/_components/Theme";
import { afterUpdateAction } from "@/app/preferences/_components/actions";
import usePreferenceValue from "@/app/preferences/_components/usePreferenceValue";
import { MyThemeOptions, UserPreferences } from "@/common-types";
import { DEFAULT_VALUES, SearchParam } from "@/constants";
import { Json } from "@/database.types";
import { useRPCMutation } from "@/hooks";
import { TestIds } from "@/test/test-ids";
import { Button, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";

type Props = {
  userId: string;
  preferences: UserPreferences;
};

export const PreferencesClient: React.FC<Props> = (props) => {
  const api = useUpdateUserPreferencesAPI(props);

  return (
    <React.Fragment>
      <Typography variant="h6">Update Preferences</Typography>
      <RequiredPreferences
        requiredPreferences={api.requiredPreferences}
        selectedPlatesApi={api.selectedPlates}
        preferredWeightUnitApi={api.weightUnit}
        defaultRestTimeApi={api.defaultRest}
        selectedDumbbellsApi={api.selectedDumbbells}
        selectedKettlebellsApi={api.selectedKettlebells}
      />
      <Theme api={api.themeOptions} />
      <SelectWeightUnit api={api.weightUnit} />
      <RestTime api={api.defaultRest} />
      <SelectPlates api={api.selectedPlates} />
      <SelectDumbbells api={api.selectedDumbbells} />
      <SelectKettlebells api={api.selectedKettlebells} />
      <Notifications
        tokenApi={api.pushoverToken}
        userKeyApi={api.pushoverUserKey}
      />
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        {api.preferencesModified && (
          <Typography variant="caption" color="text.secondary">
            <strong>* indicates modified values</strong>
          </Typography>
        )}
        {!api.missingRequiredPreference && api.requiredPreferences && (
          <Typography variant="caption" color="error">
            <strong>Required preferences must be set</strong>
          </Typography>
        )}
      </Stack>
      <Stack
        direction="row"
        justifyContent={api.backTo ? "space-between" : "flex-end"}
      >
        {api.backTo && (
          <Button
            LinkComponent={Link}
            href={api.backTo}
            color="warning"
            data-testid={TestIds.Preferences_CancelButton}
            disabled={api.cancelDisabled}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="contained"
          size="small"
          data-testid={TestIds.Preferences_SavePreferencesButton}
          onClick={api.savePreferences}
          disabled={!api.canSave}
        >
          Save
        </Button>
      </Stack>
    </React.Fragment>
  );
};

export default PreferencesClient;

const useUpdateUserPreferencesAPI = (props: Props) => {
  const { userId, preferences: hydratedPreferences } = props;
  const [preferences, setPreferences] =
    useState<UserPreferences>(hydratedPreferences);

  const params = useSearchParams();
  const requiredPreferences = useMemo(
    () =>
      (params.get("requiredPreferences")?.split(",") ||
        []) as (keyof UserPreferences)[],
    [params],
  );

  const cancelDisabled = useMemo(() => {
    return requiredPreferences === null;
  }, [requiredPreferences]);

  const backTo = useMemo(() => params.get(SearchParam.BackTo), [params]);

  const defaultRest = usePreferenceValue(
    "Default Rest Time",
    preferences?.default_rest_time ?? DEFAULT_VALUES.REST_TIME_SECONDS,
    preferences?.default_rest_time,
    false,
  );

  const weightUnit = usePreferenceValue(
    "Preferred Weight Unit",
    preferences?.preferred_weight_unit || DEFAULT_VALUES.PREFERRED_WEIGHT_UNIT,
    preferences?.preferred_weight_unit,
    false,
  );

  const selectedPlates = usePreferenceValue(
    "Available Plates (LBS)",
    preferences?.available_plates_lbs ?? DEFAULT_VALUES.SELECTED_PLATES,
    preferences?.available_plates_lbs,
    false,
  );

  const selectedDumbbells = usePreferenceValue(
    "Available Dumbbells (LBS)",
    preferences?.available_dumbbells_lbs ?? DEFAULT_VALUES.COMMON_DUMBBELLS_LBS,
    preferences?.available_dumbbells_lbs,
    false,
  );

  const selectedKettlebells = usePreferenceValue(
    "Available Kettlebells (LBS)",
    preferences?.available_kettlebells_lbs ??
      DEFAULT_VALUES.AVAILABLE_KETTLEBELLS_LBS,
    preferences?.available_kettlebells_lbs,
    false,
  );

  const themeOptions = usePreferenceValue(
    "Theme",
    (preferences?.theme_options ?? {}) as MyThemeOptions,
    preferences?.theme_options as MyThemeOptions,
    false,
  );

  const pushoverToken = usePreferenceValue(
    "Application API Token",
    preferences?.pushover_api_token ?? "",
    preferences?.pushover_api_token ?? "",
    false,
  );

  const pushoverUserKey = usePreferenceValue(
    "User Key",
    preferences?.pushover_user_key ?? "",
    preferences?.pushover_user_key ?? "",
    false,
  );

  const preferencesModified = useMemo(
    () =>
      [
        defaultRest.modified,
        weightUnit.modified,
        selectedPlates.modified,
        selectedDumbbells.modified,
        selectedKettlebells.modified,
        themeOptions.modified,
        pushoverToken.modified,
        pushoverUserKey.modified,
      ].some((a) => a),
    [
      defaultRest.modified,
      weightUnit.modified,
      selectedPlates.modified,
      selectedDumbbells.modified,
      selectedKettlebells.modified,
      themeOptions.modified,
      pushoverToken.modified,
      pushoverUserKey.modified,
    ],
  );

  const missingRequiredPreference = useMemo(
    () =>
      [
        defaultRest.required,
        weightUnit.required,
        selectedPlates.required,
        selectedDumbbells.required,
        selectedKettlebells.required,
        themeOptions.required,
        pushoverToken.required,
        pushoverUserKey.required,
      ].some((a) => a),
    [
      defaultRest.required,
      weightUnit.required,
      selectedPlates.required,
      selectedDumbbells.required,
      selectedKettlebells.required,
      themeOptions.required,
      pushoverToken.required,
      pushoverUserKey.required,
    ],
  );

  const canSave = useMemo(() => {
    return preferencesModified && !missingRequiredPreference;
  }, [preferencesModified, missingRequiredPreference]);

  const afterServerAction = useCallback(async () => {
    afterUpdateAction(backTo);
  }, [backTo]);

  const { trigger: setServerUserPreferences, isMutating } = useRPCMutation(
    "set_user_preferences",
    useCallback((e) => `Error calling set user preferences: ${e}`, []),
    afterServerAction,
    setPreferences,
  );

  const savePreferences = useCallback(async () => {
    const parsedRestTime = isNaN(Number(defaultRest.value))
      ? DEFAULT_VALUES.REST_TIME_SECONDS
      : Number(defaultRest.value);
    await setServerUserPreferences({
      p_user_id: userId,
      p_available_dumbbells_lbs: selectedDumbbells.value || [],
      p_available_kettlebells_lbs: selectedKettlebells.value || [],
      p_available_plates_lbs: selectedPlates.value || [],
      p_default_rest_time: parsedRestTime,
      p_preferred_weight_unit:
        weightUnit.value || DEFAULT_VALUES.PREFERRED_WEIGHT_UNIT,
      p_theme_options: (themeOptions.value || {}) as Json,
      p_pushover_api_token: pushoverToken.value ?? undefined,
      p_pushover_user_key: pushoverUserKey.value ?? undefined,
    });
  }, [
    userId,
    setServerUserPreferences,
    defaultRest.value,
    weightUnit.value,
    selectedPlates.value,
    selectedDumbbells.value,
    selectedKettlebells.value,
    themeOptions.value,
    pushoverToken.value,
    pushoverUserKey.value,
  ]);

  return {
    backTo,
    requiredPreferences,
    selectedPlates,
    defaultRest,
    weightUnit,
    selectedKettlebells,
    selectedDumbbells,
    themeOptions,
    pushoverToken,
    pushoverUserKey,
    preferencesModified,
    missingRequiredPreference,
    cancelDisabled,
    canSave,
    pending: isMutating,
    savePreferences,
  };
};
