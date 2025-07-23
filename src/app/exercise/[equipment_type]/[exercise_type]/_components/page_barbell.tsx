import AddBarbellExercise from "@/app/exercise/[equipment_type]/[exercise_type]/_components/AddBarbellExercise";
import {
  getExercisesByType,
  getFormDraft,
  narrowBarbellFormDraft,
} from "@/app/exercise/[equipment_type]/[exercise_type]/_components/common";
import EquipmentExercisesTable from "@/app/exercise/[equipment_type]/[exercise_type]/_components/EquipmentExercisesTable";
import { EquipmentType, ExerciseType } from "@/common-types";
import { pathForEquipmentExercisePage } from "@/constants";
import { requirePreferences } from "@/serverUtil";
import { Stack } from "@mui/material";
import React from "react";

export interface BarbellExercisePageProps {
  userId: string;
  equipmentType: EquipmentType;
  exerciseType: ExerciseType;
  path: string;
  pageNumber: number;
}

const BarbellExercisePage: React.FC<BarbellExercisePageProps> = async (
  props,
) => {
  const [exercisesResult, formDraft, preferences] = await Promise.all([
    getExercisesByType(props),
    getFormDraft(props, narrowBarbellFormDraft),
    requirePreferences(props.userId, ["available_plates_lbs"], props.path),
  ]);
  const { rows, pageCount } = exercisesResult;

  const path = pathForEquipmentExercisePage(
    props.equipmentType,
    props.exerciseType,
  );

  return (
    <React.Fragment>
      <Stack spacing={1}>
        <AddBarbellExercise
          exerciseType={props.exerciseType}
          initialBarbellFormDraft={formDraft}
          availablePlatesLbs={preferences.available_plates_lbs}
          path={props.path}
          userId={props.userId}
        />
      </Stack>
      <EquipmentExercisesTable
        exercises={rows}
        equipmentType={props.equipmentType}
        exerciseType={props.exerciseType}
        path={path}
        pageNum={props.pageNumber}
        pageCount={pageCount}
      />
    </React.Fragment>
  );
};

export default BarbellExercisePage;
