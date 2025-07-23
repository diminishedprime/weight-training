import {
  CompletionStatus,
  ExerciseType,
  PerceivedEffort,
  RequiredNonNullable,
  RoundingMode,
  WeightUnit,
} from "@/common-types";
import { Json } from "@/database.types";
import { supabaseRPC } from "@/serverUtil";

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

export const getFormDraft = async <NarrowedDraftType>(
  props: { userId: string; path: string },
  narrowDraft: (draft: Json | null) => NarrowedDraftType,
): Promise<NarrowedDraftType> => {
  const formDraft = await supabaseRPC("get_form_draft", {
    p_user_id: props.userId,
    p_page_path: props.path,
  });
  return narrowDraft(formDraft);
};

export interface DumbbellFormDraft {
  actualWeight: number;
  weightUnit: WeightUnit;
  roundingMode: RoundingMode;
  reps: number;
  completionStatus: CompletionStatus;
  notes: string | undefined;
  perceivedEffort: PerceivedEffort | undefined;
  isWarmup: boolean;
  isAmrap: boolean;
}
export const narrowDumbbellFormDraft = (formDraft: Json | null) => {
  if (formDraft === null) {
    return formDraft;
  }
  // TODO - actually put some checks in here.
  return formDraft as never as DumbbellFormDraft;
};

export interface BarbellFormDraft {
  actualWeight: number;
  barWeight: number;
  weightUnit: WeightUnit;
  roundingMode: RoundingMode;
  reps: number;
  completionStatus: CompletionStatus;
  notes: string | undefined;
  perceivedEffort: PerceivedEffort | undefined;
  isWarmup: boolean;
  isAmrap: boolean;
}

export const narrowBarbellFormDraft = (formDraft: Json | null) => {
  if (formDraft === null) {
    return formDraft;
  }
  // TODO - actually put some checks in here.
  return formDraft as never as BarbellFormDraft;
};
