"use server";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";

export async function updateExerciseForUserAction({
  exercise_id,
  user_id,
  exercise_type,
  weight_value,
  reps,
  performed_at,
  weight_unit,
  warmup,
  completion_status,
  notes,
  relative_effort,
}: {
  exercise_id: string;
  user_id: string;
  exercise_type: Database["public"]["Enums"]["exercise_type_enum"];
  weight_value: number;
  reps: number;
  performed_at?: string;
  weight_unit: Database["public"]["Enums"]["weight_unit_enum"];
  warmup: boolean;
  completion_status: Database["public"]["Enums"]["completion_status_enum"];
  notes?: string;
  relative_effort?: Database["public"]["Enums"]["relative_effort_enum"];
}) {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { error } = await supabase.rpc("update_exercise_for_user", {
    p_exercise_id: exercise_id,
    p_user_id: user_id,
    p_exercise_type: exercise_type,
    p_weight_value: weight_value,
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
