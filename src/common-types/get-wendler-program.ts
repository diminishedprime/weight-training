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

type LRNNWendlerMovement = RequiredNonNullable<
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

export type GetWendlerProgramResult = LRNNProgram;
