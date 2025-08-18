import { PreferenceValueAPI } from "@/app/preferences/_components/usePreferenceValue";
import { UserPreferences, WeightUnit } from "@/common-types";
import { userPreferenceUIString } from "@/uiStrings";
import { Typography } from "@mui/material";
import { useEffect, useMemo } from "react";

interface Props {
  requiredPreferences: (keyof UserPreferences)[];
  preferredWeightUnitApi: PreferenceValueAPI<WeightUnit | null>;
  defaultRestTimeApi: PreferenceValueAPI<number>;
  selectedDumbbellsApi: PreferenceValueAPI<number[]>;
  selectedKettlebellsApi: PreferenceValueAPI<number[]>;
  selectedPlatesApi: PreferenceValueAPI<number[]>;
}

const RequiredPreferences: React.FC<Props> = (props) => {
  const api = useRequiredPreferencesAPI(props);

  if (api.requiredPreferencesMessage) {
    return (
      <Typography variant="body2" color="primary" sx={{ mb: 1 }}>
        {api.requiredPreferencesMessage}
      </Typography>
    );
  }
  return null;
};

export default RequiredPreferences;

const useRequiredPreferencesAPI = (props: Props) => {
  const {
    preferredWeightUnitApi: {
      value: preferredWeightUnit,
      setRequired: setPreferredWeightUnitRequired,
    },
    defaultRestTimeApi: {
      value: defaultRestTime,
      setRequired: setDefaultRestTimeRequired,
    },
    selectedPlatesApi: {
      value: availablePlatesLbs,
      setRequired: setSelectedPlatesRequired,
    },
    selectedDumbbellsApi: {
      value: availableDumbbellsLbs,
      setRequired: setAvailableDumbbellsLbsRequired,
    },
    selectedKettlebellsApi: {
      value: selectedKettlebells,
      setRequired: setSelectedKettlebellsRequired,
    },
    requiredPreferences,
  } = props;

  // Weight Unit
  const weightUnitInvalid = useMemo(
    () =>
      requiredPreferences?.includes("preferred_weight_unit")
        ? preferredWeightUnit === null
        : false,
    [requiredPreferences, preferredWeightUnit],
  );

  useEffect(() => {
    setPreferredWeightUnitRequired(weightUnitInvalid);
  }, [setPreferredWeightUnitRequired, weightUnitInvalid]);

  // Default Rest Time
  const defaultRestTimeInvalid = useMemo(
    () =>
      requiredPreferences?.includes("default_rest_time")
        ? defaultRestTime === null
        : false,
    [requiredPreferences, defaultRestTime],
  );

  useEffect(() => {
    setDefaultRestTimeRequired(defaultRestTimeInvalid);
  }, [setDefaultRestTimeRequired, defaultRestTimeInvalid]);

  // Available Plates
  const availablePlatesLbsInvalid = useMemo(
    () =>
      requiredPreferences?.includes("available_plates_lbs")
        ? availablePlatesLbs === null || availablePlatesLbs.length < 1
        : false,
    [requiredPreferences, availablePlatesLbs],
  );

  useEffect(() => {
    setSelectedPlatesRequired(availablePlatesLbsInvalid);
  }, [setSelectedPlatesRequired, availablePlatesLbsInvalid]);

  // Available Dumbbells
  const availableDumbbellsLbsInvalid = useMemo(
    () =>
      requiredPreferences?.includes("available_dumbbells_lbs")
        ? availableDumbbellsLbs === null || availableDumbbellsLbs.length < 1
        : false,
    [requiredPreferences, availableDumbbellsLbs],
  );

  useEffect(() => {
    setAvailableDumbbellsLbsRequired(availableDumbbellsLbsInvalid);
  }, [setAvailableDumbbellsLbsRequired, availableDumbbellsLbsInvalid]);

  // Available Kettlebells
  const kettlebellsLbsInvalid = useMemo(
    () =>
      requiredPreferences?.includes("available_kettlebells_lbs")
        ? selectedKettlebells === null || selectedKettlebells.length < 1
        : false,
    [requiredPreferences, selectedKettlebells],
  );

  useEffect(() => {
    setSelectedKettlebellsRequired(kettlebellsLbsInvalid);
  }, [setSelectedKettlebellsRequired, kettlebellsLbsInvalid]);

  const missingAnyPreference = useMemo(
    () =>
      [
        weightUnitInvalid,
        defaultRestTimeInvalid,
        availablePlatesLbsInvalid,
        availableDumbbellsLbsInvalid,
        kettlebellsLbsInvalid,
      ].some((a) => a),
    [
      weightUnitInvalid,
      defaultRestTimeInvalid,
      availablePlatesLbsInvalid,
      availableDumbbellsLbsInvalid,
      kettlebellsLbsInvalid,
    ],
  );

  const requiredPreferencesMessage = useMemo(() => {
    return missingAnyPreference
      ? `Please set the following required preferences to continue: ${requiredPreferences.map(userPreferenceUIString).join(", ")}`
      : null;
  }, [requiredPreferences, missingAnyPreference]);

  return {
    requiredPreferences,
    requiredPreferencesSet: missingAnyPreference,
    requiredPreferencesMessage,
    kettlebellsLBSRequired: kettlebellsLbsInvalid,
    availablePlatesLbsRequired: availablePlatesLbsInvalid,
  };
};
