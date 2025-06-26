import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Constants, Database } from "@/database.types";
import { requireLoggedInUser } from "@/serverUtil";
import { notFound } from "next/navigation";
import { addRandomLiftAction } from "@/app/exercise/[exercise_type]/actions";
import AddRandomLiftButton from "@/app/exercise/[exercise_type]/AddRandomLiftButton";
import ExercisesTableWrapper from "@/app/exercise/[exercise_type]/ExercisesTableWrapper";
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

  const exercise_type =
    unnarrowed_lift_type as Database["public"]["Enums"]["exercise_type_enum"];

  const { userId } = await requireLoggedInUser(`/exercise/${exercise_type}`);

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
        <AddRandomLiftButton
          addRandomLift={addRandomLiftAction.bind(null, exercise_type)}
        />
        <Suspense fallback={<div>Loading lifts...</div>}>
          <ExercisesTableWrapper userId={userId} lift_type={exercise_type} />
        </Suspense>
      </Stack>
    </>
  );
}
