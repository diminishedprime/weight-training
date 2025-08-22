import { RequiredNonNullable } from "@/common-types";
import { Database } from "@/database.types";

// Friendly type names.
type LWendlerProgram =
  Database["public"]["Functions"]["get_wendler_program"]["Returns"];
type LWendlerCycles = NonNullable<LWendlerProgram["cycles"]>;
type LWendlerCycle = LWendlerCycles[number];
type LWendlerMovements = NonNullable<LWendlerCycle["movements"]>;
type LWendlerMovement = LWendlerMovements[number];

// Narrowing down. RNN = Required Non-Nullable

export type ProgramMovement = RequiredNonNullable<
  LWendlerMovement,
  | "id"
  | "exercise_type"
  | "equipment_type"
  | "weight_unit"
  | "training_max_value"
  | "increase_amount_value"
  | "block_id"
  | "exercise_type"
  | "heaviest_weight_value"
  | "completion_status"
>;

export type ProgramCycle = RequiredNonNullable<
  Omit<LWendlerCycle, "movements"> & {
    movements: ProgramMovement[];
  },
  "id" | "cycle_type" | "completion_status"
>;

export type ProgramCycles = ProgramCycle[];

export type Program = RequiredNonNullable<
  Omit<LWendlerProgram, "cycles"> & {
    cycles: ProgramCycles;
  },
  "id" | "name" | "user_id" | "completion_status"
>;

export type GetWendlerProgramResult = Program;
