import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Constants, Database } from "@/database.types";
import { requireLoggedInUser } from "@/serverUtil";
import { notFound } from "next/navigation";
import { addRandomLiftAction } from "@/app/exercise/[exercise_type]/_components/AddRandomLift/actions";
import AddRandomLift from "@/app/exercise/[exercise_type]/_components/AddRandomLift";
import ExercisesTableWrapper from "@/app/exercise/[exercise_type]/_components/ExercisesTableWrapper";
import { Suspense } from "react";
import {
  exerciseTypeUIStringBrief,
  exerciseTypeUIStringLong,
} from "@/uiStrings";
import Breadcrumbs from "@/components/Breadcrumbs";
import SetTargetMax from "@/components/SetTargetMax";

export default async function Home({
  params,
}: {
  params: Promise<{ exercise_type: string }>;
}) {
  const { exercise_type: unnarrowed_lift_type } = await params;

  if (
    Constants.public.Enums.exercise_type_enum.find(
      (a) => a === unnarrowed_lift_type,
    ) === undefined
  ) {
    return notFound();
  }

  // Use a local alias for the enum type
  type ExerciseType = Database["public"]["Enums"]["exercise_type_enum"];
  const exercise_type = unnarrowed_lift_type as ExerciseType;

  const currentPath = `/exercise/${exercise_type}`;

  // Require user authentication
  const { userId } = await requireLoggedInUser(`/exercise/${exercise_type}`);

  // Sentinel values for main lifts (use enum string values from Constants)
  const mainLifts: ExerciseType[] = [
    "barbell_overhead_press",
    "barbell_bench_press",
    "barbell_back_squat",
    "barbell_deadlift",
  ];

  const showTargetMax = mainLifts.includes(exercise_type);

  return (
    <>
      <Breadcrumbs
        pathname={currentPath}
        labels={{
          [exercise_type]: exerciseTypeUIStringBrief(exercise_type),
        }}
        nonLinkable={["edit"]}
      />
      <Stack spacing={2}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          {exerciseTypeUIStringLong(exercise_type)}
        </Typography>
        {showTargetMax && (
          <SetTargetMax
            userId={userId}
            exerciseType={exercise_type}
            pathToRevalidate={currentPath}
          />
        )}
        <AddRandomLift
          addRandomLift={addRandomLiftAction.bind(null, exercise_type)}
        />
        <Suspense fallback={<div>Loading lifts...</div>}>
          <ExercisesTableWrapper userId={userId} lift_type={exercise_type} />
        </Suspense>
      </Stack>
    </>
  );
}
