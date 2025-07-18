import { notFound } from "next/navigation";
import { Suspense } from "react";
import EditExerciseForm from "@/app/exercise/[exercise_type]/edit/[exercise_id]/EditExerciseForm";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  requireLoggedInUser,
  getSupabaseClient,
  requirePreferences,
} from "@/serverUtil";
import {
  exerciseTypeUIStringBrief,
  exerciseTypeUIStringLong,
} from "@/uiStrings";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ExerciseType } from "@/common-types";

interface EditExercisePageProps {
  exercise_id: string;
  exercise_type: ExerciseType;
}

const EditExercisePage = async (props: EditExercisePageProps) => {
  const { exercise_id, exercise_type } = props;
  const { userId: user_id } = await requireLoggedInUser(
    `/exercise/${exercise_type}/edit/${exercise_id}`
  );
  const supabase = getSupabaseClient();

  const [userPreferences, { data: exercise, error: exerciseError }] =
    await Promise.all([
      requirePreferences(
        user_id,
        ["available_plates_lbs"],
        `/exercise/${exercise_type}/edit/${exercise_id}`
      ),
      supabase.rpc("get_exercise_for_user", {
        p_user_id: user_id,
        p_exercise_id: exercise_id,
      }),
    ]);

  if (exerciseError) {
    throw new Error(exerciseError.message);
  }
  // TODO - this could use some work. My stored proc doesn't really work right here type-wise.
  if (!exercise.exercise_id) notFound();

  return (
    <Stack>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
        Edit {exerciseTypeUIStringLong(exercise_type)}
      </Typography>
      <EditExerciseForm
        availablePlates={userPreferences.available_plates_lbs}
        exercise={exercise}
        user_id={user_id}
      />
    </Stack>
  );
};

interface SuspenseWrapperProps {
  // TODO I think I need search params here too.
  params: Promise<{
    exercise_id: string;
    exercise_type: ExerciseType;
  }>;
}

export default async function SuspenseWrapper(props: SuspenseWrapperProps) {
  const { exercise_id, exercise_type } = await props.params;

  return (
    <Stack>
      <Breadcrumbs
        pathname={`/exercise/${exercise_type}/edit/${exercise_id}`}
        labels={{
          [exercise_id]: `(${exercise_id.slice(0, 8)})`,
          edit: "Edit",
          [exercise_type]: exerciseTypeUIStringBrief(exercise_type),
        }}
        nonLinkable={["edit"]}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <EditExercisePage
          exercise_id={exercise_id}
          exercise_type={exercise_type}
        />
      </Suspense>
    </Stack>
  );
}
