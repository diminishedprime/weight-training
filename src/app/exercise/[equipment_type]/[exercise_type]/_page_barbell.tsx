import { ExerciseType } from "@/common-types";
import React from "react";
import BarbellExercisesTable from "@/app/exercise/[equipment_type]/[exercise_type]/_components/BarbellExercisesTable";
import { requirePreferences, supabaseRPC } from "@/serverUtil";
import { notFoundIfNull } from "@/util";
import { Stack } from "@mui/material";
import AddBarbellExercise, {
  BarbellFormDraft,
} from "@/app/exercise/[equipment_type]/[exercise_type]/_components/AddBarbellExercise";
import { Json } from "@/database.types";

export const conformsToBarbellFormDraft = (
  value: Json | null
): BarbellFormDraft | null => {
  if (value === null) {
    return value;
  }
  // TODO - actually put some checks in here.
  return value as never as BarbellFormDraft;
};

export interface BarbellExercisePageProps {
  // This is narrowed at runtime from the parent page, but not at a static type
  // level because it's not worth it.
  barbellExerciseType: ExerciseType;
  path: string;
  userId: string;
  pageNum: number;
  startExerciseId?: string;
}

const BarbellExercisePage: React.FC<BarbellExercisePageProps> = async (
  props
) => {
  const [
    {
      rows: barbellExercises,
      day_start_exercise_id: dayStartExerciseId,
      page_size: pageSize,
      page_count: pageCount,
    },
    preferences,
    unnarrowedFormDraft,
  ] = await Promise.all([
    // TODO: Update this to have a lag such that it can have the performed_at of
    // the previous exercise to use in better display logic.
    supabaseRPC("get_exercises_by_type", {
      p_user_id: props.userId,
      p_exercise_type: props.barbellExerciseType,
      p_page_num: props.pageNum,
      p_start_exercise_id: props.startExerciseId,
    }),
    requirePreferences(props.userId, ["available_plates_lbs"], props.path),
    supabaseRPC("get_form_draft", {
      p_user_id: props.userId,
      p_page_path: props.path,
    }),
  ]);
  notFoundIfNull(barbellExercises);
  notFoundIfNull(pageSize);

  const barbellFormDraft = conformsToBarbellFormDraft(unnarrowedFormDraft);

  return (
    <React.Fragment>
      <Stack spacing={1}>
        <AddBarbellExercise
          exerciseType={props.barbellExerciseType}
          initialBarbellFormDraft={barbellFormDraft}
          availablePlatesLbs={preferences.available_plates_lbs}
          path={props.path}
          userId={props.userId}
        />
      </Stack>
      <BarbellExercisesTable
        barbellExercises={barbellExercises}
        barbellExerciseType={props.barbellExerciseType}
        availablePlatesLbs={preferences.available_plates_lbs}
        path={props.path}
        pageNum={props.pageNum}
        pageCount={pageCount!}
        startExerciseId={dayStartExerciseId ?? undefined}
      />
    </React.Fragment>
  );
};
export default BarbellExercisePage;
