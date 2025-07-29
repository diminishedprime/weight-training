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

export type UserPreferences =
  Database["public"]["Functions"]["get_user_preferences"]["Returns"];

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

export type SuperblocksRow = NonNullable<
  Database["public"]["Functions"]["get_superblocks"]["Returns"]["superblocks"]
>[number];

type Superblock = NonNullable<
  Database["public"]["Functions"]["get_superblock"]["Returns"]
>;
type SuperblockBlocks = NonNullable<Superblock["blocks"]>;
type SuperblockBlocksRow = SuperblockBlocks[number];
type SuperblocksBlocksRowExercisesRow = NonNullable<
  SuperblockBlocksRow["exercises"]
>[number];
type SuperblocksWendlerDetailsRow = NonNullable<
  SuperblockBlocksRow["wendler_details"]
>;

export type NarrowedSuperblock = RequiredNonNullable<
  Omit<Superblock, "blocks"> & {
    blocks: RequiredNonNullable<
      Omit<SuperblockBlocksRow, "exercises" | "wendler_details"> & {
        wendler_details: RequiredNonNullable<
          SuperblocksWendlerDetailsRow,
          | "movement_id"
          | "cycle_type"
          | "training_max_value"
          | "weight_unit"
          | "exercise_type"
          | "increase_amount_value"
          | "wendler_program_id"
        > | null;
        exercises: RequiredNonNullable<
          SuperblocksBlocksRowExercisesRow,
          | "id"
          | "exercise_type"
          | "equipment_type"
          | "target_weight_value"
          | "weight_unit"
          | "reps"
          | "is_warmup"
          | "is_amrap"
          | "completion_status"
        >[];
      },
      "id" | "exercises" | "exercise_type" | "equipment_type"
    >[];
  },
  "id"
>;

// get_wendler_programs

type GetWendlerProgramsResult =
  Database["public"]["Functions"]["get_wendler_programs"]["Returns"];
type WendlerPrograms = NonNullable<GetWendlerProgramsResult["programs"]>;
type WendlerProgram = NonNullable<WendlerPrograms>[number];
type Movements = NonNullable<WendlerProgram["movements"]>;
type Movement = NonNullable<Movements[number]>;
type MovementBlocks = NonNullable<Movement["blocks"]>;
type MovementBlock = NonNullable<MovementBlocks[number]>;
type RNNMovementBlock = RequiredNonNullable<
  MovementBlock,
  | "id"
  | "equipment_type"
  | "exercise_type"
  | "cycle_type"
  | "heaviest_weight_value"
>;
type NNMovement = RequiredNonNullable<
  Omit<Movement, "blocks"> & {
    blocks: RNNMovementBlock[];
  },
  | "id"
  | "exercise_type"
  | "training_max_value"
  | "increase_amount_value"
  | "weight_unit"
>;
export type RNNProgram = RequiredNonNullable<
  Omit<WendlerProgram, "movements"> & {
    movements: NNMovement[];
  },
  "id" | "user_id" | "name"
>;

export type RNNGetWendlerProgramsResult = RequiredNonNullable<
  Omit<GetWendlerProgramsResult, "programs"> & {
    programs: RNNProgram[];
  },
  "page_count"
>;
