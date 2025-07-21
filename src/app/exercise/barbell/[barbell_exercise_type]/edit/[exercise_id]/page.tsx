import React, { Suspense } from "react";
import Breadcrumbs, { BreadcrumbsProps } from "@/components/Breadcrumbs";
import { EquipmentType, ExerciseType } from "@/common-types";
import { equipmentForExercise, narrowOrNotFound } from "@/util";
import { Constants } from "@/database.types";
import { exerciseTypeUIStringBrief } from "@/uiStrings";
import { requireLoggedInUser } from "@/serverUtil";
import { pathForBarbellExerciseEdit } from "@/constants";
import BarbellEditPage from "@/app/exercise/barbell/[barbell_exercise_type]/edit/[exercise_id]/_page";

interface BarbellExerciseEditPageSuspenseWrapperProps {
  params: Promise<{ barbell_exercise_type: string; exercise_id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BarbellExerciseEditPageSuspenseWrapper(
  props: BarbellExerciseEditPageSuspenseWrapperProps
) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);
  // Ensure the exercise type is valid.
  const exerciseType = narrowOrNotFound(
    params.barbell_exercise_type,
    (s: string): s is ExerciseType => {
      return Constants.public.Enums.exercise_type_enum.includes(
        s as ExerciseType
      );
    }
  );

  // Ensure the exercise type is specifically a barbell exercise.
  narrowOrNotFound(
    equipmentForExercise(exerciseType),
    (s: EquipmentType): s is "barbell" => {
      return s === "barbell";
    }
  );
  // Rename for clarity.
  const barbellExerciseType = exerciseType;

  const breadcrumbsProps: BreadcrumbsProps = {
    pathname: pathForBarbellExerciseEdit(
      barbellExerciseType,
      params.exercise_id
    ),
    labels: {
      [barbellExerciseType]: exerciseTypeUIStringBrief(barbellExerciseType),
      [params.exercise_id]: `(${params.exercise_id.slice(0, 8)})`,
    },
    nonLinkable: ["edit", params.exercise_id],
  };

  const { userId } = await requireLoggedInUser(breadcrumbsProps.pathname);

  return (
    <React.Fragment>
      <Breadcrumbs {...breadcrumbsProps} />
      <Suspense fallback={<div>Loading...</div>}>
        <BarbellEditPage
          barbellExerciseType={barbellExerciseType}
          path={breadcrumbsProps.pathname}
          userId={userId}
          exerciseId={params.exercise_id}
          backTo={searchParams.backTo?.toString() || undefined}
        />
      </Suspense>
    </React.Fragment>
  );
}
