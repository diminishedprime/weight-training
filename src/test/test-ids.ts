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
  // TODO: these should match the naming in paths, where I actually thought
  // about instead of just kinda going with whatever.
  SelectExercise_Autocomplete: "select-exercise-autocomplete",
  SelectExercise_Option: (index: number) => `select-exercise-option-${index}`,
  /// superblocks/[superblock_id]/edit
  Superblocks_SuperblockId_Edit_AddBlock:
    "superblocks-superblock-id-edit-add-block",
  Superblocks_SuperblockId_Edit_Block: (index: number) =>
    `superblocks-superblock-id-edit-block-${index}`,
  Superblocks_SuperblockId_Edit_AddBlock_Sets:
    "superblocks-superblock-id-edit-add-block-sets",
  Superblocks_SuperblockId_Edit_AddBlock_Reps:
    "superblocks-superblock-id-edit-add-block-reps",
  // superblocks/[superblock_id]/perform
  Superblocks_SuperblockId_Perform__FinishExercise:
    "superblocks-superblock-id-perform-finish-exercise",
  Superblocks_SuperblockId_Perform__FailExercise:
    "superblocks-superblock-id-perform-fail-exercise",
  Superblocks_SuperblockId_Perform__SkipExercise:
    "superblocks-superblock-id-perform-skip-exercise",
  Superblocks_SuperblockId_Perform__ActiveExerciseRow: `superblocks-superblock-id-perform-active-exercise-row`,
  Superblocks_SuperblockId_Perform__CompletedExerciseRow: (idx: number) =>
    `superblocks-superblock-id-perform-completed-exercise-row-${idx}`,
  Superblocks_SuperblockId_Perform__NotStartedExerciseRow: (idx: number) =>
    `superblocks-superblock-id-perform-not-started-exercise-row-${idx}`,
  Superblocks_SuperblockId_Perform__Block: (name: string) =>
    `superblocks-superblock-id-perform-block-${name}`,
  // Misc components
  CompletionStatusCompleted: "completion-status-success",
  CompletionStatusFailed: "completion-status-error",
  CompletionStatusSkipped: "completion-status-skipped",
  CompletionStatusNotStarted: "completion-status-not-started",
  CompletionStatusInProgress: "completion-status-in-progress",
  SelectNumberChoice: (number: number) => `select-number-choice-${number}`,
} as const;
