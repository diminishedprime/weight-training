import { ExerciseType } from "@/common-types";
import {
  requireLoggedInUser,
  requirePreferences,
  supabaseRPC,
} from "@/serverUtil";
import { exerciseTypeUIStringLong } from "@/uiStrings";
import { Stack, Typography } from "@mui/material";
import EditExerciseForm from "@/app/exercise/[exercise_type]/edit/[exercise_id]/_components/EditExerciseForm";
import { requiredKeys } from "@/util";

interface EditExercisePageProps {
  exercise_id: string;
  exercise_type: ExerciseType;
}

export default async function EditExercisePage(props: EditExercisePageProps) {
  const { exercise_id, exercise_type } = props;
  const { userId: user_id } = await requireLoggedInUser(
    `/exercise/${exercise_type}/edit/${exercise_id}`
  );

  const [userPreferences, exercise] = await Promise.all([
    requirePreferences(
      user_id,
      // This is a bit janky, but it works for now. We also need to have this
      // be either specific per equipment type, or handle the nullability.
      ["available_plates_lbs", "available_dumbbells_lbs"],
      `/exercise/${exercise_type}/edit/${exercise_id}`
    ),
    supabaseRPC("get_exercise_for_user", {
      p_user_id: user_id,
      p_exercise_id: exercise_id,
    }).then((a) => requiredKeys(a, ["exercise_id"])),
  ]);

  return (
    <Stack>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
        Edit {exerciseTypeUIStringLong(exercise_type)}
      </Typography>
      <EditExerciseForm
        availablePlates={userPreferences.available_plates_lbs}
        availableDumbbells={userPreferences.available_dumbbells_lbs}
        exercise={exercise}
        user_id={user_id}
      />
    </Stack>
  );
}
