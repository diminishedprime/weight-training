"use client";

import React from "react";
import { Stack, Typography, Divider } from "@mui/material";
import { Constants, type Database } from "@/database.types";
import { exerciseTypeUIStringBrief } from "@/uiStrings";
import SetExercisePreferences from "./SetExerciseWeights/SetExercisePreferences";
import { equipmentForExercise } from "@/util";
import { Set } from "immutable";
import Fuse from "fuse.js";
import FuzzySearchField from "@/app/preferences/_components/FuzzySearchField";
import EquipmentChipFilters from "@/app/preferences/_components/EquipmentChipFilters";

interface PreferencesClientProps {
  userPreferencesRows: Database["public"]["Functions"]["get_user_preferences"]["Returns"];
}

const usePreferencesAPI = (
  userPreferencesRows: Database["public"]["Functions"]["get_user_preferences"]["Returns"]
) => {
  const allEquipmentTypes = Constants.public.Enums
    .equipment_type_enum as never as Database["public"]["Enums"]["equipment_type_enum"][];
  const [selectedEquipment, setSelectedEquipment] = React.useState(
    Set(allEquipmentTypes)
  );
  const [search, setSearch] = React.useState("");

  const filteredRows = React.useMemo(() => {
    if (selectedEquipment.size === 0) return [];
    let filtered = userPreferencesRows.filter((row) =>
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
    setSelectedEquipment,
    search,
    setSearch,
    filteredRows,
  };
};

const PreferencesClient: React.FC<PreferencesClientProps> = (props) => {
  const api = usePreferencesAPI(props.userPreferencesRows);

  return (
    <Stack spacing={3} sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      <Typography variant="h4" component="h1">
        User Preferences
      </Typography>
      <Divider />
      <Typography variant="h5" gutterBottom>
        Exercise Preferences
      </Typography>
      <Stack spacing={3}>
        <FuzzySearchField
          value={api.search}
          onChange={api.setSearch}
          onClear={() => api.setSearch("")}
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
