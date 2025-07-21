import { ExerciseType } from "@/common-types";
import React from "react";
import BarbellExercisesTable from "@/app/exercise/barbell/[barbell_exercise_type]/_components/BarbellExercisesTable";
import { requirePreferences, supabaseRPC } from "@/serverUtil";
import { notFoundIfNull } from "@/util";
import { Button, Stack } from "@mui/material";
import Link from "next/link";
import AddBarbellExercise, {
  BarbellFormDraft,
} from "@/app/exercise/barbell/[barbell_exercise_type]/_components/AddBarbellExercise";
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

  // Next page link: include start_exercise_id if day_start_exercise_id is present
  const nextParams = new URLSearchParams({
    page_num: (props.pageNum + 1).toString(),
  });
  if (dayStartExerciseId) {
    nextParams.set("start_exercise_id", dayStartExerciseId);
  }
  const hrefNext = `${props.path}?${nextParams.toString()}`;

  const previousParams = new URLSearchParams({
    page_num: (props.pageNum - 1).toString(),
  });

  // Previous page link (never includes start_exercise_id, but it kinda should
  // probably, but that's okay.)
  const hrefPrevious =
    props.pageNum > 1 && `${props.path}?${previousParams.toString()}`;

  const barbellFormDraft = conformsToBarbellFormDraft(unnarrowedFormDraft);

  return (
    <React.Fragment>
      <Stack spacing={1} direction="row">
        <Button
          LinkComponent={Link}
          href={hrefPrevious || undefined}
          disabled={!hrefPrevious}>
          icon Previous
        </Button>
        <Button
          LinkComponent={Link}
          href={hrefNext}
          disabled={
            barbellExercises.length < (pageSize ?? 1) && !dayStartExerciseId
          }>
          icon Next
        </Button>
      </Stack>
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
      />
    </React.Fragment>
  );
};
export default BarbellExercisePage;
