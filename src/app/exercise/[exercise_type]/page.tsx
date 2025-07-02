import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Constants, Database } from "@/database.types";
import { requireLoggedInUser } from "@/serverUtil";
import { notFound } from "next/navigation";
import ExercisesTableWrapper from "@/app/exercise/[exercise_type]/_components/ExercisesTableWrapper";
import { Suspense } from "react";
import {
  exerciseTypeUIStringBrief,
  exerciseTypeUIStringLong,
} from "@/uiStrings";
import Breadcrumbs from "@/components/Breadcrumbs";
import SetTargetMax from "@/components/SetTargetMax";
import AddExercise from "@/app/exercise/[exercise_type]/_components/AddExercise";
import { equipmentForExercise } from "@/util";

export default async function Home({
  params,
}: {
  params: Promise<{ exercise_type: string }>;
}) {
  const { exercise_type: unnarrowedExerciseType } = await params;

  if (
    Constants.public.Enums.exercise_type_enum.find(
      (a) => a === unnarrowedExerciseType
    ) === undefined
  ) {
    return notFound();
  }

  // Use a local alias for the enum type
  type ExerciseType = Database["public"]["Enums"]["exercise_type_enum"];
  const exerciseType = unnarrowedExerciseType as ExerciseType;
  const equipmentType = equipmentForExercise(exerciseType);

  const currentPath = `/exercise/${exerciseType}`;

  // Require user authentication
  const { userId } = await requireLoggedInUser(`/exercise/${exerciseType}`);

  // Sentinel values for main lifts (use enum string values from Constants)
  const mainLifts: ExerciseType[] = [
    "barbell_overhead_press",
    "barbell_bench_press",
    "barbell_back_squat",
    "barbell_deadlift",
  ];

  const showTargetMax = mainLifts.includes(exerciseType);

  return (
    <>
      <Breadcrumbs
        pathname={currentPath}
        labels={{
          [exerciseType]: exerciseTypeUIStringBrief(exerciseType),
        }}
        nonLinkable={["edit"]}
      />
      <Stack direction="column" spacing={1} alignItems="flex-start">
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
        />
        <Suspense fallback={<div>Loading lifts...</div>}>
          <ExercisesTableWrapper userId={userId} lift_type={exerciseType} />
        </Suspense>
      </Stack>
    </>
  );
}
