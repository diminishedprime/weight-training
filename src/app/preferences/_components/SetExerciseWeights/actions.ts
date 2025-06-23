"use server";

import { auth } from "@/auth";
import { requireId, getSupabaseClient } from "@/util";
import type { Database } from "@/database.types";
import { revalidatePath } from "next/cache";

export const updateOneRepMax = async (
  exerciseType: Database["public"]["Enums"]["exercise_type_enum"],
  value: number,
  weightUnit: Database["public"]["Enums"]["weight_unit_enum"]
) => {
  const session = await auth();
  const userId = requireId(session, "/preferences");
  const supabase = getSupabaseClient();

  // Call the RPC to update one rep max
  const { error } = await supabase.rpc("update_user_one_rep_max", {
    p_user_id: userId,
    p_exercise_type: exerciseType,
    p_weight_value: value,
    p_weight_unit: weightUnit,
  });
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/preferences");
  return { success: true };
};

export const updateTargetMax = async (
  exerciseType: Database["public"]["Enums"]["exercise_type_enum"],
  value: number,
  weightUnit: Database["public"]["Enums"]["weight_unit_enum"]
) => {
  const session = await auth();
  const userId = requireId(session, "/preferences");
  const supabase = getSupabaseClient();

  const { error } = await supabase.rpc("update_user_target_max", {
    p_user_id: userId,
    p_exercise_type: exerciseType,
    p_weight_value: value,
    p_weight_unit: weightUnit,
  });
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/preferences");
  return { success: true };
};
