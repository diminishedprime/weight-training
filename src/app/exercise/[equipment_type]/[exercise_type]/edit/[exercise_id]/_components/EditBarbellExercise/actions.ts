"use server";

import { ExerciseForUser } from "@/common-types";
import { supabaseRPC } from "@/serverUtil";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const cancelEdit = async (backTo: string) => {
  redirect(backTo);
};

export const saveChanges = async (
  userId: string,
  editedExercise: ExerciseForUser,
  path: string,
  backTo: string | undefined,
) => {
  await supabaseRPC("update_exercise_for_user", {
    p_exercise_id: editedExercise.exercise_id!,
    p_user_id: userId,
    p_exercise_type: editedExercise.exercise_type!,
    p_target_weight_value: editedExercise.target_weight_value!,
    p_reps: editedExercise.reps!,
    p_actual_weight_value: editedExercise.actual_weight_value ?? undefined,
    p_completion_status: editedExercise.completion_status!,
    // TODO: we should support is_amprap in the barbell exercise rpc return type.
    // p_is_amrap: editedExercise.is_amrap ?? false,
    p_perceived_effort: editedExercise.perceived_effort ?? undefined,
    p_warmup: editedExercise.warmup ?? undefined,
    p_notes: editedExercise.notes ?? undefined,
    p_weight_unit: editedExercise.weight_unit!,
    p_performed_at: editedExercise.performed_at!,
  });
  revalidatePath(path);
  if (backTo) {
    redirect(backTo);
  }
};
