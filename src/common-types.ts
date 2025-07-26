import { Database } from "@/database.types";

export type ExerciseType = Database["public"]["Enums"]["exercise_type_enum"];

export type CompletionStatus =
  Database["public"]["Enums"]["completion_status_enum"];
export type WeightUnit = Database["public"]["Enums"]["weight_unit_enum"];
export type EquipmentType = Database["public"]["Enums"]["equipment_type_enum"];
export type PerceivedEffort =
  Database["public"]["Enums"]["perceived_effort_enum"];
export type WendlerCycleType =
  Database["public"]["Enums"]["wendler_cycle_type_enum"];

export type ExercisesByTypeResult =
  Database["public"]["Functions"]["get_exercises_by_type"]["Returns"];

export type ExercisesByTypeResultRows = ExercisesByTypeResult["rows"];

export type ExerciseForUser =
  Database["public"]["Functions"]["get_exercise"]["Returns"];

export type GetExerciseResult = RequiredNonNullable<
  ExerciseForUser,
  | "exercise_id"
  | "target_weight_value"
  | "weight_unit"
  | "completion_status"
  | "reps"
  | "equipment_type"
  | "exercise_type"
  | "is_warmup"
  | "is_amrap"
>;

export type WendlerBlockPrereqs =
  Database["public"]["Functions"]["check_wendler_block_prereqs"]["Returns"];
export type WendlerMaxesData =
  Database["public"]["Functions"]["get_wendler_maxes"]["Returns"];
export type WendlerBlock =
  Database["public"]["Functions"]["get_wendler_block"]["Returns"];
export type WendlerMetadata =
  Database["public"]["Functions"]["get_wendler_metadata"]["Returns"];

export type UserPreferences =
  Database["public"]["Functions"]["get_user_preferences"]["Returns"];

export type PersonalRecordExerciseTypes =
  Database["public"]["Functions"]["get_personal_record_exercise_types"]["Returns"];

export type PersonalRecordHistory =
  Database["public"]["Functions"]["get_personal_records_for_exercise_type"]["Returns"];

export type ExerciseBlocks =
  Database["public"]["Functions"]["get_exercise_blocks"]["Returns"]["blocks"];

export type ExerciseBlock = NonNullable<ExerciseBlocks>[number];

export enum RoundingMode {
  UP = "UP",
  DOWN = "DOWN",
  NEAREST = "NEAREST",
}

// Utility type that makes specified keys required and non-nullable
export type RequiredNonNullable<T, K extends keyof T> = T & {
  [P in K]-?: NonNullable<T[P]>;
};
