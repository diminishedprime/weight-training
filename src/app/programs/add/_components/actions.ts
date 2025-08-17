"use server";

import {
  FormDraftSchema,
  ProgramsAddFormDraft,
} from "@/app/programs/add/_components/common";
import { WeightUnit } from "@/common-types";
import { Paths } from "@/constants";
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
    p_page_path: Paths.Programs_Add,
  });
  revalidatePath(Paths.Programs);
  redirect(Paths.Programs_ProgramId(programId));
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

export const getProgramsAddFormDraft = async (
  userId: string,
): Promise<ProgramsAddFormDraft> => {
  const formDraftRaw = await supabaseRPC("get_form_draft", {
    p_user_id: userId,
    p_page_path: Paths.Programs_Add,
  });
  const parsed = FormDraftSchema.safeParse(formDraftRaw);
  return parsed.success ? parsed.data : null;
};
