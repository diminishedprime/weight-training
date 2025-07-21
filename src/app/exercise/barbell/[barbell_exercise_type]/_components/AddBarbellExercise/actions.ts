"use server";

import { supabaseRPC } from "@/serverUtil";
import { revalidatePath } from "next/cache";
import { BarbellFormDraft } from ".";
import { Json } from "@/database.types";
import {
  CompletionStatus,
  ExerciseType,
  PercievedEffort,
  WeightUnit,
} from "@/common-types";

const saveFormDraft = async (
  userId: string,
  path: string,
  barbellFormDraft: BarbellFormDraft,
  revalidate: boolean
) => {
  await supabaseRPC("save_form_draft", {
    p_user_id: userId,
    p_page_path: path,
    p_form_data: barbellFormDraft as never as Json,
  });
  if (revalidate) {
    revalidatePath(path);
  }
};

export const addBarbellFormDraft = async (
  userId: string,
  path: string,
  barbellFormDraft: BarbellFormDraft,
  _formData: FormData
) => {
  await saveFormDraft(userId, path, barbellFormDraft, true);
};

export const saveBarbellFormDraft = async (
  userId: string,
  path: string,
  barbellFormDraft: BarbellFormDraft
) => {
  await saveFormDraft(userId, path, barbellFormDraft, false);
};

export const deleteBarbellFormDraft = async (
  userId: string,
  path: string,
  _formData: FormData
) => {
  await supabaseRPC("clear_form_draft", {
    p_user_id: userId,
    p_page_path: path,
  });
  revalidatePath(path);
};

export const addBarbellExercise = async (
  userId: string,
  exerciseType: ExerciseType,
  actualWeightValue: number,
  reps: number,
  completionStatus: CompletionStatus,
  isAmrap: boolean,
  notes: string | undefined,
  percievedEffort: PercievedEffort | undefined,
  isWarmup: boolean,
  weightUnit: WeightUnit,
  path: string,
  defaultFormDraft: BarbellFormDraft
) => {
  await addBarbellFormDraft(userId, path, defaultFormDraft, new FormData());
  await supabaseRPC("create_exercise", {
    p_user_id: userId,
    p_exercise_type: exerciseType,
    p_equipment_type: "barbell",
    // TODO: Intentionally using the actualWeight value for the target, but we
    // want to handle this better probably.
    p_target_weight_value: actualWeightValue,
    p_actual_weight_value: actualWeightValue,
    p_reps: reps,
    p_completion_status: completionStatus,
    p_is_amrap: isAmrap,
    // Coerce empty string to undefined for better db storage.
    p_notes: notes ?? undefined,
    p_relative_effort: percievedEffort,
    p_warmup: isWarmup,
    p_weight_unit: weightUnit,
    p_performed_at: new Date().toISOString(),
  });
};
