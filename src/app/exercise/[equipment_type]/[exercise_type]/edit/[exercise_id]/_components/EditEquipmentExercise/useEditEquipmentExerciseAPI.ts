import { EditEquipmentExerciseProps } from "@/app/exercise/[equipment_type]/[exercise_type]/edit/[exercise_id]/_components/EditEquipmentExercise";
import { saveExerciseEdits } from "@/app/exercise/[equipment_type]/[exercise_type]/edit/[exercise_id]/_components/EditEquipmentExercise/actions";
import { GetExerciseResult, RoundingMode } from "@/common-types";
import { useCallback, useEffect, useMemo, useState } from "react";

export const useEditEquipmentExerciseAPI = (
  props: EditEquipmentExerciseProps,
) => {
  const { userId, currentPath, equipmentType, exerciseType, exercise, backTo } =
    props;

  const [actualWeightValue, localSetActualWeightValue] = useState(
    exercise.actual_weight_value ?? undefined,
  );
  const setActualWeightValue: React.Dispatch<React.SetStateAction<number>> =
    useCallback(
      (value) => {
        if (typeof value === "function") {
          localSetActualWeightValue((prev) => {
            if (prev === undefined) {
              throw new Error(
                "Invalid invariant: prev must not be undefined when using function to set actualWeightValue.",
              );
            }
            return value(prev!);
          });
        } else {
          localSetActualWeightValue(value);
        }
      },
      [localSetActualWeightValue],
    );
  //   // TODO: eventually roundingMode should be on the db, but it isn't, yet.
  //   const [roundingMode] = useState<RoundingMode>(
  //     exercise.roundingMode
  //   );
  const [roundingMode] = useState(RoundingMode.NEAREST);
  const [weightUnit, setWeightUnit] = useState(exercise.weight_unit);
  const [reps, setReps] = useState(exercise.reps);
  const [completionStatus, setCompletionStatus] = useState(
    exercise.completion_status,
  );
  const [notes, setNotes] = useState<string>(exercise.notes ?? "");
  const [perceivedEffort, setPerceivedEffort] = useState(
    exercise.perceived_effort,
  );
  const [isWarmup, setIsWarmup] = useState<boolean>(exercise.is_warmup);
  const [isAMRAP, setIsAMRAP] = useState<boolean>(exercise.is_amrap);
  const [performedAt, setPerformedAt] = useState(exercise.performed_at);
  // TODO: eventually this should also come from the db.
  const [barWeightValue] = useState(45);

  // Sync the current state when the initial values change, this is needed
  // because we use revalidatePath and otherwise the state values would never
  // update when the initialDraft changes on the server.
  useEffect(() => {
    if (exercise) {
      setActualWeightValue(
        exercise.actual_weight_value ?? exercise.target_weight_value,
      );
      setReps(exercise.reps);
      setCompletionStatus(exercise.completion_status);
      setNotes(exercise.notes ?? "");
      setPerceivedEffort(exercise.perceived_effort);
      setIsWarmup(exercise.is_warmup);
      setIsAMRAP(exercise.is_amrap);
      setPerformedAt(exercise.performed_at);
      setWeightUnit(exercise.weight_unit);
    }
  }, [exercise, setActualWeightValue]);

  const resetFields = useCallback(() => {
    localSetActualWeightValue(exercise.actual_weight_value ?? undefined);
    setReps(exercise.reps);
    setCompletionStatus(exercise.completion_status);
    setNotes(exercise.notes ?? "");
    setPerceivedEffort(exercise.perceived_effort);
    setIsWarmup(exercise.is_warmup);
    setIsAMRAP(exercise.is_amrap);
    setPerformedAt(exercise.performed_at);
    setWeightUnit(exercise.weight_unit);
  }, [exercise]);

  const editedExercise: GetExerciseResult = useMemo(
    () => ({
      user_id: userId,
      exercise_id: exercise.exercise_id,
      target_weight_value: exercise.target_weight_value,
      actual_weight_value: actualWeightValue ?? null,
      weight_unit: weightUnit,
      reps,
      completion_status: completionStatus,
      perceived_effort: perceivedEffort,
      is_warmup: isWarmup,
      is_amrap: isAMRAP,
      notes: notes || null,
      exercise_type: exerciseType,
      equipment_type: equipmentType,
      performed_at: performedAt,
    }),
    [
      userId,
      exercise,
      actualWeightValue,
      weightUnit,
      reps,
      completionStatus,
      perceivedEffort,
      isWarmup,
      isAMRAP,
      notes,
      exerciseType,
      equipmentType,
      performedAt,
    ],
  );

  const editedSameAsOriginal = useMemo(() => {
    let same = true;
    Object.entries(editedExercise).forEach(([key, editedExerciseProperty]) => {
      const exerciseProperty = exercise[key as keyof GetExerciseResult];
      if (editedExerciseProperty !== exerciseProperty) {
        same = false;
      }
    });
    return same;
  }, [editedExercise, exercise]);

  const saveDisabled = useMemo(() => {
    return editedSameAsOriginal;
  }, [editedSameAsOriginal]);

  const resetDisabled = useMemo(() => {
    return editedSameAsOriginal;
  }, [editedSameAsOriginal]);

  const boundSaveExerciseAction = useMemo(
    () =>
      saveExerciseEdits.bind(null, userId, editedExercise, currentPath, backTo),
    [userId, editedExercise, backTo, currentPath],
  );

  return {
    resetCommonFields: resetFields,
    targetWeightValue: exercise.target_weight_value,
    actualWeightValue,
    setActualWeightValue,
    roundingMode,
    weightUnit,
    reps,
    setReps,
    completionStatus,
    setCompletionStatus,
    notes,
    setNotes,
    perceivedEffort,
    setPerceivedEffort,
    isWarmup,
    setIsWarmup,
    isAMRAP,
    setIsAMRAP: setIsAMRAP,
    boundSaveExerciseAction,
    saveDisabled,
    resetDisabled,
    barWeightValue,
  };
};
