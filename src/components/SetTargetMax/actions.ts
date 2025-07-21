"use server";
import { Database } from "@/database.types";
import { supabaseRPC } from "@/serverUtil";
import { revalidatePath } from "next/cache";

/**
 * Server action to set the target max for a user and exercise type.
 * Accepts FormData as required by Next.js server actions.
 */
export const setTargetMaxAction = async (
  userId: string,
  exerciseType: Database["public"]["Enums"]["exercise_type_enum"],
  targetMaxValue: string,
  targetMaxUnit: Database["public"]["Enums"]["weight_unit_enum"],
  pathToRevalidate: string | undefined,
  _formData: FormData
) => {
  const targetMax = Number(targetMaxValue);
  await supabaseRPC("set_target_max", {
    p_user_id: userId,
    p_exercise_type: exerciseType,
    p_value: targetMax,
    p_unit: targetMaxUnit,
  });
  if (pathToRevalidate) {
    revalidatePath(pathToRevalidate);
  }
};
