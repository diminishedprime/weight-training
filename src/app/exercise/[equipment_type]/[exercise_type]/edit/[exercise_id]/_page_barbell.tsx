import EditBarbellExercise from "@/app/exercise/[equipment_type]/[exercise_type]/edit/[exercise_id]/_components/EditBarbellExercise";
import { ExerciseType } from "@/common-types";
import { requirePreferences, supabaseRPC } from "@/serverUtil";
import { Typography } from "@mui/material";
import React from "react";

export interface BarbellExerciseEditPageProps {
  // This is narrowed at runtime from the parent page, but not at a static type
  // level because it's not worth it.
  barbellExerciseType: ExerciseType;
  path: string;
  userId: string;
  exerciseId: string;
  backTo?: string;
}

const BarbellExerciseEditPage: React.FC<BarbellExerciseEditPageProps> = async (
  props,
) => {
  const [preferences, exercise] = await Promise.all([
    requirePreferences(props.userId, ["available_plates_lbs"], props.path),
    supabaseRPC("get_exercise_for_user", {
      p_user_id: props.userId,
      p_exercise_id: props.exerciseId,
    }),
  ]);
  return (
    <React.Fragment>
      <Typography variant="h6">Edit Exercise</Typography>
      <EditBarbellExercise
        userId={props.userId}
        path={props.path}
        exercise={exercise}
        availablePlatesLbs={preferences.available_plates_lbs}
        backTo={props.backTo}
      />
    </React.Fragment>
  );
};

export default BarbellExerciseEditPage;
