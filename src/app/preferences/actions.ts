"use server";

import { auth } from "@/auth";
import { requireId, getSupabaseClient } from "@/util";
import { revalidatePath } from "next/cache";
import type { Database } from "@/database.types";

export const saveExerciseWeight = async (
  exercise: Database["public"]["Tables"]["user_exercise_weights"]["Row"]
) => {
  const session = await auth();
  const userId = requireId(session, "/preferences");
  const supabase = getSupabaseClient();

  try {
    const { error: mappingError } = await supabase
      .from("user_exercise_weights")
      .upsert({
        ...exercise,
        user_id: userId,
      });
    if (mappingError) {
      throw new Error(
        `Failed to save exercise weight mapping for ${exercise.exercise_type}: ${mappingError.message}`
      );
    }
    // revalidate the preferences page to reflect changes
    revalidatePath("/preferences");
    return { success: true };
  } catch (error) {
    console.error("Error saving exercise weight:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
