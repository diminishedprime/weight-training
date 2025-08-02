import { Database } from "@/database.types";
import { RequiredNonNullable } from ".";

type LGetPerformSuperblock =
  Database["public"]["Functions"]["get_perform_superblock"]["Returns"];

type LSuperblockBlocks = NonNullable<LGetPerformSuperblock["blocks"]>;
type LSuperblockBlock = LSuperblockBlocks[number];
type LSuperblockBlockExercises = NonNullable<LSuperblockBlock["exercises"]>;
type LSuperblockBlockExercise = LSuperblockBlockExercises[number];
type LSuperblockBlockWendlerDetails = NonNullable<
  LSuperblockBlock["wendler_details"]
>;

type RNNSuperblockBlockExercise = RequiredNonNullable<
  LSuperblockBlockExercise,
  | "id"
  | "equipment_type"
  | "target_weight_value"
  | "completion_status"
  | "exercise_type"
  | "is_amrap"
  | "is_warmup"
  | "reps"
  | "weight_unit"
>;

type RNNSuperblockBlockWendlerDetails = RequiredNonNullable<
  LSuperblockBlockWendlerDetails,
  | "id"
  | "block_id"
  | "cycle_type"
  | "exercise_type"
  | "increase_amount_value"
  | "training_max_value"
  | "weight_unit"
  | "user_id"
  | "wendler_program_cycle_id"
>;

type RNNSuperblockBlock = RequiredNonNullable<
  Omit<LSuperblockBlock, "exercises" | "wendler_details"> & {
    exercises: RNNSuperblockBlockExercise[];
    wendler_details: RNNSuperblockBlockWendlerDetails | null;
  },
  "id" | "name" | "exercise_type" | "equipment_type"
>;

type RNNGetPerformSuperblock = RequiredNonNullable<
  Omit<LGetPerformSuperblock, "blocks"> & {
    blocks: RNNSuperblockBlock[];
  },
  "id" | "name"
>;

export type GetPerformSuperblockResult = RNNGetPerformSuperblock;
export type GetPerformSuperblockBlocks = GetPerformSuperblockResult["blocks"];
export type GetPerformSuperblockBlock = GetPerformSuperblockBlocks[number];
export type GetPerformSuperblockExercises =
  GetPerformSuperblockBlock["exercises"];
export type GetPerformSuperblockExercise =
  GetPerformSuperblockExercises[number];
