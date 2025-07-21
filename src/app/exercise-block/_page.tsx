import React from "react";
import ExerciseBlockClient from "@/app/exercise-block/_components/ExerciseBlockClient";
import { requireLoggedInUser, supabaseRPC } from "@/serverUtil";

interface ExerciseBlockProps {
  page: number;
}

export default async function ExerciseBlockPage(props: ExerciseBlockProps) {
  const { userId } = await requireLoggedInUser("/exercise-block");
  const exerciseBlocks = await supabaseRPC("get_exercise_blocks_for_user", {
    p_user_id: userId,
    p_page: props.page,
  });
  return <ExerciseBlockClient exerciseBlocks={exerciseBlocks} />;
}
