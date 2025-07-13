import { Database } from "@/database.types";

export type ExerciseType = Database["public"]["Enums"]["exercise_type_enum"];
export type CompletionStatus =
  Database["public"]["Enums"]["completion_status_enum"];
export type WeightUnit = Database["public"]["Enums"]["weight_unit_enum"];
export type EquipmentType = Database["public"]["Enums"]["equipment_type_enum"];
export type PercievedEffort =
  Database["public"]["Enums"]["relative_effort_enum"];
export type WendlerCycleType =
  Database["public"]["Enums"]["wendler_cycle_type_enum"];

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
