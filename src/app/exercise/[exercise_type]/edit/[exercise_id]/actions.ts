"use server";

import type {
  ExerciseType,
  WeightUnit,
  CompletionStatus,
  PercievedEffort,
} from "@/common-types";
import { supabaseRPC } from "@/serverUtil";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateExerciseForUser(
  exercise_id: string,
  user_id: string,
  exercise_type: ExerciseType,
  target_weight_value: number,
  actual_weight_value: number | null,
  reps: number,
  performed_at: string | undefined,
  weight_unit: WeightUnit,
  warmup: boolean,
  completion_status: CompletionStatus,
  notes: string | null,
  relative_effort: PercievedEffort | null,
  backTo: string | null,
  _formData: FormData
) {
  await supabaseRPC("update_exercise_for_user", {
    p_exercise_id: exercise_id,
    p_user_id: user_id,
    p_exercise_type: exercise_type,
    p_target_weight_value: target_weight_value,
    p_actual_weight_value: actual_weight_value ?? undefined,
    p_reps: reps,
    p_performed_at: performed_at,
    p_weight_unit: weight_unit,
    p_warmup: warmup,
    p_completion_status: completion_status,
    p_notes: notes ?? undefined,
    p_relative_effort: relative_effort ?? undefined,
  });
  if (backTo) {
    revalidatePath(backTo);
    redirect(backTo);
  }
}
