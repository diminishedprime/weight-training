import BarbellExercisePage from "@/app/exercise/[equipment_type]/[exercise_type]/_page_barbell";
import { EquipmentType, ExerciseType } from "@/common-types";
import Breadcrumbs, { BreadcrumbsProps } from "@/components/Breadcrumbs";
import { FIRST_PAGE_NUM, pathForEquipmentExercisePage } from "@/constants";
import { requireLoggedInUser } from "@/serverUtil";
import { exerciseTypeUIStringBrief } from "@/uiStrings";
import {
  EXERCISES_BY_EQUIPMENT,
  narrowEquipmentType,
  narrowExerciseType,
  narrowOrNotFound,
} from "@/util";
import { Typography } from "@mui/material";
import React, { Suspense } from "react";

interface EquipmentExercisesData {
  [equipmentType: string]: ExercisesData;
}

interface ExercisesData {
  [exerciseType: string]: ExerciseData;
}

interface ExerciseData {
  breadcrumbs: BreadcrumbsProps;
  path: string;
}

const EQUIPMENT_EXERCISES_DATA = Object.entries(EXERCISES_BY_EQUIPMENT).reduce(
  (acc, [equipmentType, exercises]) => ({
    ...acc,
    [equipmentType]: exercises.reduce(
      (acc, exercise) => ({
        ...acc,
        [exercise]: {
          path: pathForEquipmentExercisePage(
            equipmentType as EquipmentType,
            exercise as ExerciseType,
          ),
          breadcrumbs: {
            pathname: pathForEquipmentExercisePage(
              equipmentType as EquipmentType,
              exercise as ExerciseType,
            ),
            labels: {
              [exercise]: exerciseTypeUIStringBrief(exercise as ExerciseType),
            },
            nonLinkable: [],
          },
        },
      }),
      {} as ExercisesData,
    ),
  }),
  {} as EquipmentExercisesData,
);

interface EquipmentExercisePageSuspenseWrapperProps {
  params: Promise<{ equipment_type: string; exercise_type: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EquipmentExercisePageSuspenseWrapper(
  props: EquipmentExercisePageSuspenseWrapperProps,
) {
  const [
    {
      equipment_type: unnarrowedEquipmentType,
      exercise_type: unnarrowedExerciseType,
    },
    searchParams,
  ] = await Promise.all([props.params, props.searchParams]);

  const equipmentType = narrowOrNotFound(
    unnarrowedEquipmentType,
    narrowEquipmentType,
  );

  // Ensure the exercise type is valid.
  const exerciseType = narrowOrNotFound(
    unnarrowedExerciseType,
    narrowExerciseType,
  );

  const exerciseData = EQUIPMENT_EXERCISES_DATA[equipmentType][exerciseType];

  const { userId } = await requireLoggedInUser(exerciseData.path);

  // Parse new pagination params
  const pageNumRaw = searchParams.page_num;
  const startExerciseId = searchParams.start_exercise_id;
  const pageNum = pageNumRaw ? Number(pageNumRaw) : FIRST_PAGE_NUM;
  if (typeof startExerciseId !== "string" && !!startExerciseId) {
    throw new Error("start_exercise_id must be a string");
  }

  let EquipmentExercisePage: React.JSX.Element;
  switch (equipmentType) {
    case "barbell":
      EquipmentExercisePage = (
        <BarbellExercisePage
          barbellExerciseType={exerciseType}
          path={exerciseData.path}
          userId={userId}
          pageNum={pageNum}
          startExerciseId={
            typeof startExerciseId === "string" ? startExerciseId : undefined
          }
        />
      );
      break;
    default:
      EquipmentExercisePage = <Typography>Not yet implemented</Typography>;
  }

  return (
    <React.Fragment>
      <Breadcrumbs {...exerciseData.breadcrumbs} />
      <Suspense fallback={<div>Loading...</div>}>
        {EquipmentExercisePage}
      </Suspense>
    </React.Fragment>
  );
}
