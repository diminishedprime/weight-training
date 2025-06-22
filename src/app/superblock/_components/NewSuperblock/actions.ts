"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { getSupabaseClient, requireId } from "@/util";

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
  const session = await auth();
  const id = requireId(session, "/superblock");
  const supabase = getSupabaseClient();
  const result = await supabase
    .from("exercise_superblock")
    .insert({
      user_id: id,
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
