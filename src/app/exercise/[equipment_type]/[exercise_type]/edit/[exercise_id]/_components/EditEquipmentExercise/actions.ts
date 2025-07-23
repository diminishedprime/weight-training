"use server";
import { GetExerciseResult } from "@/common-types";
import { supabaseRPC } from "@/serverUtil";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const saveExerciseEdits = async (
  userId: string,
  editedExercise: GetExerciseResult,
  currentPath: string,
  backTo: string | undefined,
) => {
  await supabaseRPC("update_exercise_for_user", {
    p_user_id: userId,
    p_exercise_id: editedExercise.exercise_id,
    p_exercise_type: editedExercise.exercise_type,
    p_target_weight_value: editedExercise.target_weight_value,
    p_actual_weight_value: editedExercise.actual_weight_value ?? undefined,
    p_reps: editedExercise.reps,
    p_completion_status: editedExercise.completion_status,
    p_perceived_effort: editedExercise.perceived_effort ?? undefined,
    p_warmup: editedExercise.warmup,
    p_is_amrap: editedExercise.is_amrap,
    p_notes: editedExercise.notes || undefined,
    p_performed_at: editedExercise.performed_at ?? undefined,
  });
  revalidatePath(currentPath);
  if (backTo) {
    redirect(backTo);
  }
};
