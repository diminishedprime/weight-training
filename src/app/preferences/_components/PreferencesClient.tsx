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
  Collapse,
  IconButton,
  Chip,
  InputAdornment,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Constants, type Database } from "@/database.types";
import { exerciseTypeUIStringBrief } from "@/uiStrings";
import SetExerciseWeights from "./SetExerciseWeights/SetExerciseWeights";
import { getExercisesByEquipment } from "@/util";

// Use the generated type for the get_user_preferences function result
// This is typically Database["public"]["Functions"]["get_user_preferences"]['Returns'][number]
type UserPreferencesRow =
  Database["public"]["Functions"]["get_user_preferences"]["Returns"][number];

interface PreferencesClientProps {
  userId: string;
  userPreferencesRows: UserPreferencesRow[];
}

const PreferencesClient: React.FC<PreferencesClientProps> = (props) => {
  const { userId, userPreferencesRows } = props;

  // General preferences from the first row (invariant: always exists)
  const generalPreferences = {
    preferredWeightUnit: userPreferencesRows[0].preferred_weight_unit,
    defaultRestTimeSeconds: userPreferencesRows[0].default_rest_time_seconds,
  };

  // Map exercise weights for display
  const exerciseWeights: Record<
    string,
    { oneRepMax?: number; targetMax?: number }
  > = {};
  for (const row of userPreferencesRows) {
    if (row.exercise_type) {
      exerciseWeights[row.exercise_type] = {
        oneRepMax: row.one_rep_max_value ?? undefined,
        targetMax: row.target_max_value ?? undefined,
      };
    }
  }

  // Equipment filter chips and search state
  const equipmentGroups = getExercisesByEquipment();
  const allEquipmentTypes = Object.keys(equipmentGroups);
  const [selectedEquipment, setSelectedEquipment] =
    React.useState<string[]>(allEquipmentTypes);
  const [search, setSearch] = React.useState("");

  // All exercise types
  const allExerciseTypes = React.useMemo(
    () =>
      Object.values(
        Constants.public.Enums.exercise_type_enum
      ) as Database["public"]["Enums"]["exercise_type_enum"][],
    []
  );

  // Filter by equipment
  const filteredByEquipment = React.useMemo(() => {
    if (selectedEquipment.length === 0) return [];
    return allExerciseTypes.filter((ex) => {
      return allEquipmentTypes.some(
        (eq) =>
          selectedEquipment.includes(eq) &&
          equipmentGroups[eq as keyof typeof equipmentGroups].includes(ex)
      );
    });
  }, [selectedEquipment, allExerciseTypes, allEquipmentTypes, equipmentGroups]);

  // Filter by search (enum or friendly name)
  const filtered = React.useMemo(() => {
    if (!search.trim()) return filteredByEquipment;
    const lower = search.toLowerCase();
    return filteredByEquipment.filter(
      (ex: Database["public"]["Enums"]["exercise_type_enum"]) =>
        ex.toLowerCase().includes(lower) ||
        exerciseTypeUIStringBrief(ex).toLowerCase().includes(lower)
    );
  }, [filteredByEquipment, search]);

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

            <TextField
              label="Default Rest Time (seconds)"
              type="number"
              value={generalPreferences.defaultRestTimeSeconds}
              fullWidth
              // read-only
            />
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
            don't do a true 1 rep max day that ofen, your target max will start
            to get closer to your highest 1 rep max. That is okay, just use that
            as a guide for when you're ready to have another 1 rep max day.
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <TextField
              label="Search exercise"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ minWidth: 200 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">🔍</InputAdornment>
                ),
              }}
            />
            {allEquipmentTypes.map((eq) => (
              <Chip
                key={eq}
                label={eq.charAt(0).toUpperCase() + eq.slice(1)}
                color={selectedEquipment.includes(eq) ? "primary" : "default"}
                onClick={() => {
                  setSelectedEquipment((prev) =>
                    prev.includes(eq)
                      ? prev.filter((e) => e !== eq)
                      : [...prev, eq]
                  );
                }}
                variant={selectedEquipment.includes(eq) ? "filled" : "outlined"}
              />
            ))}
          </Stack>
          <Stack spacing={3}>
            {filtered.map(
              (
                exerciseType: Database["public"]["Enums"]["exercise_type_enum"]
              ) => {
                const weights = exerciseWeights[exerciseType];
                return (
                  <SetExerciseWeights
                    key={exerciseType}
                    exerciseType={exerciseType}
                    oneRepMax={weights?.oneRepMax}
                    targetMax={weights?.targetMax}
                    weightUnit={generalPreferences.preferredWeightUnit}
                  />
                );
              }
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default PreferencesClient;
