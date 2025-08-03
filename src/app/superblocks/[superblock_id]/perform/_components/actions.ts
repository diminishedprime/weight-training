"use server";

import { GetPerformSuperblockResult, PerceivedEffort } from "@/common-types";
import { supabaseRPC } from "@/serverUtil";

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
  return updatedSuperblock as GetPerformSuperblockResult;
};
