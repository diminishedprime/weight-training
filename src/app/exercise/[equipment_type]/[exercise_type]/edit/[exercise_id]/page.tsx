import EditEquipmentExercisePage from "@/app/exercise/[equipment_type]/[exercise_type]/edit/[exercise_id]/_components/EditEquipmentExercisePage";
import Breadcrumbs, { BreadcrumbsProps } from "@/components/Breadcrumbs";
import { PARAMS, pathForEquipmentExerciseEdit } from "@/constants";
import { requireLoggedInUser } from "@/serverUtil";
import { equipmentTypeUIString, exerciseTypeUIStringBrief } from "@/uiStrings";
import {
  narrowEquipmentType,
  narrowExerciseType,
  narrowOrNotFound,
} from "@/util";
import React, { Suspense } from "react";

interface Props {
  params: Promise<{
    equipment_type: string;
    exercise_type: string;
    exercise_id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EquipmentExerciseEditPageSuspenseWrapper(
  props: Props,
) {
  const [params, searchParams] = await Promise.all([
    props.params.then(narrowParams),
    props.searchParams.then(parseSearchParams),
  ]);

  const { equipmentType, exerciseType, exercise_id } = params;
  const { backTo } = searchParams;

  const currentPath = pathForEquipmentExerciseEdit(
    equipmentType,
    exerciseType,
    exercise_id,
  );
  const { userId } = await requireLoggedInUser(currentPath);

  const breadcrumbsProps: BreadcrumbsProps = {
    pathname: currentPath,
    labels: {
      [equipmentType]: equipmentTypeUIString(equipmentType),
      [exerciseType]: exerciseTypeUIStringBrief(exerciseType),
      [exercise_id]: `(${exercise_id.slice(0, 8)})`,
    },
    nonLinkable: ["edit", exercise_id],
  };

  return (
    <React.Fragment>
      <Breadcrumbs {...breadcrumbsProps} />
      <Suspense fallback={<div>Loading...</div>}>
        <EditEquipmentExercisePage
          equipmentType={equipmentType}
          exerciseType={exerciseType}
          userId={userId}
          exerciseId={exercise_id}
          currentPath={currentPath}
          backTo={backTo}
        />
      </Suspense>
    </React.Fragment>
  );
}

const narrowParams = ({
  equipment_type,
  exercise_type,
  ...rest
}: Awaited<Props["params"]>) => ({
  equipmentType: narrowOrNotFound(equipment_type, narrowEquipmentType),
  exerciseType: narrowOrNotFound(exercise_type, narrowExerciseType),
  ...rest,
});

const parseSearchParams = (searchParams: Awaited<Props["searchParams"]>) => ({
  backTo: searchParams[PARAMS.BackTo]?.toString(),
});
