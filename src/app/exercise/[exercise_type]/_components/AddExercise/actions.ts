"use server";

import {
  CompletionStatus,
  ExerciseType,
  PercievedEffort,
  WeightUnit,
} from "@/common-types";
import { Json } from "@/database.types";
import { supabaseRPC } from "@/serverUtil";
import { equipmentForExercise, VALID_BARBELL_FORM_DRAFT_PATHS } from "@/util";
import { revalidatePath } from "next/cache";

/**
 * Type representing the form state for AddBarbell component
 */
export interface BarbellFormDraft {
  totalWeight: number;
  weightUnit: WeightUnit;
  reps: number;
  effort: PercievedEffort | null;
  warmup: boolean;
  completionStatus: CompletionStatus;
  notes: string;
}

/**
 * Check if a string is a valid barbell form draft path.
 * Uses a pre-computed Set for O(1) lookup performance.
 */
function isBarbellFormDraftPath(path: string): boolean {
  return VALID_BARBELL_FORM_DRAFT_PATHS.has(path);
}

export async function addBarbellLift(
  userId: string,
  pathToRevalidate: string,
  exerciseType: ExerciseType,
  weightValue: string,
  weightUnit: WeightUnit,
  reps: number,
  completionStatus: CompletionStatus,
  relativeEffort: PercievedEffort | null,
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

  await supabaseRPC("create_exercise", {
    p_user_id: userId,
    p_exercise_type: exerciseType,
    p_equipment_type: "barbell",
    p_target_weight_value: weightValueNum,
    p_actual_weight_value: weightValueNum,
    p_weight_unit: weightUnit,
    p_reps: reps,
    p_completion_status: completionStatus,
    p_relative_effort: relativeEffort || undefined,
    p_warmup: isWarmup,
    p_notes: notes || undefined,
    ...(completionStatus === "completed" || completionStatus === "failed"
      ? { p_performed_at: new Date().toISOString() }
      : {}),
  });

  // // Clear the form draft after successful submission (don't block the UI)
  // clearBarbellFormDraft(userId, `/exercise/${exerciseType}`).catch((error) => {
  //   console.error("Failed to clear form draft:", error);
  // });

  revalidatePath(pathToRevalidate);
}

export async function saveBarbellFormDraft(
  userId: string,
  path: string,
  formData: BarbellFormDraft,
  ttlDays: number = 7
) {
  if (!isBarbellFormDraftPath(path)) {
    return;
  }

  await supabaseRPC("save_form_draft", {
    p_user_id: userId,
    p_form_type: path,
    p_form_data: formData as unknown as Json, // JSONB serialization
    p_ttl_days: ttlDays,
  });
}

export async function clearBarbellFormDraft(userId: string, path: string) {
  if (!isBarbellFormDraftPath(path)) {
    return;
  }

  await supabaseRPC("clear_form_draft", {
    p_user_id: userId,
    p_form_type: path,
  });

  revalidatePath(path);
}

export async function createBarbellFormDraft(userId: string, path: string) {
  if (!isBarbellFormDraftPath(path)) {
    return;
  }

  const defaultFormData: BarbellFormDraft = {
    totalWeight: 45,
    weightUnit: "pounds",
    reps: 5,
    effort: null,
    warmup: false,
    completionStatus: "completed",
    notes: "",
  };

  await supabaseRPC("save_form_draft", {
    p_user_id: userId,
    p_form_type: path,
    p_form_data: defaultFormData as unknown as Json,
    p_ttl_days: 7,
  });

  revalidatePath(path);
}
