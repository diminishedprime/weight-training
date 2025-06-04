"use server";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";

export async function updateLiftForUserAction({
  lift_id,
  user_id,
  lift_type,
  weight_value,
  reps,
  performed_at,
  weight_unit,
  warmup,
  completion_status,
}: {
  lift_id: string;
  user_id: string;
  lift_type: Database["public"]["Enums"]["lift_type_enum"];
  weight_value: number;
  reps: number;
  performed_at: string | null;
  weight_unit: Database["public"]["Enums"]["weight_unit_enum"];
  warmup: boolean;
  completion_status: Database["public"]["Enums"]["completion_status_enum"];
}) {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { error } = await supabase.rpc("update_lift_for_user", {
    p_lift_id: lift_id,
    p_user_id: user_id,
    p_lift_type: lift_type,
    p_weight_value: weight_value,
    p_reps: reps,
    p_performed_at: performed_at ?? undefined,
    p_weight_unit: weight_unit,
    p_warmup: warmup,
    p_completion_status: completion_status,
  });
  if (error) {
    return { error: error.message };
  }
  return { success: true };
}
