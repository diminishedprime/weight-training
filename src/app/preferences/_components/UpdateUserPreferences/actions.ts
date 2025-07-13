"use server";

import { getSupabaseClient } from "@/serverUtil";
import type { WeightUnit } from "@/common-types";

export async function updateUserPreferences(
  userId: string,
  preferredWeightUnit: WeightUnit,
  defaultRestTime: number,
  availablePlates: number[],
  _: FormData
) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.rpc("set_user_preferences", {
    p_user_id: userId,
    p_preferred_weight_unit: preferredWeightUnit,
    p_default_rest_time: defaultRestTime,
    p_available_plates: availablePlates,
  });
  if (error) {
    throw error;
  }
}
