import { RequiredNonNullable } from "@/common-types";
import { Database } from "@/database.types";

// Friendly type names.
type DatabaseHydrateEquipmentRestTimes =
  Database["public"]["Functions"]["hydrate_rest_times"]["Returns"];

type DatabaseEquipmentRestTime = RequiredNonNullable<
  NonNullable<
    NonNullable<DatabaseHydrateEquipmentRestTimes>["equipment_rest_times"]
  >[number],
  "equipment_type" | "rest_time"
>;

export type DatabaseExerciseRestTime = RequiredNonNullable<
  NonNullable<
    NonNullable<DatabaseHydrateEquipmentRestTimes>["exercise_rest_times"]
  >[number],
  "exercise_type" | "rest_time"
>;

export type HydrateRestTimes = RequiredNonNullable<
  Omit<
    DatabaseHydrateEquipmentRestTimes,
    "equipment_rest_times" | "exercise_rest_times"
  > & {
    equipment_rest_times: DatabaseEquipmentRestTime[] | null;
    exercise_rest_times: DatabaseExerciseRestTime[] | null;
  },
  "user_id" | "user_preferences_id"
>;
