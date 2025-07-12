"use server";

import { WendlerCycleType } from "@/common-types";
import { getSupabaseClient } from "@/serverUtil";
import { exerciseTypeUIStringBrief } from "@/uiStrings";
import { redirect } from "next/navigation";

export async function addLegDay(
  userId: string,
  cycleType: WendlerCycleType,
  // TODO - remove this prop since it's not needed afterall.
  _pathToRevalidate: string,
  _: FormData
) {
  const supabase = getSupabaseClient();
  const { data: exerciseBlockId, error } = await supabase.rpc(
    "create_wendler_exercise_block",
    {
      p_user_id: userId,
      p_exercise_type: "barbell_back_squat",
      p_cycle_type: cycleType,
      p_block_name: `Wendler ${exerciseTypeUIStringBrief("barbell_back_squat")}s`,
    }
  );
  if (error) {
    throw error;
  }
  if (exerciseBlockId === null) {
    throw new Error(
      `Invariant violation: create_wendler_exercise_block returned null for user ${userId} and cycle type ${cycleType}`
    );
  }
  redirect(`/exercise-block/${exerciseBlockId}`);
}
