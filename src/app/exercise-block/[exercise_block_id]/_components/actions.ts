"use server";

import { supabaseRPC } from "@/serverUtil";
import { revalidatePath } from "next/cache";

// TODO: I think all of these are broken and need to be updated.
export const skipExercise = async (
  userId: string,
  blockId: string,
  exerciseId: string,
  notes: string | null,
  path: string,
  _formData: FormData
) => {
  await supabaseRPC("skip_block_row", {
    p_user_id: userId,
    p_block_id: blockId,
    p_exercise_id: exerciseId,
    p_notes: notes ?? undefined,
  });
  revalidatePath(path);
};

export const failExercise = async (
  userId: string,
  blockId: string,
  exerciseId: string,
  notes: string | null,
  path: string,
  _formData: FormData
) => {
  await supabaseRPC("fail_block_row", {
    p_user_id: userId,
    p_block_id: blockId,
    p_exercise_id: exerciseId,
    p_notes: notes ?? undefined,
  });
  revalidatePath(path);
};

export const finishExercise = async (
  userId: string,
  blockId: string,
  exerciseId: string,
  notes: string | null,
  path: string,
  _formData: FormData
) => {
  await supabaseRPC("finish_block_row", {
    p_user_id: userId,
    p_block_id: blockId,
    p_exercise_id: exerciseId,
    p_notes: notes ?? undefined,
  });
  revalidatePath(path);
};
