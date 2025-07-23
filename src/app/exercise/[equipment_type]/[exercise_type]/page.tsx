import EquipmentExercisePage from "@/app/exercise/[equipment_type]/[exercise_type]/_components/page";
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
import React, { Suspense } from "react";

interface EquipmentExercisePageSuspenseWrapperProps {
  params: Promise<{ equipment_type: string; exercise_type: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EquipmentExercisePageSuspenseWrapper(
  props: EquipmentExercisePageSuspenseWrapperProps,
) {
  const [params, searchParams] = await Promise.all([
    props.params.then(narrowParams),
    props.searchParams.then(parseSearchParams),
  ]);

  const { equipmentType, exerciseType } = params;
  const { pageNum } = searchParams;

  const exerciseData = EQUIPMENT_EXERCISES_DATA[equipmentType][exerciseType];

  // This would be cleaner if next supported seeing the full slug in the url so
  // we could do this as one of the Promise.alls, but it doesn't so we have to
  // do this as a separate call.
  const { userId } = await requireLoggedInUser(exerciseData.path);

  return (
    <React.Fragment>
      <Breadcrumbs {...exerciseData.breadcrumbs} />
      <Suspense fallback={<div>Loading...</div>}>
        {/* {EquipmentExercisePage} */}
        <EquipmentExercisePage
          userId={userId}
          equipmentType={equipmentType}
          exerciseType={exerciseType}
          path={exerciseData.path}
          pageNumber={pageNum}
        />
      </Suspense>
    </React.Fragment>
  );
}

// Utility functions, etc.

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

// Function to narrow the equipment_type and exercise_type to make sure they are
// valid, or return a 404 otherwise.
const narrowParams = ({
  equipment_type,
  exercise_type,
}: {
  equipment_type: string;
  exercise_type: string;
}) => ({
  equipmentType: narrowOrNotFound(equipment_type, narrowEquipmentType),
  exerciseType: narrowOrNotFound(exercise_type, narrowExerciseType),
});

const parseSearchParams = (
  searchParams: Awaited<
    EquipmentExercisePageSuspenseWrapperProps["searchParams"]
  >,
) => ({
  pageNum: Number(searchParams.page_num) || FIRST_PAGE_NUM,
  startExerciseId: searchParams.start_exercise_id?.toString(),
});
