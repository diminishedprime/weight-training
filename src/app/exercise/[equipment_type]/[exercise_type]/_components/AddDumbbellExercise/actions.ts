"use server";

import {
  CompletionStatus,
  ExerciseType,
  PerceivedEffort,
  WeightUnit,
} from "@/common-types";
import { Json } from "@/database.types";
import { supabaseRPC } from "@/serverUtil";
import { revalidatePath } from "next/cache";
import { DumbbellFormDraft } from ".";

const saveFormDraft = async (
  userId: string,
  path: string,
  dumbbellFormDraft: DumbbellFormDraft,
  revalidate: boolean,
) => {
  await supabaseRPC("save_form_draft", {
    p_user_id: userId,
    p_page_path: path,
    p_form_data: dumbbellFormDraft as never as Json,
  });
  if (revalidate) {
    revalidatePath(path);
  }
};

export const addDumbbellFormDraft = async (
  userId: string,
  path: string,
  dumbbellFormDraft: DumbbellFormDraft,
  _formData: FormData,
) => {
  await saveFormDraft(userId, path, dumbbellFormDraft, true);
};

export const saveDumbbellFormDraft = async (
  userId: string,
  path: string,
  dumbbellFormDraft: DumbbellFormDraft,
) => {
  await saveFormDraft(userId, path, dumbbellFormDraft, false);
};

export const deleteDumbbellFormDraft = async (
  userId: string,
  path: string,
  _formData: FormData,
) => {
  await supabaseRPC("clear_form_draft", {
    p_user_id: userId,
    p_page_path: path,
  });
  revalidatePath(path);
};

export const addDumbbellExercise = async (
  userId: string,
  exerciseType: ExerciseType,
  actualWeightValue: number,
  reps: number,
  completionStatus: CompletionStatus,
  isAmrap: boolean,
  notes: string | undefined,
  perceivedEffort: PerceivedEffort | undefined,
  isWarmup: boolean,
  weightUnit: WeightUnit,
  path: string,
  defaultFormDraft: DumbbellFormDraft,
) => {
  await addDumbbellFormDraft(userId, path, defaultFormDraft, new FormData());
  await supabaseRPC("create_exercise", {
    p_user_id: userId,
    p_exercise_type: exerciseType,
    p_equipment_type: "dumbbell",
    // TODO: Intentionally using the actualWeight value for the target, but we
    // want to handle this better probably.
    p_target_weight_value: actualWeightValue,
    p_actual_weight_value: actualWeightValue,
    p_reps: reps,
    p_completion_status: completionStatus,
    p_is_amrap: isAmrap,
    // Coerce empty string to undefined for better db storage.
    p_notes: notes ?? undefined,
    p_perceived_effort: perceivedEffort,
    p_warmup: isWarmup,
    p_weight_unit: weightUnit,
    p_performed_at: new Date().toISOString(),
  });
};
