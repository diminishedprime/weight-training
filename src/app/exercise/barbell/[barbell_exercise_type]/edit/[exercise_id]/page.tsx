import React, { Suspense } from "react";
import Breadcrumbs, { BreadcrumbsProps } from "@/components/Breadcrumbs";
import { EquipmentType, ExerciseType } from "@/common-types";
import { equipmentForExercise, narrowOrNotFound } from "@/util";
import { Constants } from "@/database.types";
import { exerciseTypeUIStringBrief } from "@/uiStrings";
import { requireLoggedInUser } from "@/serverUtil";
import { pathForBarbellExerciseEdit } from "@/constants";

interface BarbellExerciseEditPageSuspenseWrapperProps {
  params: Promise<{ barbell_exercise_type: string; exercise_id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BarbellExerciseEditPageSuspenseWrapper(
  props: BarbellExerciseEditPageSuspenseWrapperProps
) {
  const [params, _searchParams] = await Promise.all([
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

  // TODO: easy I think. I have discovered my breadcrumbs are too long so I need
  // a way to do a "..." in the middle of it, I think.
  //
  // https://mui.com/material-ui/react-breadcrumbs/#condensed-with-menu
  //
  // Looks like it's supported, I just gotta do it.
  const breadcrumbsProps: BreadcrumbsProps = {
    pathname: pathForBarbellExerciseEdit(
      barbellExerciseType,
      params.exercise_id
    ),
    labels: {
      [barbellExerciseType]: exerciseTypeUIStringBrief(barbellExerciseType),
      [params.exercise_id]: `(${params.exercise_id.slice(0, 4)}...)`,
    },
    nonLinkable: ["edit"],
  };

  await requireLoggedInUser(breadcrumbsProps.pathname);

  return (
    <React.Fragment>
      <Breadcrumbs {...breadcrumbsProps} />
      <Suspense fallback={<div>Loading...</div>}>TODO!</Suspense>
    </React.Fragment>
  );
}
