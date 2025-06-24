"use client";

import React from "react";
import {
  Stack,
  Typography,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Chip,
  InputAdornment,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Constants, type Database } from "@/database.types";
import { exerciseTypeUIStringBrief, equipmentTypeUIString } from "@/uiStrings";
import SetExercisePreferences from "./SetExerciseWeights/SetExercisePreferences";
import { getExercisesByEquipment } from "@/util";

// Use the generated type for the get_user_preferences function result
// This is typically Database["public"]["Functions"]["get_user_preferences"]['Returns'][number]
type UserPreferencesRow =
  Database["public"]["Functions"]["get_user_preferences"]["Returns"][number];

interface PreferencesClientProps {
  userPreferencesRows: Database["public"]["Functions"]["get_user_preferences"]["Returns"];
}

const PreferencesClient: React.FC<PreferencesClientProps> = (props) => {
  const { userPreferencesRows } = props;

  // General preferences from the first row (invariant: always exists)
  const generalPreferences = {
    preferredWeightUnit:
      userPreferencesRows[0]?.preferred_weight_unit ?? "pounds",
  };

  // Equipment filter chips and search state
  const equipmentGroups = getExercisesByEquipment();
  const allEquipmentTypes = Object.keys(equipmentGroups);
  const [selectedEquipment, setSelectedEquipment] =
    React.useState<string[]>(allEquipmentTypes);
  const [search, setSearch] = React.useState("");

  // All exercise types
  const allExerciseTypes = React.useMemo(
    () => Constants.public.Enums.exercise_type_enum,
    []
  );

  // Filter userPreferencesRows by selected equipment and search
  const filteredRows = React.useMemo(() => {
    if (selectedEquipment.length === 0) return [];
    const lower = search.toLowerCase();
    return userPreferencesRows.filter((row) => {
      const eq = Object.entries(equipmentGroups).find(([, exercises]) =>
        (exercises as string[]).includes(row.exercise_type!)
      )?.[0];
      const matchesEquipment = eq && selectedEquipment.includes(eq);
      const matchesSearch =
        !search.trim() ||
        row.exercise_type!.toLowerCase().includes(lower) ||
        exerciseTypeUIStringBrief(row.exercise_type!)
          .toLowerCase()
          .includes(lower);
      return matchesEquipment && matchesSearch;
    });
  }, [selectedEquipment, userPreferencesRows, equipmentGroups, search]);

  return (
    <Stack spacing={3} sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      <Typography variant="h4" component="h1">
        User Preferences
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            General Preferences
          </Typography>
          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel>Preferred Weight Unit</InputLabel>
              <Select<Database["public"]["Enums"]["weight_unit_enum"]>
                value={generalPreferences.preferredWeightUnit}
                label="Preferred Weight Unit"
                // read-only
              >
                <MenuItem value="pounds">Pounds</MenuItem>
                <MenuItem value="kilograms">Kilograms</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </CardContent>
      </Card>

      <Divider />

      {/* Exercise Weights */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Exercise Maxes
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Set your 1 rep max and target max for each exercise. Target max is
            typically 85-90% of your 1RM. For the way this app works, you should
            only ever set your 1 rep max to a value you have actually lifted.
            This value will get updated automatically as you log workouts, so
            you should not need to update it often. The target max, on the other
            hand, is used by a lot of training plans to determine what weight
            you should be doing and is necessarily reflective of a weight you
            have actually lifted. For example, with the 5/3/1 program, you
            typically set your target max to 90% of your 1 rep max, and then
            calculate your weight for exercises to do off of that. Since you
            don&apos;t do a true 1 rep max day that ofen, your target max will
            start to get closer to your highest 1 rep max. That is okay, just
            use that as a guide for when you&apos;re ready to have another 1 rep
            max day.
          </Typography>
          <Stack spacing={3}>
            <TextField
              label="Search exercise"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ minWidth: 200 }}
              InputProps={{
                endAdornment: search ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      aria-label="Clear search"
                      onClick={() => setSearch("")}
                      edge="end">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
            <Stack
              direction="row"
              useFlexGap
              flexWrap="wrap"
              spacing={1}
              alignItems="center"
              sx={{ mt: 1 }}>
              {allEquipmentTypes.map((eq) => (
                <Chip
                  key={eq}
                  label={equipmentTypeUIString(
                    eq as Database["public"]["Enums"]["equipment_type_enum"]
                  )}
                  color={selectedEquipment.includes(eq) ? "primary" : "default"}
                  onClick={() => {
                    setSelectedEquipment((prev) =>
                      prev.includes(eq)
                        ? prev.filter((e) => e !== eq)
                        : [...prev, eq]
                    );
                  }}
                  variant={
                    selectedEquipment.includes(eq) ? "filled" : "outlined"
                  }
                />
              ))}
              <Chip
                label="Clear Filters"
                color="error"
                onClick={() => setSelectedEquipment([])}
                variant="outlined"
                sx={{ ml: 1 }}
              />
            </Stack>
            {filteredRows.map((row) => (
              <SetExercisePreferences
                key={row.exercise_type as string}
                {...row}
                exercise_type={row.exercise_type!}
                default_rest_time_seconds={row.default_rest_time_seconds!}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default PreferencesClient;
