// get_wendler_programs

import { RequiredNonNullable } from "@/common-types";
import { Database } from "@/database.types";

// Friendly type names. the Ls are "local"
type LWendlerProgramsResult =
  Database["public"]["Functions"]["get_wendler_programs"]["Returns"];
type LWendlerPrograms = NonNullable<LWendlerProgramsResult["programs"]>;
type LWendlerProgram = LWendlerPrograms[number];
type LWendlerCycles = NonNullable<LWendlerProgram["cycles"]>;
type LWendlerCycle = LWendlerCycles[number];
type LWendlerMovements = NonNullable<LWendlerCycle["movements"]>;
type LWendlerMovement = LWendlerMovements[number];

// Narrowing down. LRNN = Local Required Non-Nullable
type LRNNWendlerMovement = RequiredNonNullable<
  LWendlerMovement,
  | "id"
  | "exercise_type"
  | "equipment_type"
  | "weight_unit"
  | "training_max_value"
  | "increase_amount_value"
  | "heaviest_weight_value"
  | "block_id"
>;

type LRNNWendlerCycle = RequiredNonNullable<
  Omit<LWendlerCycle, "movements"> & {
    movements: LRNNWendlerMovement[];
  },
  "id" | "cycle_type"
>;

type LRNNProgram = RequiredNonNullable<
  Omit<LWendlerProgram, "cycles"> & {
    cycles: LRNNWendlerCycle[];
  },
  "id" | "name" | "user_id"
>;

export type ProgramOverview = LRNNProgram;
export type ProgramOverviews = ProgramOverview[];

export type GetWendlerProgramsResult = RequiredNonNullable<
  Omit<LWendlerProgramsResult, "programs"> & {
    programs: ProgramOverviews;
  },
  "page_count"
>;
