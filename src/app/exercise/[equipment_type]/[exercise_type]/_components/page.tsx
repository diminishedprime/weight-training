import AddEquipmentExercise from "@/app/exercise/[equipment_type]/[exercise_type]/_components/AddEquipmentExercise";
import EquipmentExercisesTable from "@/app/exercise/[equipment_type]/[exercise_type]/_components/EquipmentExercisesTable";
import {
  CompletionStatus,
  EquipmentType,
  ExerciseType,
  PerceivedEffort,
  RequiredNonNullable,
  RoundingMode,
  WeightUnit,
} from "@/common-types";
import { pathForEquipmentExercisePage } from "@/constants";
import { Json } from "@/database.types";
import { requirePreferences, supabaseRPC } from "@/serverUtil";
import { Stack } from "@mui/material";
import React from "react";

export interface EquipmentExercisePageProps {
  userId: string;
  equipmentType: EquipmentType;
  exerciseType: ExerciseType;
  path: string;
  pageNumber: number;
}

const EquipmentExercisePage: React.FC<EquipmentExercisePageProps> = async (
  props,
) => {
  let formDraftPromise, requirePreferencesPromise;
  switch (props.equipmentType) {
    case "barbell":
      formDraftPromise = getFormDraft(props, narrowBarbellFormDraft);
      requirePreferencesPromise = requirePreferences(
        props.userId,
        ["available_plates_lbs"],
        props.path,
      );
      break;
    case "dumbbell":
      formDraftPromise = getFormDraft(props, narrowDumbbellFormDraft);
      requirePreferencesPromise = requirePreferences(
        props.userId,
        ["available_dumbbells_lbs"],
        props.path,
      );
      break;
    case "machine":
      // I think teh narrowing stuff is unnecessary.
      formDraftPromise = getFormDraft(props, narrowDumbbellFormDraft);
      requirePreferencesPromise = requirePreferences(
        props.userId,
        [],
        props.path,
      );
      break;
    case "kettlebell":
      formDraftPromise = getFormDraft(props, narrowDumbbellFormDraft);
      requirePreferencesPromise = requirePreferences(
        props.userId,
        ["available_kettlebells_lbs"],
        props.path,
      );
      break;
    case "plate_stack":
      formDraftPromise = getFormDraft(props, narrowDumbbellFormDraft);
      requirePreferencesPromise = requirePreferences(
        props.userId,
        ["available_plates_lbs"],
        props.path,
      );
      break;
    case "bodyweight":
      formDraftPromise = getFormDraft(props, narrowDumbbellFormDraft);
      requirePreferencesPromise = requirePreferences(
        props.userId,
        [],
        props.path,
      );
      break;
    default:
      // TODO use the never typescript thing here
      throw new Error("unsupported equipment type");
  }
  const [exercisesResult, formDraft, preferences] = await Promise.all([
    getExercisesByType(props),
    formDraftPromise,
    requirePreferencesPromise,
  ]);
  const { rows, pageCount } = exercisesResult;

  const path = pathForEquipmentExercisePage(
    props.equipmentType,
    props.exerciseType,
  );

  return (
    <React.Fragment>
      <Stack spacing={1}>
        <AddEquipmentExercise
          exerciseType={props.exerciseType}
          path={props.path}
          userId={props.userId}
          equipmentType={props.equipmentType}
          initialDraft={formDraft}
          preferences={preferences}
        />
      </Stack>
      <EquipmentExercisesTable
        exercises={rows}
        equipmentType={props.equipmentType}
        exerciseType={props.exerciseType}
        currentPath={path}
        pageNum={props.pageNumber}
        pageCount={pageCount!}
      />
    </React.Fragment>
  );
};

export default EquipmentExercisePage;

// TODO: Update this to have a lag such that it can have the performed_at of
// the previous exercise to use in better display logic.
export const getExercisesByType = async (props: {
  userId: string;
  exerciseType: ExerciseType;
  pageNumber: number;
}) => {
  const exercises = await supabaseRPC("get_exercises_by_type", {
    p_user_id: props.userId,
    p_exercise_type: props.exerciseType,
    p_page_num: props.pageNumber,
  });
  const { rows, page_count } = exercises;
  type RowsType = RequiredNonNullable<
    NonNullable<typeof rows>[number],
    | "equipment_type"
    | "exercise_type"
    | "performed_at"
    | "actual_weight_value"
    | "weight_unit"
    | "personal_record"
    | "completion_status"
  >;
  return {
    rows: rows as RowsType[],
    pageCount: page_count as NonNullable<typeof page_count>,
  };
};

async function getFormDraft<NarrowedDraftType>(
  props: { userId: string; path: string },
  narrowDraft: (draft: Json | null) => NarrowedDraftType,
): Promise<NarrowedDraftType> {
  const formDraft = await supabaseRPC("get_form_draft", {
    p_user_id: props.userId,
    p_page_path: props.path,
  });
  return narrowDraft(formDraft);
}

export interface CommonFormDraft {
  equipmentType: EquipmentType;
  exerciseType: ExerciseType;
  actualWeightValue: number;
  weightUnit: WeightUnit;
  roundingMode: RoundingMode;
  reps: number;
  completionStatus: CompletionStatus;
  notes: string;
  perceivedEffort: PerceivedEffort | null;
  isWarmup: boolean;
  isAMRAP: boolean;
}

export interface DumbbellFormDraft extends CommonFormDraft {
  _dumbbellMarker: "dumbbellFormDraft";
}
export const narrowDumbbellFormDraft = (formDraft: Json | null) => {
  if (formDraft === null) {
    return formDraft;
  }
  // TODO - actually put some checks in here.
  return formDraft as never as DumbbellFormDraft;
};

export interface BarbellFormDraft extends CommonFormDraft {
  _barbellMarker: "barbellFormDraft";
  barWeightValue: number;
}

export const narrowBarbellFormDraft = (formDraft: Json | null) => {
  if (formDraft === null) {
    return formDraft;
  }
  // TODO - actually put some checks in here.
  return formDraft as never as BarbellFormDraft;
};
