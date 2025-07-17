import {
  CompletionStatus,
  ExerciseType,
  PercievedEffort,
  WeightUnit,
} from "@/common-types";
import SetTargetMax from "@/components/SetTargetMax";
import { WENDLER_EXERCISE_TYPES } from "@/constants";
import {
  getSupabaseClient,
  requireLoggedInUser,
  requirePreferences,
  supabaseRPC,
} from "@/serverUtil";
import { exerciseTypeUIStringLong } from "@/uiStrings";
import { equipmentForExercise, VALID_BARBELL_FORM_DRAFT_PATHS } from "@/util";
import { Stack, Typography } from "@mui/material";
import ExercisesTables from "@/app/exercise/[exercise_type]/_components/ExercisesTables";
import AddExercise from "@/app/exercise/[exercise_type]/_components/AddExercise";

// TODO: This file is named so stupid because nextjs won't let me do export
// default blah and also export const from a page. This probably makes sense,
// but isn't the pattern I want to use since my page is almost always a suspense
// warpper with barely any logic. There's probably a better way fundamentally to
// handle the suspense stuff but I looked and didn't find it right away and I
// want to keep making progress.

export interface BarbellFormDraft {
  totalWeight: number;
  weightUnit: WeightUnit;
  reps: number;
  effort: PercievedEffort | null;
  warmup: boolean;
  completionStatus: CompletionStatus;
  notes: string;
}

export function isBarbellFormDraftPath(path: string): boolean {
  return VALID_BARBELL_FORM_DRAFT_PATHS.has(path);
}

export async function getBarbellFormDraft(
  userId: string,
  path: string
): Promise<BarbellFormDraft | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.rpc("get_form_draft", {
    p_user_id: userId,
    p_form_type: path,
  });

  if (error) {
    throw new Error(`Failed to get form draft: ${error.message}`);
  }

  return data as BarbellFormDraft | null;
}

interface ExerciseTypePageProps {
  exerciseType: ExerciseType;
  currentPath: string;
}

export const ExerciseTypePage = async (props: ExerciseTypePageProps) => {
  const { exerciseType, currentPath } = props;
  const equipmentType = equipmentForExercise(exerciseType);

  const { userId } = await requireLoggedInUser(currentPath);

  // Only show the target max input for Wendler exercises.
  const showTargetMax = WENDLER_EXERCISE_TYPES.includes(exerciseType);

  let barbellFormDraft: BarbellFormDraft | null = null;
  const [formDraft, preferences, exercises] = await Promise.all([
    isBarbellFormDraftPath(currentPath)
      ? getBarbellFormDraft(userId, currentPath)
      : null,
    requirePreferences(userId, ["available_plates"], currentPath),
    supabaseRPC("get_exercises_by_type_for_user", {
      p_user_id: userId,
      p_exercise_type: exerciseType,
    }),
  ]);
  barbellFormDraft = formDraft;

  const lifts = exercises || [];

  return (
    <Stack
      direction="column"
      spacing={1}
      data-testid="exercise-page"
      alignItems="flex-start"
      sx={{ width: "100%" }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {exerciseTypeUIStringLong(exerciseType)}
      </Typography>
      {showTargetMax && (
        <SetTargetMax
          userId={userId}
          exerciseType={exerciseType}
          pathToRevalidate={currentPath}
        />
      )}
      <AddExercise
        userId={userId}
        equipmentType={equipmentType}
        exerciseType={exerciseType}
        pathToRevalidate={currentPath}
        availablePlates={preferences.available_plates}
        barbellFormDraft={barbellFormDraft}
      />
      <ExercisesTables
        availablePlates={preferences.available_plates}
        exercises={lifts}
        exercise_type={exerciseType}
      />
    </Stack>
  );
};
