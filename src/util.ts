import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { Session } from "next-auth";
import { Database } from "@/database.types";

export const getSupabaseClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

export function requireId(
  session: Session | null,
  currentPath: string
): string {
  const id = session?.user?.id;
  if (!id) {
    const encoded = encodeURIComponent(currentPath);
    redirect(`/login?redirect-uri=${encoded}`);
  }
  return id;
}

// so if they need to like double up on 35s because they're otherwise out of
// weights to hit a target.
export const ALL_PLATES = [2.5, 5, 10, 25, 35, 45, 55];
export const DEFAULT_PLATE_SIZES = [45, 25, 10, 5, 2.5];

export function minimalPlates(
  targetWeight: number,
  availablePlates = DEFAULT_PLATE_SIZES
): number[] {
  let remaining = targetWeight;
  const result: number[] = [];
  for (const plate of availablePlates) {
    while (remaining >= plate) {
      result.push(plate);
      remaining -= plate;
    }
  }
  return result;
}

export function correspondingEquipment(
  lift_type: Database["public"]["Enums"]["exercise_type_enum"]
): Database["public"]["Enums"]["equipment_type_enum"] {
  switch (lift_type) {
    case "barbell_deadlift":
    case "barbell_squat":
    case "barbell_bench_press":
    case "barbell_overhead_press":
    case "barbell_row":
      return "barbell";
    case "dumbbell_row":
      return "dumbbell";
    case "chinup":
    case "pullup":
    case "pushup":
    case "situp":
      return "bodyweight";
    case "machine_converging_chest_press":
    case "machine_diverging_lat_pulldown":
    case "machine_diverging_low_row":
    case "machine_converging_shoulder_press":
    case "machine_lateral_raise":
    case "machine_abdominal":
    case "machine_leg_extension":
    case "machine_seated_leg_curl":
    case "machine_leg_press":
    case "machine_back_extension":
    case "machine_pec_fly":
    case "machine_biceps_curl":
    case "machine_inner_thigh":
    case "machine_outer_thigh":
    case "machine_triceps_extension":
    case "machine_rear_delt":
      return "machine";
    case "plate_stack_calf_raise":
      return "plate_stack";
    default: {
      // This will cause a type error if a new enum value is added and not handled
      const _exhaustiveCheck: never = lift_type;
      return _exhaustiveCheck;
    }
  }
}

