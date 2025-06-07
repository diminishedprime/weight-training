import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Constants, Database } from "@/database.types";
import { auth } from "@/auth";
import { requireId } from "@/util";
import { notFound } from "next/navigation";
import { addRandomLiftAction } from "./actions";
import AddRandomLiftButton from "./AddRandomLiftButton";
import ExercisesTableWrapper from "./ExercisesTableWrapper";
import { Suspense } from "react";
import { exerciseTypeUIStringLong } from "@/uiStrings";

export default async function Home({
  params,
}: {
  params: Promise<{ exercise_type: string }>;
}) {
  const { exercise_type: unnarrowed_lift_type } = await params;

  if (
    Constants.public.Enums.exercise_type_enum.find(
      (a) => a === unnarrowed_lift_type
    ) === undefined
  ) {
    return notFound();
  }

  const exercise_type =
    unnarrowed_lift_type as Database["public"]["Enums"]["exercise_type_enum"];

  const session = await auth();
  const id = requireId(session, `/exercise/${exercise_type}`);

  return (
    <Stack spacing={2} sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {exerciseTypeUIStringLong(exercise_type)} Lifts
      </Typography>
      <AddRandomLiftButton
        addRandomLift={addRandomLiftAction.bind(null, exercise_type)}
      />
      <Suspense fallback={<div>Loading lifts...</div>}>
        <ExercisesTableWrapper userId={id} lift_type={exercise_type} />
      </Suspense>
    </Stack>
  );
}
