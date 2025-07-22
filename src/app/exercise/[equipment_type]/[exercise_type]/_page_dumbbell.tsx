import AddDumbbellExercise, {
  DumbbellFormDraft,
} from "@/app/exercise/[equipment_type]/[exercise_type]/_components/AddDumbbellExercise";
import DumbbellExercisesTable from "@/app/exercise/[equipment_type]/[exercise_type]/_components/DumbbellExercisesTable";
import { ExerciseType } from "@/common-types";
import { Json } from "@/database.types";
import { requirePreferences, supabaseRPC } from "@/serverUtil";
import { notFoundIfNull } from "@/util";
import { Stack } from "@mui/material";
import React from "react";

export const conformsToDumbbellFormDraft = (
  value: Json | null,
): DumbbellFormDraft | null => {
  if (value === null) {
    return value;
  }
  // TODO - actually put some checks in here.
  return value as never as DumbbellFormDraft;
};

export interface DumbbellExercisePageProps {
  // This is narrowed at runtime from the parent page, but not at a static type
  // level because it's not worth it.
  dumbbellExerciseType: ExerciseType;
  path: string;
  userId: string;
  pageNum: number;
  startExerciseId?: string;
}

const DumbbellExercisePage: React.FC<DumbbellExercisePageProps> = async (
  props,
) => {
  const [
    {
      rows: dumbbellExercises,
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
      p_exercise_type: props.dumbbellExerciseType,
      p_page_num: props.pageNum,
      p_start_exercise_id: props.startExerciseId,
    }),
    requirePreferences(props.userId, ["available_dumbbells_lbs"], props.path),
    supabaseRPC("get_form_draft", {
      p_user_id: props.userId,
      p_page_path: props.path,
    }),
  ]);
  notFoundIfNull(dumbbellExercises);
  notFoundIfNull(pageSize);

  const dumbbellFormDraft = conformsToDumbbellFormDraft(unnarrowedFormDraft);

  return (
    <React.Fragment>
      <Stack spacing={1}>
        <AddDumbbellExercise
          exerciseType={props.dumbbellExerciseType}
          initialDumbbellFormDraft={dumbbellFormDraft}
          availableDumbbells={preferences.available_dumbbells_lbs}
          path={props.path}
          userId={props.userId}
        />
      </Stack>
      <DumbbellExercisesTable
        dumbbellExercises={dumbbellExercises}
        dumbbellExerciseType={props.dumbbellExerciseType}
        availableDumbbells={preferences.available_dumbbells_lbs}
        path={props.path}
        pageNum={props.pageNum}
        pageCount={pageCount!}
        startExerciseId={dayStartExerciseId ?? undefined}
      />
    </React.Fragment>
  );
};
export default DumbbellExercisePage;
