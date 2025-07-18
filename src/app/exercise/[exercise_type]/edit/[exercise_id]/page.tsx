import { Suspense } from "react";
import Stack from "@mui/material/Stack";
import { exerciseTypeUIStringBrief } from "@/uiStrings";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ExerciseType } from "@/common-types";
import EditExercisePage from "@/app/exercise/[exercise_type]/edit/[exercise_id]/_page";

interface SuspenseWrapperProps {
  // TODO: I think I may need search params here too? Depends on how the backTo
  // is being handled.
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
