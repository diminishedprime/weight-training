"use server";

import { getSupabaseClient, requireLoggedInUser } from "@/serverUtil";
import type { Database } from "@/database.types";
import { revalidatePath } from "next/cache";

/**
 * Type alias for exercise type enum.
 */
type ExerciseType = Database["public"]["Enums"]["exercise_type_enum"];
/**
 * Type alias for weight unit enum.
 */
type WeightUnit = Database["public"]["Enums"]["weight_unit_enum"];

/**
 * Updates the user's target max for a given exercise.
 * Calls the appropriate Supabase RPC to update the value in the database.
 * Throws an error if the value is not a valid number.
 *
 * @param userId - The user's unique ID.
 * @param exerciseType - The exercise type enum value.
 * @param weightUnit - The weight unit (e.g., "pounds").
 * @param value - The new target max value as a string (should be numeric).
 * @returns The result of the Supabase RPC call.
 */
export async function updateUserTargetMax(
  exerciseType: ExerciseType,
  weightUnit: WeightUnit,
  value: string,
  currentPath: string
) {
  const { userId } = await requireLoggedInUser(currentPath);
  const numericValue = Number(value);
  if (!value || isNaN(numericValue) || numericValue <= 0) {
    throw new Error(
      "Please enter a valid target max (must be a positive number)."
    );
  }
  const supabase = getSupabaseClient();
  const result = await supabase.rpc("update_user_target_max", {
    p_user_id: userId,
    p_exercise_type: exerciseType,
    p_weight_unit: weightUnit,
    p_weight_value: numericValue,
  });
  if (result.error) {
    throw new Error(result.error.message || "Failed to update target max.");
  }
  revalidatePath(currentPath);
}
