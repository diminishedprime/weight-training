import BarbellExerciseEditPage from "@/app/exercise/[equipment_type]/[exercise_type]/edit/[exercise_id]/_page_barbell";
import Breadcrumbs, { BreadcrumbsProps } from "@/components/Breadcrumbs";
import { pathForEquipmentExerciseEdit } from "@/constants";
import { requireLoggedInUser } from "@/serverUtil";
import { equipmentTypeUIString, exerciseTypeUIStringBrief } from "@/uiStrings";
import {
  narrowEquipmentType,
  narrowExerciseType,
  narrowOrNotFound,
} from "@/util";
import { Typography } from "@mui/material";
import React, { Suspense } from "react";

interface EquipmentExerciseEditPageSuspenseWrapperProps {
  params: Promise<{
    equipment_type: string;
    exercise_type: string;
    exercise_id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EquipmentExerciseEditPageSuspenseWrapper(
  props: EquipmentExerciseEditPageSuspenseWrapperProps,
) {
  const [
    {
      equipment_type: unnarrowedEquipmentType,
      exercise_type: unnarrowedExerciseType,
      exercise_id,
    },
    searchParams,
  ] = await Promise.all([props.params, props.searchParams]);

  const equipmentType = narrowOrNotFound(
    unnarrowedEquipmentType,
    narrowEquipmentType,
  );

  const exerciseType = narrowOrNotFound(
    unnarrowedExerciseType,
    narrowExerciseType,
  );

  const currentPath = pathForEquipmentExerciseEdit(
    equipmentType,
    exerciseType,
    exercise_id,
  );
  const { userId } = await requireLoggedInUser(currentPath);

  let EquipmentExerciseEditPage: React.JSX.Element;
  switch (equipmentType) {
    case "barbell":
      EquipmentExerciseEditPage = (
        <BarbellExerciseEditPage
          barbellExerciseType={exerciseType}
          path={currentPath}
          userId={userId}
          exerciseId={exercise_id}
          backTo={searchParams.backTo?.toString() || undefined}
        />
      );
      break;
    default:
      EquipmentExerciseEditPage = <Typography>Not yet implemented</Typography>;
  }

  const breadcrumbsProps: BreadcrumbsProps = {
    pathname: pathForEquipmentExerciseEdit(
      equipmentType,
      exerciseType,
      exercise_id,
    ),
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
        {EquipmentExerciseEditPage}
      </Suspense>
    </React.Fragment>
  );
}
