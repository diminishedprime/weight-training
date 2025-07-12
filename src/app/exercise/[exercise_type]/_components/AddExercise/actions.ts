"use server";

import {
  CompletionStatus,
  ExerciseType,
  RelativeEffort,
  WeightUnit,
} from "@/common-types";
import { getSupabaseClient } from "@/serverUtil";
import { equipmentForExercise } from "@/util";

export async function addBarbellLift(
  userId: string,
  pathToRevalidate: string,
  exerciseType: ExerciseType,
  weightValue: string,
  weightUnit: WeightUnit,
  reps: number,
  completionStatus: CompletionStatus,
  relativeEffort: RelativeEffort | null,
  isWarmup: boolean,
  notes: string | null,
  _: FormData
) {
  const equipment = equipmentForExercise(exerciseType);
  if (equipment !== "barbell") {
    throw new Error(
      `Invalid Invariant: Expected exercise type ${exerciseType} to be barbell, but got ${equipment}`
    );
  }
  const weightValueNum = Number(weightValue);
  if (isNaN(weightValueNum)) {
    throw new Error(`Invalid Invariant: Invalid weight value: ${weightValue}`);
  }

  const supabase = getSupabaseClient();
  const { revalidatePath } = await import("next/cache");
  const response = await supabase.rpc("create_exercise", {
    p_user_id: userId,
    p_exercise_type: exerciseType,
    p_equipment_type: "barbell",
    p_weight_value: weightValueNum,
    p_weight_unit: weightUnit,
    p_reps: reps,
    p_completion_status: completionStatus,
    p_relative_effort: relativeEffort || undefined,
    p_warmup: isWarmup,
    p_notes: notes || undefined,
    ...(completionStatus === "completed" || completionStatus === "failed"
      ? { p_performed_at: new Date().toISOString() }
      : {}),
    p_actual_weight_value: weightValueNum,
  });
  if (response.error) {
    throw response.error;
  }
  revalidatePath(pathToRevalidate);
}
