import AddDumbbellExercise from "@/app/exercise/[equipment_type]/[exercise_type]/_components/AddDumbbellExercise";
import {
  getExercisesByType,
  getFormDraft,
  narrowDumbbellFormDraft,
} from "@/app/exercise/[equipment_type]/[exercise_type]/_components/common";
import EquipmentExercisesTable from "@/app/exercise/[equipment_type]/[exercise_type]/_components/EquipmentExercisesTable";
import { EquipmentType, ExerciseType } from "@/common-types";
import { pathForEquipmentExercisePage } from "@/constants";
import { requirePreferences } from "@/serverUtil";
import { Stack } from "@mui/material";
import React from "react";

export interface DumbbellExercisePageProps {
  userId: string;
  equipmentType: EquipmentType;
  exerciseType: ExerciseType;
  path: string;
  pageNumber: number;
}

const DumbbellExercisePage: React.FC<DumbbellExercisePageProps> = async (
  props,
) => {
  const [exercisesResult, formDraft, preferences] = await Promise.all([
    getExercisesByType(props),
    getFormDraft(props, narrowDumbbellFormDraft),
    requirePreferences(props.userId, ["available_dumbbells_lbs"], props.path),
  ]);
  const { rows, pageCount } = exercisesResult;

  const path = pathForEquipmentExercisePage(
    props.equipmentType,
    props.exerciseType,
  );

  return (
    <React.Fragment>
      <Stack spacing={1}>
        <AddDumbbellExercise
          exerciseType={props.exerciseType}
          initialDumbbellFormDraft={formDraft}
          availableDumbbells={preferences.available_dumbbells_lbs}
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
        pageCount={pageCount!}
      />
    </React.Fragment>
  );
};

export default DumbbellExercisePage;
