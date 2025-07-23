"use client";

import { PerceivedEffort } from "@/common-types";

/**
 * Test IDs for use in data-testid attributes throughout the app.
 * Use these to avoid accidental collisions and to keep test selectors consistent.
 */
export const TestIds = {
  AddExerciseButton: "add-exercise-button",
  AddBarbellLiftButton: "add-barbell-exercise",
  AddDumbbellLiftButton: "add-dumbbell-exercise",
  AddExerciseCancelButton: "add-exercise-cancel-button",
  AddBarbellResetButton: "add-barbell-reset-button",
  ActivePlate: (plate: number) => `active-plate-${plate}`,
  FirstBarbellRow: "add-barbell-first-row",
  // ExercisesTable test IDs
  addWendlerLegDayButton: "add-wendler-leg-day-button",
  // PreferencesPage test IDs
  Preferences_SavePreferencesButton: "save-user-preferences-button",
  SelectRepsAMRAPToggle: "select-reps-amrap-toggle",
  SelectRepsAdd: "select-reps-add-1",
  PerceivedEffort: (effort: PerceivedEffort) => `perceived-effort-${effort}`,
  WarmupToggle: "warmup-toggle",
  NotesInput: "notes-input",
} as const;
