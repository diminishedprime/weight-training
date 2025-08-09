"use server";

import { PerceivedEffort } from "@/common-types";
import { supabaseRPC } from "@/serverUtil";

export const updatePerceivedEffort = async (
  userId: string,
  exerciseId: string,
  perceivedEffort: PerceivedEffort | null,
) => {
  await supabaseRPC("update_perceived_effort", {
    p_user_id: userId,
    p_exercise_id: exerciseId,
    p_perceived_effort: perceivedEffort ?? undefined,
  });
};
