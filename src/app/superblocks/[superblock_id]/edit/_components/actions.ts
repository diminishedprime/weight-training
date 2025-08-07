"use server";
import {
  EquipmentType,
  ExerciseType,
  RecentSetOverviewsResult,
} from "@/common-types";
import { Paths } from "@/constants";
import { supabaseRPC } from "@/serverUtil";
import { revalidatePath } from "next/cache";

export const addBlock = async (
  userId: string,
  superblockId: string,
  name: string,
  equipmentType: EquipmentType,
  exerciseType: ExerciseType,
  sets: number,
  reps: number,
  weightValue: number,
  weightUnit: "pounds" | "kilograms",
) => {
  await supabaseRPC("add_block_to_superblock", {
    p_user_id: userId,
    p_superblock_id: superblockId,
    p_name: name,
    p_equipment_type: equipmentType,
    p_exercise_type: exerciseType,
    p_sets: sets,
    p_reps: reps,
    p_weight_value: weightValue,
    p_weight_unit: weightUnit,
  });
  revalidatePath(Paths.Superblocks);
  revalidatePath(Paths.Superblocks_SuperblockId(superblockId));
  revalidatePath(Paths.Superblocks_SuperblockId_Edit(superblockId));
  revalidatePath(Paths.Superblocks_SuperblockId_Perform(superblockId));
};

export const recentSetOverviews = async (
  userId: string,
  exerciseType: ExerciseType,
) => {
  const result = await supabaseRPC("recent_set_overviews", {
    p_user_id: userId,
    p_exercise_type: exerciseType,
  });
  return result as RecentSetOverviewsResult;
};

export const deleteBlock = async (
  userId: string,
  blockId: string,
  superblockId: string,
) => {
  await supabaseRPC("delete_block", {
    p_block_id: blockId,
    p_user_id: userId,
  });
  revalidatePath(Paths.Superblocks_SuperblockId(superblockId));
  revalidatePath(Paths.Superblocks_SuperblockId_Edit(superblockId));
  revalidatePath(Paths.Superblocks_SuperblockId_Perform(superblockId));
};
