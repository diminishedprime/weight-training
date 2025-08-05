import EquipmentExercisePage from "@/app/exercise/[equipment_type]/[exercise_type]/_components/page";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Paths } from "@/constants";
import {
  parseSearchParams,
  requireLoggedInUser,
  SEARCH_PARSERS,
} from "@/serverUtil";
import { equipmentTypeUIString, exerciseTypeUIStringBrief } from "@/uiStrings";
import {
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
    parseSearchParams(props.searchParams, SEARCH_PARSERS.PAGE_NUM),
  ]);

  const { equipmentType, exerciseType } = params;
  const { pageNum } = searchParams;

  const path = Paths.Exercise_EquipmentType_ExerciseType(
    equipmentType,
    exerciseType,
  );
  const { userId } = await requireLoggedInUser(path);

  return (
    <React.Fragment>
      <Breadcrumbs
        pathname={path}
        labels={{
          [equipmentType]: equipmentTypeUIString(equipmentType),
          [exerciseType]: exerciseTypeUIStringBrief(exerciseType),
        }}
      />
      <Suspense fallback={<div>Loading...</div>}>
        {/* {EquipmentExercisePage} */}
        <EquipmentExercisePage
          userId={userId}
          equipmentType={equipmentType}
          exerciseType={exerciseType}
          path={path}
          pageNumber={pageNum}
        />
      </Suspense>
    </React.Fragment>
  );
}

// Utility functions, etc.

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
