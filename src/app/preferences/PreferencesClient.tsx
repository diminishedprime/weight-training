// This file has been moved to _components/PreferencesClient.tsx. Please update your imports accordingly.

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
  Button,
  Divider,
  Alert,
} from "@mui/material";
import { Constants, type Database } from "@/database.types";
import { exerciseTypeUIStringBrief } from "@/uiStrings";

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
            typically 85-90% of your 1RM.
          </Typography>

          <Stack spacing={3}>
            {Constants.public.Enums.exercise_type_enum.map((exerciseType) => {
              const weights = exerciseWeights[exerciseType];
              return (
                <Card key={exerciseType} variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {exerciseTypeUIStringBrief(exerciseType)}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={2}
                      useFlexGap
                      flexWrap="wrap">
                      <TextField
                        label="1 Rep Max"
                        type="number"
                        value={weights?.oneRepMax || ""}
                        sx={{ minWidth: 150 }}
                        slotProps={{
                          input: {
                            endAdornment:
                              generalPreferences.preferredWeightUnit,
                          },
                        }}
                        // read-only
                      />
                      <TextField
                        label="Target Max"
                        type="number"
                        value={weights?.targetMax || ""}
                        sx={{ minWidth: 150 }}
                        slotProps={{
                          input: {
                            endAdornment:
                              generalPreferences.preferredWeightUnit,
                          },
                        }}
                        // read-only
                      />
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default PreferencesClient;
