"use client";

import React from "react";
import { Stack, Typography, Divider } from "@mui/material";
import { Constants, type Database } from "@/database.types";
import { exerciseTypeUIStringBrief } from "@/uiStrings";
import { equipmentForExercise } from "@/util";
import { Set } from "immutable";
import Fuse from "fuse.js";
import FuzzySearchField from "@/app/preferences/_components/FuzzySearchField";
import EquipmentChipFilters from "@/app/preferences/_components/EquipmentChipFilters";
import SetExercisePreferences from "@/app/preferences/_components/SetExercisePreferences";

/**
 * Types for improved readability.
 */
type UserPreferencesRow =
  Database["public"]["Functions"]["get_user_preferences"]["Returns"];
type EquipmentType = Database["public"]["Enums"]["equipment_type_enum"];

/**
 * Hook for managing PreferencesClient logic and state.
 * Provides all state, event handlers, and derived data for the PreferencesClient UI.
 * @param userPreferencesRows - Array of user preference rows from the database.
 * @returns PreferencesAPI object for use in the component.
 */
const usePreferencesAPI = (userPreferencesRows: UserPreferencesRow) => {
  const allEquipmentTypes = Constants.public.Enums
    .equipment_type_enum as never as EquipmentType[];
  const [selectedEquipment, setSelectedEquipment] = React.useState(
    Set(allEquipmentTypes)
  );
  const [search, setSearchState] = React.useState("");

  // setSearch now matches the expected signature for FuzzySearchField
  const setSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchState(event.target.value);
    },
    []
  );

  // clearSearch resets the search state
  const clearSearch = React.useCallback(() => {
    setSearchState("");
  }, []);

  const filteredRows = React.useMemo(() => {
    if (selectedEquipment.size === 0) return [];
    const filtered = userPreferencesRows.filter((row) =>
      selectedEquipment.has(equipmentForExercise(row.exercise_type!))
    );
    if (search.trim()) {
      const fuse = new Fuse(filtered, {
        keys: [
          "exercise_type",
          {
            name: "exercise_type_ui_string",
            getFn: (row) => exerciseTypeUIStringBrief(row.exercise_type!),
          },
        ],
        threshold: 0.1,
      });
      return fuse.search(search).map((result) => result.item);
    }
    return filtered;
  }, [selectedEquipment, userPreferencesRows, search]);

  return {
    allEquipmentTypes,
    selectedEquipment,
    setSelectedEquipment, // now matches React setter signature
    search,
    setSearch,
    clearSearch,
    filteredRows,
  };
};

/**
 * Props for PreferencesClient component.
 * @property userPreferencesRows - Array of user preference rows from the database.
 */
interface PreferencesClientProps {
  userPreferencesRows: UserPreferencesRow;
}

/**
 * Client-side preferences page UI for managing user exercise preferences.
 * @param props - PreferencesClientProps
 */
const PreferencesClient: React.FC<PreferencesClientProps> = (props) => {
  const api = usePreferencesAPI(props.userPreferencesRows);

  return (
    <Stack spacing={1}>
      <Typography variant="h4" component="h1">
        User Preferences
      </Typography>
      <Divider />
      <Typography variant="h5" component="h2">
        Exercise Preferences
      </Typography>
      <Stack spacing={1}>
        <FuzzySearchField
          value={api.search}
          onChange={api.setSearch}
          onClear={api.clearSearch}
        />
        <EquipmentChipFilters
          allEquipmentTypes={api.allEquipmentTypes}
          selectedEquipment={api.selectedEquipment}
          setSelectedEquipment={api.setSelectedEquipment}
        />
        <Stack data-testid="exercise-preferences-list">
          {api.filteredRows.map((row) => (
            <SetExercisePreferences
              key={row.exercise_type as string}
              {...row}
              exercise_type={row.exercise_type!}
              default_rest_time_seconds={row.default_rest_time_seconds!}
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default PreferencesClient;
