"use client";

import { CompletionStatus, PerceivedEffort } from "@/common-types";

/**
 * Test IDs for use in data-testid attributes throughout the app.
 * Use these to avoid accidental collisions and to keep test selectors consistent.
 */
export const TestIds = {
  AddExerciseButton: "add-exercise-button",
  AddEquipmentExerciseButton: "add-equipment-exercise-button",
  AddExerciseCancelButton: "add-exercise-cancel-button",
  AddBarbellResetButton: "add-barbell-reset-button",
  RepsUpButton: "rep-up-button",
  RepsDownButton: "rep-down-button",
  FirstBarbellRow: "add-barbell-first-row",
  // ExercisesTable test IDs
  addWendlerLegDayButton: "add-wendler-leg-day-button",
  // PreferencesPage test IDs
  Preferences_SavePreferencesButton: "save-user-preferences-button",
  SelectRepsAMRAPToggle: "select-reps-amrap-toggle",
  KettlebellPlus: "kettlebell-plus",
  IsWarmupToggle: "is-warmup-toggle",
  NotesInput: "notes-input",
  Preferences_CancelButton: "cancel-user-preferences-button",
  // Add more test IDs here as needed
  EditEquipmentCancelButton: "edit-equipment-cancel-button",
  EditEquipmentResetButton: "edit-equipment-reset-button",
  EditEquipmentSaveButton: "edit-equipment-save-button",
  EditDumbbellBumpDownButton: "edit-dumbbell-bump-down-button",
  ClearActivePlatesButton: "clear-active-plates-button",
  ActivePlate: (plate: number) => `active-plate-${plate}`,
  PerceivedEffort: (effort: PerceivedEffort) => `perceived-effort-${effort}`,
  CompletionStatus: (completionStatus: CompletionStatus) =>
    `completion-status-${completionStatus}`,
  EditWeightAdd: (weight: number) => `edit-weight-add-${weight}`,
  EditWeightSubtract: (weight: number) => `edit-weight-subtract-${weight}`,
  EditWeightInput: "edit-weight-input",
  EditWeightClearButton: "edit-weight-clear-button",
  Programs_Add_ProgramNameInput: "programs-add-program-name-input",
  Programs_Add_AddProgram: "programs-add-add-program",
} as const;
