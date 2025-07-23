import { EditEquipmentExerciseProps } from "@/app/exercise/[equipment_type]/[exercise_type]/edit/[exercise_id]/_components/EditEquipmentExercise";
import { saveExerciseEdits } from "@/app/exercise/[equipment_type]/[exercise_type]/edit/[exercise_id]/_components/EditEquipmentExercise/actions";
import { GetExerciseResult, RoundingMode } from "@/common-types";
import EditBarbell from "@/components/edit/EditBarbell";
import EditDumbbell from "@/components/edit/EditDumbbell";
import { throwIfNull } from "@/util";
import { Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

const useEditBarbellExerciseAPI = (_props: EditEquipmentExerciseProps) => {
  // TODO Eventually we want barWeight to be from the db, but for now it's not
  // saved anywhere.
  const [barWeight] = useState(45);

  const additionalFields = useMemo(
    () => ({
      barWeight,
    }),
    [barWeight],
  );

  return {
    additionalFields,
    barWeight,
  };
};

export const useEditEquipmentExerciseAPI = (
  props: EditEquipmentExerciseProps,
) => {
  const barbellAPI = useEditBarbellExerciseAPI(props);

  const {
    userId,
    currentPath,
    equipmentType,
    exerciseType,
    exercise,
    backTo,
    preferences: { available_plates_lbs, available_dumbbells_lbs },
  } = props;

  // TODO: I need to do mork thinking on how this should be handled.
  // Right now, target weight and actual weight are both used for slightly
  // different things, and it may make more sense to handle them separately on
  // the edit. For now, I'm first trying to find actual weight, and then using
  // target_weight_value which must be set as the backup. That way, it's at
  // least possible to edit a not-started exercise.
  const [weightValue, setWeightValue] = useState<number>(
    exercise.actual_weight_value ?? exercise.target_weight_value,
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
  const [isWarmup, setIsWarmup] = useState<boolean>(exercise.warmup);
  const [isAMRAP, setIsAMRAP] = useState<boolean>(exercise.is_amrap);
  const [performedAt, setPerformedAt] = useState(exercise.performed_at);

  // Sync the current state when the initial values change, this is needed
  // because we use revalidatePath and otherwise the state values would never
  // update when the initialDraft changes on the server.
  useEffect(() => {
    if (exercise) {
      setWeightValue(
        exercise.actual_weight_value ?? exercise.target_weight_value,
      );
      setReps(exercise.reps);
      setCompletionStatus(exercise.completion_status);
      setNotes(exercise.notes ?? "");
      setPerceivedEffort(exercise.perceived_effort);
      setIsWarmup(exercise.warmup);
      setIsAMRAP(exercise.is_amrap);
      setPerformedAt(exercise.performed_at);
      setWeightUnit(exercise.weight_unit);
    }
  }, [exercise]);

  const resetFields = useCallback(() => {
    setWeightValue(
      exercise.actual_weight_value ?? exercise.target_weight_value,
    );
    setReps(exercise.reps);
    setCompletionStatus(exercise.completion_status);
    setNotes(exercise.notes ?? "");
    setPerceivedEffort(exercise.perceived_effort);
    setIsWarmup(exercise.warmup);
    setIsAMRAP(exercise.is_amrap);
    setPerformedAt(exercise.performed_at);
    setWeightUnit(exercise.weight_unit);
  }, [exercise]);

  const editedExercise: GetExerciseResult = useMemo(
    () => ({
      user_id: userId,
      exercise_id: exercise.exercise_id,
      target_weight_value: weightValue,
      actual_weight_value: weightValue, // TODO: eventually this should be separate.
      weight_unit: weightUnit,
      reps,
      completion_status: completionStatus,
      perceived_effort: perceivedEffort,
      warmup: isWarmup,
      is_amrap: isAMRAP,
      notes: notes || null,
      exercise_type: exerciseType,
      equipment_type: equipmentType,
      performed_at: performedAt,
    }),
    [
      userId,
      exercise,
      weightValue,
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

  // TODO - this part is extremely duplicative of useAddEquipmentExerciseAPI, I
  // think it'd be worthwhile to just create this whole thing as a managed
  // hook/component.
  const EquipmentWeightEditor = useMemo(() => {
    switch (equipmentType) {
      case "barbell":
        throwIfNull(
          available_plates_lbs,
          () => new Error("Invalid Invariant: available_plates_lbs is null"),
        );
        return (
          <EditBarbell
            editing
            // TODO next steps here.
            targetWeightValue={weightValue}
            onTargetWeightChange={setWeightValue}
            roundingMode={roundingMode}
            weightUnit={weightUnit}
            availablePlates={available_plates_lbs}
            barWeight={barbellAPI.barWeight}
          />
        );
      case "dumbbell":
        throwIfNull(
          available_dumbbells_lbs,
          () => new Error("Invalid Invariant: available_dumbbells_lbs is null"),
        );
        return (
          <EditDumbbell
            weightValue={weightValue}
            onChange={setWeightValue}
            weightUnit={weightUnit}
            availableDumbbells={available_dumbbells_lbs}
          />
        );
    }
    return <Typography>TODO!</Typography>;
  }, [
    equipmentType,
    weightValue,
    barbellAPI,
    setWeightValue,
    roundingMode,
    weightUnit,
    available_plates_lbs,
    available_dumbbells_lbs,
  ]);

  return {
    resetCommonFields: resetFields,
    targetWeight: weightValue,
    setTargetWeight: setWeightValue,
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
    isAmrap: isAMRAP,
    setIsAMRAP: setIsAMRAP,
    EquipmentWeightEditor,
    boundSaveExerciseAction,
    saveDisabled,
    resetDisabled,
  };
};
