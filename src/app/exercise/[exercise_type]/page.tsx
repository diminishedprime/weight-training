import { Constants } from "@/database.types";
import { notFound } from "next/navigation";
import { exerciseTypeUIStringBrief } from "@/uiStrings";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Suspense } from "react";
import { ExerciseType } from "@/common-types";
import ExerciseTypePage from "@/app/exercise/[exercise_type]/_page";

interface SuspenseWrapperProps {
  params: Promise<{ exercise_type: string }>;
}

export default async function SuspenseWrapper(props: SuspenseWrapperProps) {
  const { exercise_type: unnarrowedExerciseType } = await props.params;

  // Validate exercise type for breadcrumbs
  if (
    Constants.public.Enums.exercise_type_enum.find(
      (a) => a === unnarrowedExerciseType
    ) === undefined
  ) {
    return notFound();
  }

  const exerciseType = unnarrowedExerciseType as ExerciseType;
  const currentPath = `/exercise/${exerciseType}`;

  return (
    <>
      <Breadcrumbs
        pathname={currentPath}
        labels={{
          [exerciseType]: exerciseTypeUIStringBrief(exerciseType),
        }}
        nonLinkable={["edit"]}
      />
      <Suspense fallback={<div>Loading exercises...</div>}>
        <ExerciseTypePage
          exerciseType={exerciseType}
          currentPath={currentPath}
        />
      </Suspense>
    </>
  );
}
