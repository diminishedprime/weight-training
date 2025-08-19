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
import { DEFAULT_VALUES } from "@/constants";
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
        selectedPlatesApi={api.selectedPlatesApi}
        preferredWeightUnitApi={api.preferredWeightUnitApi}
        defaultRestTimeApi={api.defaultRestTimeApi}
        selectedDumbbellsApi={api.selectedDumbbellsApi}
        selectedKettlebellsApi={api.selectedKettlebellsApi}
      />
      <Theme api={api.themeOptionsApi} />
      <SelectWeightUnit api={api.preferredWeightUnitApi} />
      <RestTime api={api.defaultRestTimeApi} />
      <SelectPlates api={api.selectedPlatesApi} />
      <SelectDumbbells api={api.selectedDumbbellsApi} />
      <SelectKettlebells api={api.selectedKettlebellsApi} />
      <Notifications
        tokenApi={api.pushoverTokenApi}
        userKeyApi={api.pushoverUserKeyApi}
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

  const backTo = useMemo(() => params.get("backTo"), [params]);

  const defaultRestTimeApi = usePreferenceValue(
    "Default Rest Time",
    preferences?.default_rest_time ?? DEFAULT_VALUES.REST_TIME_SECONDS,
    preferences?.default_rest_time,
    false,
  );

  const preferredWeightUnitApi = usePreferenceValue(
    "Preferred Weight Unit",
    preferences?.preferred_weight_unit || DEFAULT_VALUES.PREFERRED_WEIGHT_UNIT,
    preferences?.preferred_weight_unit,
    false,
  );

  const selectedPlatesApi = usePreferenceValue(
    "Available Plates (LBS)",
    preferences?.available_plates_lbs ?? DEFAULT_VALUES.SELECTED_PLATES,
    preferences?.available_plates_lbs,
    false,
  );

  const selectedDumbbellsApi = usePreferenceValue(
    "Available Dumbbells (LBS)",
    preferences?.available_dumbbells_lbs ?? DEFAULT_VALUES.COMMON_DUMBBELLS_LBS,
    preferences?.available_dumbbells_lbs,
    false,
  );

  const selectedKettlebellsApi = usePreferenceValue(
    "Available Kettlebells (LBS)",
    preferences?.available_kettlebells_lbs ??
      DEFAULT_VALUES.AVAILABLE_KETTLEBELLS_LBS,
    preferences?.available_kettlebells_lbs,
    false,
  );

  const themeOptionsApi = usePreferenceValue(
    "Theme",
    (preferences?.theme_options ?? {}) as MyThemeOptions,
    preferences?.theme_options as MyThemeOptions,
    false,
  );

  const pushoverTokenApi = usePreferenceValue(
    "Application API Token",
    preferences?.pushover_api_token ?? "",
    preferences?.pushover_api_token ?? "",
    false,
  );

  const pushoverUserKeyApi = usePreferenceValue(
    "User Key",
    preferences?.pushover_user_key ?? "",
    preferences?.pushover_user_key ?? "",
    false,
  );

  const [
    {
      modified: restTimeModified,
      required: restTimeRequired,
      value: restTimeValue,
    },
    {
      modified: weightUnitModified,
      required: weightUnitRequired,
      value: weightUnitValue,
    },
    { modified: platesModified, required: platesRequired, value: platesValue },
    {
      modified: dumbbellsModified,
      required: dumbbellsRequired,
      value: dumbbellsValue,
    },
    {
      modified: kettlebellsModified,
      required: kettlebellsRequired,
      value: kettlebellsValue,
    },
    {
      modified: themeOptionsModified,
      required: themeOptionsRequired,
      value: themeOptionsValue,
    },
    {
      modified: pushoverTokenModified,
      required: pushoverTokenRequired,
      value: pushoverTokenValue,
    },
    {
      modified: pushoverUserKeyModified,
      required: pushoverUserKeyRequired,
      value: pushoverUserKeyValue,
    },
  ] = [
    defaultRestTimeApi,
    preferredWeightUnitApi,
    selectedPlatesApi,
    selectedDumbbellsApi,
    selectedKettlebellsApi,
    themeOptionsApi,
    pushoverTokenApi,
    pushoverUserKeyApi,
  ];

  const preferencesModified = useMemo(
    () =>
      [
        restTimeModified,
        weightUnitModified,
        platesModified,
        dumbbellsModified,
        kettlebellsModified,
        themeOptionsModified,
        pushoverTokenModified,
        pushoverUserKeyModified,
      ].some((a) => a),
    [
      restTimeModified,
      weightUnitModified,
      platesModified,
      dumbbellsModified,
      kettlebellsModified,
      themeOptionsModified,
      pushoverTokenModified,
      pushoverUserKeyModified,
    ],
  );

  const missingRequiredPreference = useMemo(
    () =>
      [
        restTimeRequired,
        weightUnitRequired,
        platesRequired,
        dumbbellsRequired,
        kettlebellsRequired,
        themeOptionsRequired,
        pushoverTokenRequired,
        pushoverUserKeyRequired,
      ].some((a) => a),
    [
      restTimeRequired,
      weightUnitRequired,
      platesRequired,
      dumbbellsRequired,
      kettlebellsRequired,
      themeOptionsRequired,
      pushoverTokenRequired,
      pushoverUserKeyRequired,
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
    const parsedRestTime = isNaN(Number(restTimeValue))
      ? DEFAULT_VALUES.REST_TIME_SECONDS
      : Number(restTimeValue);
    await setServerUserPreferences({
      p_user_id: userId,
      p_available_dumbbells_lbs: dumbbellsValue || [],
      p_available_kettlebells_lbs: kettlebellsValue || [],
      p_available_plates_lbs: platesValue || [],
      p_default_rest_time: parsedRestTime,
      p_preferred_weight_unit:
        weightUnitValue || DEFAULT_VALUES.PREFERRED_WEIGHT_UNIT,
      p_theme_options: (themeOptionsValue || {}) as Json,
      p_pushover_api_token: pushoverTokenValue ?? undefined,
      p_pushover_user_key: pushoverUserKeyValue ?? undefined,
    });
  }, [
    restTimeValue,
    userId,
    dumbbellsValue,
    kettlebellsValue,
    platesValue,
    weightUnitValue,
    themeOptionsValue,
    pushoverTokenValue,
    pushoverUserKeyValue,
    setServerUserPreferences,
  ]);

  return {
    backTo,
    requiredPreferences,
    selectedPlatesApi,
    defaultRestTimeApi,
    preferredWeightUnitApi,
    selectedKettlebellsApi,
    selectedDumbbellsApi,
    themeOptionsApi,
    pushoverTokenApi,
    pushoverUserKeyApi,
    preferencesModified,
    missingRequiredPreference,
    cancelDisabled,
    canSave,
    pending: isMutating,
    savePreferences,
  };
};
