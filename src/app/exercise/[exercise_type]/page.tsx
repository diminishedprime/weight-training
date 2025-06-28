import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Constants, Database } from "@/database.types";
import { getSupabaseClient, requireLoggedInUser } from "@/serverUtil";
import { notFound } from "next/navigation";
import { addRandomLiftAction } from "@/app/exercise/[exercise_type]/_components/AddRandomLift/actions";
import AddRandomLift from "@/app/exercise/[exercise_type]/_components/AddRandomLift";
import ExercisesTableWrapper from "@/app/exercise/[exercise_type]/_components/ExercisesTableWrapper";
import SetTargetMax from "@/app/exercise/[exercise_type]/_components/SetTargetMax";
import { Suspense } from "react";
import {
  exerciseTypeUIStringBrief,
  exerciseTypeUIStringLong,
} from "@/uiStrings";
import Breadcrumbs from "@/components/Breadcrumbs";

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

  // TODO use the get_target_max call to fetch the existing target max.
  // TODO also update it to try and return the users one rep max if it exists
  // since we need to use it for a calculation.
  const supabase = getSupabaseClient();
  const { data: targetMaxData } = await supabase.rpc("get_target_max", {
    p_user_id: userId,
    p_exercise_type: exercise_type,
  });

  return (
    <>
      <Breadcrumbs
        pathname={`/exercise/${exercise_type}`}
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
            exerciseType={exercise_type}
            userId={userId}
            value={targetMaxData?.value?.toString() ?? null}
            unit={targetMaxData?.unit ?? null}
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
