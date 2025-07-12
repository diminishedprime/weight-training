"use client";

/**
 * Test IDs for use in data-testid attributes throughout the app.
 * Use these to avoid accidental collisions and to keep test selectors consistent.
 */
export const TestIds = {
  AddExerciseButton: "add-exercise-button",
  AddBarbellLiftButton: "add-barbell-exercise",
  AddExerciseCancelButton: "add-exercise-cancel-button",
  AddBarbellResetButton: "add-barbell-reset-button",
  // ExercisesTable test IDs
  exercisesTableShowNoDateCheckbox: "exercises-table-show-no-date-checkbox",
  exercisesTableShowNoDateLabel: "exercises-table-show-no-date-label",
  exercisesTableNoDateSection: "exercises-table-no-date-section",
  exercisesTableDateSection: "exercises-table-date-section",
  exercisesTableDateHeader: "exercises-table-date-header",
  exercisesTableRow: "exercises-table-row",
  exercisesTableEditButton: "exercises-table-edit-button",
  exercisesTableNotesRow: "exercises-table-notes-row",
  addWendlerLegDayButton: "add-wendler-leg-day-button",
  // Add more test IDs here as needed
} as const;
