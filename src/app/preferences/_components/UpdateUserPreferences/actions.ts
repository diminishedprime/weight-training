"use server";

import type { WeightUnit } from "@/common-types";
import { supabaseRPC } from "@/serverUtil";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateUserPreferences(
  userId: string,
  preferredWeightUnit: WeightUnit,
  defaultRestTime: string,
  availablePlates: number[],
  availableDumbbells: number[],
  availableKettlebells: number[],
  backTo: string | null,
  _: FormData,
) {
  const defaultRestTimeNum = Number(defaultRestTime);
  if (isNaN(defaultRestTimeNum) || defaultRestTimeNum <= 0) {
    throw new Error("Invalid default rest time");
  }
  await supabaseRPC("set_user_preferences", {
    p_user_id: userId,
    p_preferred_weight_unit: preferredWeightUnit,
    p_default_rest_time: defaultRestTimeNum,
    p_available_plates_lbs: availablePlates,
    p_available_dumbbells_lbs: availableDumbbells,
    p_available_kettlebells_lbs: availableKettlebells,
  });
  revalidatePath("/preferences");
  if (backTo) {
    redirect(backTo);
  }
}
