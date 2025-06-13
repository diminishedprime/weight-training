import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { Session } from "next-auth";
import { Database } from "@/database.types";
import { ALL_PLATES } from "./constants";

// Stryker disable all
export const getSupabaseClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
};
// Stryker restore all

export function requireId(
  session: Session | null,
  currentPath: string,
): string {
  const id = session?.user?.id;
  if (!id) {
    const encoded = encodeURIComponent(currentPath);
    redirect(`/login?redirect-uri=${encoded}`);
  }
  return id;
}

/**
 * Calculates the minimal set of plates needed to achieve a target weight for one side of a barbell or a single dumbbell.
 *
 * This function assumes that the `availablePlates` array is sorted in descending order of weight.
 * It greedily selects the largest possible plates to make up the `targetWeight`.
 * If the `targetWeight` cannot be exactly achieved with the `availablePlates`,
 * the function will return the plates that sum up to the closest weight less than or equal to the `targetWeight`.
 *
 * @param targetWeight The desired weight to achieve (e.g., for one side of a barbell, or a single dumbbell weight).
 * @param availablePlates An array of numbers representing the weights of available plates, sorted in descending order.
 * @returns An array of numbers representing the plates selected to make up the target weight. The array will contain duplicates if multiple plates of the same weight are needed.
 */
export function minimalPlates(
  targetWeight: number,
  availablePlates: number[],
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
  lift_type: Database["public"]["Enums"]["exercise_type_enum"],
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
    // Stryker disable all
    default: {
      // This will cause a type error if a new enum value is added and not handled
      const _exhaustiveCheck: never = lift_type;
      return _exhaustiveCheck;
    }
    // Stryker restore all
  }
}
