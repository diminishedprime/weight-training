import React, { Suspense } from "react";
import Breadcrumbs, { BreadcrumbsProps } from "@/components/Breadcrumbs";
import { EquipmentType, ExerciseType } from "@/common-types";
import { equipmentForExercise, narrowOrNotFound } from "@/util";
import BarbellExercisePage from "@/app/exercise/barbell/[barbell_exercise_type]/_page";
import { Constants } from "@/database.types";
import { exerciseTypeUIStringBrief } from "@/uiStrings";
import { requireLoggedInUser } from "@/serverUtil";
import { FIRST_PAGE_NUM, pathForBarbellExercisePage } from "@/constants";

interface BarbellExercisePageSuspenseWrapperProps {
  params: Promise<{ barbell_exercise_type: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BarbellExercisePageSuspenseWrapper(
  props: BarbellExercisePageSuspenseWrapperProps
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
    pathname: pathForBarbellExercisePage(barbellExerciseType),
    labels: {
      [barbellExerciseType]: exerciseTypeUIStringBrief(barbellExerciseType),
    },
    nonLinkable: [],
  };

  const { userId } = await requireLoggedInUser(breadcrumbsProps.pathname);

  // Parse new pagination params
  const pageNumRaw = searchParams.page_num;
  const startExerciseId = searchParams.start_exercise_id;
  const pageNum = pageNumRaw ? Number(pageNumRaw) : FIRST_PAGE_NUM;
  if (typeof startExerciseId !== "string" && !!startExerciseId) {
    throw new Error("start_exercise_id must be a string");
  }

  return (
    <React.Fragment>
      <Breadcrumbs {...breadcrumbsProps} />
      <Suspense fallback={<div>Loading...</div>}>
        <BarbellExercisePage
          barbellExerciseType={barbellExerciseType}
          path={breadcrumbsProps.pathname}
          userId={userId}
          pageNum={pageNum}
          startExerciseId={
            typeof startExerciseId === "string" ? startExerciseId : undefined
          }
        />
      </Suspense>
    </React.Fragment>
  );
}
