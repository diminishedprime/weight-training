"use server";

import { requireLoggedInUser, getSupabaseClient } from "@/serverUtil";
import type { Database } from "@/database.types";
import { revalidatePath } from "next/cache";

/**
 * Updates the user's one rep max for a given exercise type and weight unit.
 * Accepts the value as a string and converts it to a number internally.
 */
export const updateOneRepMax = async (
  exerciseType: Database["public"]["Enums"]["exercise_type_enum"],
  weightUnit: Database["public"]["Enums"]["weight_unit_enum"],
  value: string
) => {
  const numValue = Number(value);
  if (isNaN(numValue)) return;
  const { userId } = await requireLoggedInUser("/preferences");
  const supabase = getSupabaseClient();
  await supabase.rpc("update_user_one_rep_max", {
    p_user_id: userId,
    p_exercise_type: exerciseType,
    p_weight_value: numValue,
    p_weight_unit: weightUnit,
  });
  revalidatePath("/preferences");
};

/**
 * Updates the user's target max for a given exercise type and weight unit.
 * Accepts the value as a string and converts it to a number internally.
 */
export const updateTargetMax = async (
  exerciseType: Database["public"]["Enums"]["exercise_type_enum"],
  weightUnit: Database["public"]["Enums"]["weight_unit_enum"],
  value: string
) => {
  const numValue = Number(value);
  if (isNaN(numValue)) return;
  const { userId } = await requireLoggedInUser("/preferences");
  const supabase = getSupabaseClient();
  await supabase.rpc("update_user_target_max", {
    p_user_id: userId,
    p_exercise_type: exerciseType,
    p_weight_value: numValue,
    p_weight_unit: weightUnit,
  });
  revalidatePath("/preferences");
};

export const updateDefaultRestTime = async (
  exerciseType: Database["public"]["Enums"]["exercise_type_enum"],
  value: string
) => {
  const numValue = Number(value);
  if (isNaN(numValue)) return;
  const { userId } = await requireLoggedInUser("/preferences");
  const supabase = getSupabaseClient();
  await supabase.rpc("update_user_default_rest_time", {
    p_user_id: userId,
    p_exercise_type: exerciseType,
    p_default_rest_time_seconds: numValue,
  });
  revalidatePath("/preferences");
};
