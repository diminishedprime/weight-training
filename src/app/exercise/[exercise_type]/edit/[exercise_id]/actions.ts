"use server";

import { createClient } from "@supabase/supabase-js";
import type {
  ExerciseType,
  WeightUnit,
  CompletionStatus,
  RelativeEffort,
} from "@/common-types";

export async function updateExerciseForUserAction(
  exercise_id: string,
  user_id: string,
  exercise_type: ExerciseType,
  weight_value: number,
  actual_weight_value: number,
  reps: number,
  performed_at: string | undefined,
  weight_unit: WeightUnit,
  warmup: boolean,
  completion_status: CompletionStatus,
  notes?: string,
  relative_effort?: RelativeEffort
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { error } = await supabase.rpc("update_exercise_for_user", {
    p_exercise_id: exercise_id,
    p_user_id: user_id,
    p_exercise_type: exercise_type,
    p_weight_value: weight_value,
    p_actual_weight_value: actual_weight_value,
    p_reps: reps,
    p_performed_at: performed_at,
    p_weight_unit: weight_unit,
    p_warmup: warmup,
    p_completion_status: completion_status,
    p_notes: notes,
    p_relative_effort: relative_effort,
  });
  if (error) {
    return { error: error.message };
  }
  return { success: true };
}
