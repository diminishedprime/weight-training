import EditEquipmentExercise from "@/app/exercise/[equipment_type]/[exercise_type]/edit/[exercise_id]/_components/EditEquipmentExercise";
import { EquipmentType, ExerciseType, GetExerciseResult } from "@/common-types";
import { pathForEquipmentExerciseEdit } from "@/constants";
import { requirePreferences, supabaseRPC } from "@/serverUtil";
import { notFoundIfNull } from "@/util";
import { Typography } from "@mui/material";
import React from "react";

export interface EditEquipmentExercisePageProps {
  equipmentType: EquipmentType;
  exerciseType: ExerciseType;
  userId: string;
  exerciseId: string;
  currentPath: string;
  backTo: string | undefined;
}

const EditEquipmentExercisePage: React.FC<
  EditEquipmentExercisePageProps
> = async (props) => {
  const { equipmentType, exerciseType, exerciseId, userId, backTo } = props;
  const [preferences, exercise] = await Promise.all([
    equipmentSpecificPreferences(props),
    getExercise(props),
  ]);

  // the RPC won't return null but instead an object with all nulls for the
  // values, check for that here.
  notFoundIfNull(exercise.exercise_id);

  const path = pathForEquipmentExerciseEdit(
    equipmentType,
    exerciseType,
    exerciseId,
  );

  return (
    <React.Fragment>
      <Typography variant="h6">Edit Exercise</Typography>
      <EditEquipmentExercise
        equipmentType={equipmentType}
        exerciseType={exerciseType}
        userId={userId}
        currentPath={path}
        exercise={exercise}
        preferences={preferences}
        backTo={backTo}
      />
    </React.Fragment>
  );
};

export default EditEquipmentExercisePage;

const equipmentSpecificPreferences = (
  props: EditEquipmentExercisePageProps,
) => {
  const { equipmentType, userId, currentPath } = props;
  switch (equipmentType) {
    case "barbell":
      return requirePreferences(userId, ["available_plates_lbs"], currentPath);
    case "dumbbell":
      return requirePreferences(
        userId,
        ["available_dumbbells_lbs"],
        currentPath,
      );
    default:
      return requirePreferences(userId, [], currentPath);
  }
};

const getExercise = async (props: EditEquipmentExercisePageProps) => {
  const { userId, exerciseId } = props;

  const exercise = await supabaseRPC("get_exercise_for_user", {
    p_user_id: userId,
    p_exercise_id: exerciseId,
  });

  return exercise as GetExerciseResult;
};
