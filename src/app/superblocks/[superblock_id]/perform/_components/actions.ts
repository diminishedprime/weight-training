"use server";

import { GetPerformSuperblockResult, PerceivedEffort } from "@/common-types";
import { Paths } from "@/constants";
import { supabaseRPC } from "@/serverUtil";
import { revalidatePath } from "next/cache";

export const finishExercise = async (
  userId: string,
  superblockId: string,
  blockId: string,
  exerciseId: string,
  actualWeightValue: number,
  reps: number,
  isWarmup: boolean,
  isAmrap: boolean,
  notes: string,
  perceivedEffort: PerceivedEffort | null,
) => {
  const updatedSuperblock = await supabaseRPC("finish_exercise", {
    p_user_id: userId,
    p_superblock_id: superblockId,
    p_block_id: blockId,
    p_exercise_id: exerciseId,
    p_actual_weight_value: actualWeightValue,
    p_reps: reps,
    p_is_warmup: isWarmup,
    p_is_amrap: isAmrap,
    p_notes: notes || undefined,
    p_perceived_effort: perceivedEffort ?? undefined,
  });
  revalidatePath(Paths.Superblocks_SuperblockId_Perform(superblockId));
  return updatedSuperblock as GetPerformSuperblockResult;
};

export const failExercise = async (
  userId: string,
  superblockId: string,
  blockId: string,
  exerciseId: string,
  actualWeightValue: number,
  reps: number,
  isWarmup: boolean,
  isAmrap: boolean,
  notes: string,
  perceivedEffort: PerceivedEffort | null,
) => {
  const updatedSuperblock = await supabaseRPC("fail_exercise", {
    p_user_id: userId,
    p_superblock_id: superblockId,
    p_block_id: blockId,
    p_exercise_id: exerciseId,
    p_actual_weight_value: actualWeightValue,
    p_reps: reps,
    p_is_warmup: isWarmup,
    p_is_amrap: isAmrap,
    p_notes: notes || undefined,
    p_perceived_effort: perceivedEffort ?? undefined,
  });

  revalidatePath(Paths.Superblocks_SuperblockId_Perform(superblockId));
  return updatedSuperblock as GetPerformSuperblockResult;
};

export const skipExercise = async (
  userId: string,
  superblockId: string,
  blockId: string,
  exerciseId: string,
  notes: string,
) => {
  const updatedSuperblock = await supabaseRPC("skip_exercise", {
    p_user_id: userId,
    p_superblock_id: superblockId,
    p_block_id: blockId,
    p_exercise_id: exerciseId,
    p_notes: notes || undefined,
  });

  revalidatePath(Paths.Superblocks_SuperblockId_Perform(superblockId));
  return updatedSuperblock as GetPerformSuperblockResult;
};

export const bustCache = async (superblockId: string) => {
  revalidatePath(Paths.Superblocks_SuperblockId_Perform(superblockId));
};
