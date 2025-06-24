"use server";

import { revalidatePath } from "next/cache";
import { requireLoggedInUser, getSupabaseClient } from "@/serverUtil";

/**
 * Adds a new superblock to the exercise_superblock table using Supabase.
 * @param params - Object containing name and notes for the superblock.
 * @returns Success or error object.
 */
export async function addNewSuperblock(params: {
  name: string;
  notes?: string;
}) {
  "use server";
  const { userId } = await requireLoggedInUser("/superblock");
  const supabase = getSupabaseClient();
  const result = await supabase
    .from("exercise_superblock")
    .insert({
      user_id: userId,
      name: params.name,
      notes: params.notes,
    })
    .select("id")
    .single();

  if (!result.error) {
    revalidatePath(`/superblock`);
  }
  return result;
}
