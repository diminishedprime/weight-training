import { Database } from "@/database.types";
import { RequiredNonNullable } from ".";

// Friendly type names.
type LGetAddProgramInfo =
  Database["public"]["Functions"]["get_add_program_info"]["Returns"];

// Narrowing down. RNN = Required Non-Nullable

export type GetAddProgramInfoResult = RequiredNonNullable<
  LGetAddProgramInfo,
  | "user_id"
  | "bench_press_target_max"
  | "squat_target_max"
  | "deadlift_target_max"
  | "overhead_press_target_max"
  | "program_name"
>;
