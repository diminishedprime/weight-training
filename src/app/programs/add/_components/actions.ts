"use server";

import { WeightUnit } from "@/common-types";
import { PATHS } from "@/constants";
import { supabaseRPC } from "@/serverUtil";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const addProgram = async (
  userId: string,
  squatTargetMax: number,
  deadliftTargetMax: number,
  overheadPressTargetMax: number,
  benchPressTargetMax: number,
  weightUnit: WeightUnit,
  includeDeload: boolean,
  programName: string,
) => {
  const programId = await supabaseRPC("add_wendler_program", {
    p_user_id: userId,
    p_squat_target_max: squatTargetMax,
    p_deadlift_target_max: deadliftTargetMax,
    p_overhead_press_target_max: overheadPressTargetMax,
    p_bench_press_target_max: benchPressTargetMax,
    p_weight_unit: weightUnit,
    p_include_deload: includeDeload,
    p_program_name: programName,
  });
  revalidatePath(PATHS.Programs);
  redirect(PATHS.ProgramById(programId));
};
