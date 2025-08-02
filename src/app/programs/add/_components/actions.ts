"use server";

import { type ProgramsAddFormDraft } from "@/app/programs/add/_components/_page_ProgramsAdd";
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
  squatIncrease: number,
  deadliftIncrease: number,
  overheadPressIncrease: number,
  benchPressIncrease: number,
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
    p_squat_increase: squatIncrease,
    p_deadlift_increase: deadliftIncrease,
    p_overhead_press_increase: overheadPressIncrease,
    p_bench_press_increase: benchPressIncrease,
    p_weight_unit: weightUnit,
    p_include_deload: includeDeload,
    p_program_name: programName,
  });
  supabaseRPC("clear_form_draft", {
    p_user_id: userId,
    p_page_path: PATHS.Programs_Add,
  });
  revalidatePath(PATHS.Programs);
  redirect(PATHS.ProgramById(programId));
};

export const saveFormDraft = async (
  userId: string,
  pagePath: string,
  formData: ProgramsAddFormDraft,
) => {
  await supabaseRPC("save_form_draft", {
    p_user_id: userId,
    p_page_path: pagePath,
    p_form_data: formData,
  });
};
