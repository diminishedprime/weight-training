import { Database } from "@/database.types";

export type ExerciseType = Database["public"]["Enums"]["exercise_type_enum"];
export type CompletionStatus =
  Database["public"]["Enums"]["completion_status_enum"];
export type WeightUnit = Database["public"]["Enums"]["weight_unit_enum"];
export type EquipmentType = Database["public"]["Enums"]["equipment_type_enum"];
export type RelativeEffort =
  Database["public"]["Enums"]["relative_effort_enum"];
export type WendlerCycleType =
  Database["public"]["Enums"]["wendler_cycle_type_enum"];
