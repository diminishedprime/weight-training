"use server";
import { CommonFormDraft } from "@/app/exercise/[equipment_type]/[exercise_type]/_components/page";
import { Json } from "@/database.types";
import { supabaseRPC } from "@/serverUtil";
import { revalidatePath } from "next/cache";

const saveFormDraft = async <EquipmentFormDraft extends CommonFormDraft>(
  userId: string,
  path: string,
  equipmentFormDraft: EquipmentFormDraft,
  revalidate: boolean,
) => {
  await supabaseRPC("save_form_draft", {
    p_user_id: userId,
    p_page_path: path,
    p_form_data: equipmentFormDraft as never as Json,
  });
  if (revalidate) {
    revalidatePath(path);
  }
};

export const saveEquipmentFormDraft = async <
  EquipmentFormDraft extends CommonFormDraft,
>(
  userId: string,
  path: string,
  equipmentFormDraft: EquipmentFormDraft,
) => {
  await saveFormDraft(userId, path, equipmentFormDraft, false);
};

export const addEquipmentFormDraft = async <
  EquipmentFormDraft extends CommonFormDraft,
>(
  userId: string,
  path: string,
  equipmentFormDraft: EquipmentFormDraft,
) => {
  await saveFormDraft(userId, path, equipmentFormDraft, true);
};

export const clearEquipmentFormDraft = async (userId: string, path: string) => {
  await supabaseRPC("clear_form_draft", {
    p_user_id: userId,
    p_page_path: path,
  });
  revalidatePath(path);
};

export const addEquipmentExercise = async <
  EquipmentFormDraft extends CommonFormDraft,
>(
  userId: string,
  path: string,
  equipmentFormDraft: EquipmentFormDraft,
  defaultEquipmentFormDraft: EquipmentFormDraft,
) => {
  await addEquipmentFormDraft(userId, path, defaultEquipmentFormDraft);
  // TODO - Create a new, more specific RPC here that automatically handles the
  // p_performed_at and enforces that the completion status is one of the valid
  // values for having a p_performed_at.
  await supabaseRPC("create_exercise", {
    p_user_id: userId,
    p_exercise_type: equipmentFormDraft.exerciseType,
    p_equipment_type: equipmentFormDraft.equipmentType,
    // TODO: Intentionally using the actualWeight value for the target, but we
    // want to handle this better probably.
    p_target_weight_value: equipmentFormDraft.actualWeightValue,
    p_actual_weight_value: equipmentFormDraft.actualWeightValue,
    p_reps: equipmentFormDraft.reps,
    p_completion_status: equipmentFormDraft.completionStatus,
    p_is_amrap: equipmentFormDraft.isAMRAP,
    // Coerce empty string to undefined for better db storage.
    p_notes: equipmentFormDraft.notes ?? undefined,
    p_perceived_effort: equipmentFormDraft.perceivedEffort ?? undefined,
    p_warmup: equipmentFormDraft.isWarmup,
    p_weight_unit: equipmentFormDraft.weightUnit,
    p_performed_at: new Date().toISOString(),
  });
};
