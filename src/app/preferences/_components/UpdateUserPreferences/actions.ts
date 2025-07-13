"use server";

import { getSupabaseClient } from "@/serverUtil";
import type { WeightUnit } from "@/common-types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateUserPreferences(
  userId: string,
  preferredWeightUnit: WeightUnit,
  defaultRestTime: string,
  availablePlates: number[],
  backTo: string | null,
  _: FormData
) {
  const supabase = getSupabaseClient();
  const defaultRestTimeNum = Number(defaultRestTime);
  if (isNaN(defaultRestTimeNum) || defaultRestTimeNum <= 0) {
    throw new Error("Invalid default rest time");
  }
  const { error } = await supabase.rpc("set_user_preferences", {
    p_user_id: userId,
    p_preferred_weight_unit: preferredWeightUnit,
    p_default_rest_time: defaultRestTimeNum,
    p_available_plates: availablePlates,
  });
  if (error) {
    throw error;
  }
  revalidatePath("/preferences");
  if (backTo) {
    redirect(backTo);
  }
}
