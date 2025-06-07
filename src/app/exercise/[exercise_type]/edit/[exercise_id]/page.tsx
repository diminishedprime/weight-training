import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { Suspense } from "react";
import EditExerciseForm from "./EditExerciseForm";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Database } from "@/database.types";
import { getSupabaseClient, requireId } from "@/util";
import {
  exerciseTypeUIStringBrief,
  exerciseTypeUIStringLong,
} from "@/uiStrings";
import Breadcrumbs from "@/components/Breadcrumbs";

export default async function EditExercisePage({
  params,
}: {
  params: Promise<{
    exercise_id: string;
    exercise_type: Database["public"]["Enums"]["exercise_type_enum"];
  }>;
}) {
  const [session, { exercise_id, exercise_type }] = await Promise.all([
    auth(),
    params,
  ]);
  const user_id = requireId(
    session,
    `/exercise/${exercise_type}/edit/${exercise_id}`
  );

  const supabase = getSupabaseClient();
  const { data: exercise, error } = await supabase.rpc(
    "get_exercise_for_user",
    {
      p_user_id: user_id,
      p_exercise_id: exercise_id,
    }
  );
  if (error) throw new Error(error.message);
  // TODO - this could use some work. My stored proc doesn't really work right here type-wise.
  if (!exercise.exercise_id) notFound();

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
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
        Edit {exerciseTypeUIStringLong(exercise_type)}
      </Typography>
      <Suspense fallback={<div>Loading...</div>}>
        <EditExerciseForm exercise={exercise} user_id={user_id} />
      </Suspense>
    </Stack>
  );
}
