import {
  addEquipmentExercise,
  addEquipmentFormDraft,
  clearEquipmentFormDraft,
  saveEquipmentFormDraft,
} from "@/app/exercise/[equipment_type]/[exercise_type]/_components/AddEquipmentExercise/actions";
import { AddEquipmentExerciseProps } from "@/app/exercise/[equipment_type]/[exercise_type]/_components/AddEquipmentExercise/index";
import { CommonFormDraft } from "@/app/exercise/[equipment_type]/[exercise_type]/_components/page";
import {
  CompletionStatus,
  EquipmentType,
  ExerciseType,
  PerceivedEffort,
  RoundingMode,
  WeightUnit,
} from "@/common-types";
import { TestIds } from "@/test-ids";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const defaultWeightForExercise = (
  equipmentType: EquipmentType,
  _exerciseType: ExerciseType,
): number => {
  switch (equipmentType) {
    case "barbell":
      return 45;
    case "machine":
      return 45;
    default:
      return 10;
  }
};

const defaultRepsForExercise = (
  equipmentType: EquipmentType,
  _exerciseType: ExerciseType,
): number => {
  switch (equipmentType) {
    case "barbell":
      return 5;
    default:
      return 10;
  }
};

const useAddBarbellExerciseAPI = (props: AddEquipmentExerciseProps) => {
  const defaults = useMemo(
    () => ({
      barWeight: 45,
    }),
    [],
  );

  const [barWeight, setBarWeight] = useState(
    props.initialDraft?.barWeight ?? defaults.barWeight,
  );

  const additionalFields = useMemo(
    () => ({
      barWeight: 45, // TODO: this should be dynamic based on the equipment type.
    }),
    [],
  );

  const addExerciseTestId = useMemo(() => TestIds.AddBarbellLiftButton, []);

  return {
    additionalFields,
    defaults,
    barWeight,
    setBarWeight,
    addExerciseTestId,
  };
};

const useAddDumbbellExerciseAPI = (_props: AddEquipmentExerciseProps) => {
  const defaults = useMemo(() => ({}), []);

  const additionalFields = useMemo(() => ({}), []);

  const addExerciseTestId = useMemo(() => TestIds.AddDumbbellLiftButton, []);

  return { additionalFields, defaults, addExerciseTestId };
};

export const useAddEquipmentExerciseAPI = (
  props: AddEquipmentExerciseProps,
) => {
  const barbellAPI = useAddBarbellExerciseAPI(props);
  const dumbbellAPI = useAddDumbbellExerciseAPI(props);

  const { userId, path, equipmentType, exerciseType, initialDraft } = props;

  const equipmentSpecificAPI = useMemo(
    () => ({
      ...(equipmentType === "barbell" ? barbellAPI : {}),
      ...(equipmentType === "dumbbell" ? dumbbellAPI : {}),
    }),
    [equipmentType, barbellAPI, dumbbellAPI],
  );

  const {
    defaults: equipmentDefaults,
    additionalFields: equipmentAdditionalFields,
  } = equipmentSpecificAPI;

  const defaults: CommonFormDraft = useMemo(
    () => ({
      actualWeightValue: defaultWeightForExercise(equipmentType, exerciseType),
      roundingMode: RoundingMode.NEAREST,
      weightUnit: "pounds" as WeightUnit,
      equipmentType,
      exerciseType,
      reps: defaultRepsForExercise(equipmentType, exerciseType),
      completionStatus: "completed" as CompletionStatus,
      notes: "",
      perceivedEffort: null,
      isWarmup: false,
      isAMRAP: false,
    }),
    [equipmentType, exerciseType],
  );

  const [actualWeightValue, setActualWeight] = useState<number>(
    initialDraft?.actualWeightValue ?? defaults.actualWeightValue,
  );
  const [roundingMode] = useState<RoundingMode>(
    initialDraft?.roundingMode ?? defaults.roundingMode,
  );
  const [weightUnit] = useState<WeightUnit>(
    initialDraft?.weightUnit ?? defaults.weightUnit,
  );
  const [reps, setReps] = useState<number>(initialDraft?.reps ?? defaults.reps);
  const [completionStatus, setCompletionStatus] = useState(
    initialDraft?.completionStatus ?? defaults.completionStatus,
  );
  const [notes, setNotes] = useState<string>(
    initialDraft?.notes ?? defaults.notes ?? "",
  );
  const [perceivedEffort, setPerceivedEffort] =
    useState<PerceivedEffort | null>(
      initialDraft?.perceivedEffort ?? defaults.perceivedEffort,
    );
  const [isWarmup, setIsWarmup] = useState<boolean>(
    initialDraft?.isWarmup ?? defaults.isWarmup,
  );
  const [isAMRAP, setIsAMRAP] = useState<boolean>(
    initialDraft?.isAMRAP ?? defaults.isAMRAP,
  );

  const repChoices = useMemo(() => {
    switch (equipmentType) {
      case "barbell":
        return [1, 3, 5, 8];
      case "dumbbell":
        return [5, 8, 10, 12];
      case "machine":
        return [8, 10, 12, 15];
      default:
        return [1, 3, 5, 8, 10];
    }
  }, [equipmentType]);

  // Sync the current state when the initial values change, this is needed
  // because we use revalidatePath and otherwise the state values would never
  // update when the initialDraft changes on the server.
  useEffect(() => {
    if (initialDraft) {
      setActualWeight(initialDraft.actualWeightValue);
      setReps(initialDraft.reps);
      setCompletionStatus(initialDraft.completionStatus);
      setNotes(initialDraft.notes);
      setPerceivedEffort(initialDraft.perceivedEffort);
      setIsWarmup(initialDraft.isWarmup);
      setIsAMRAP(initialDraft.isAMRAP);
    }
  }, [initialDraft]);

  const commonFormDraft: CommonFormDraft = useMemo(
    () => ({
      equipmentType,
      exerciseType,
      actualWeightValue,
      weightUnit,
      roundingMode,
      reps,
      completionStatus,
      notes,
      perceivedEffort,
      isWarmup,
      isAMRAP,
    }),
    [
      equipmentType,
      exerciseType,
      actualWeightValue,
      weightUnit,
      roundingMode,
      reps,
      completionStatus,
      notes,
      perceivedEffort,
      isWarmup,
      isAMRAP,
    ],
  );

  const withAdditionalFields = useMemo(
    () => ({
      ...commonFormDraft,
      ...equipmentAdditionalFields,
    }),
    [commonFormDraft, equipmentAdditionalFields],
  );

  const withAdditionalDefaults = useMemo(
    () => ({
      ...defaults,
      ...equipmentDefaults,
    }),
    [defaults, equipmentDefaults],
  );

  const debouncedSave = useDebouncedCallback(
    async <EquipmentTypeForm extends CommonFormDraft>(
      userId: string,
      path: string,
      withAdditionalFields: EquipmentTypeForm,
    ) => {
      await saveEquipmentFormDraft(userId, path, withAdditionalFields);
    },
    1000,
    { trailing: true },
  );

  useEffect(() => {
    debouncedSave(userId, path, withAdditionalFields);
    return () => {
      debouncedSave.cancel();
    };
  }, [userId, path, withAdditionalFields, debouncedSave]);

  const resetCommonFields = useCallback(() => {
    setActualWeight(defaults.actualWeightValue);
    setReps(defaults.reps);
    setCompletionStatus(defaults.completionStatus);
    setNotes(defaults.notes);
    setPerceivedEffort(defaults.perceivedEffort);
    setIsWarmup(defaults.isWarmup);
    setIsAMRAP(defaults.isAMRAP);
  }, [defaults]);

  const showAddEquipmentExerciseButton = useMemo(() => {
    return initialDraft === null;
  }, [initialDraft]);

  // TODO: This is important to make sure that when you do onSubmit, it cancels
  // any in-progress work to sync the draft to the DB, otherwise you may end up
  // with a race condition between the debounced save and the form reset.
  const handleAddEquipmentExerciseClick = useCallback(() => {
    debouncedSave.cancel();
  }, [debouncedSave]);

  const boundSaveFormDraftAction = useMemo(
    () => addEquipmentFormDraft.bind(null, userId, path, withAdditionalFields),
    [userId, path, withAdditionalFields],
  );

  const boundClearEquipmentFormDraft = useMemo(
    () => clearEquipmentFormDraft.bind(null, userId, path),
    [userId, path],
  );

  const boundAddEquipmentExerciseAction = useMemo(() => {
    return addEquipmentExercise.bind(
      null,
      userId,
      path,
      withAdditionalFields,
      withAdditionalDefaults,
    );
  }, [userId, path, withAdditionalFields, withAdditionalDefaults]);

  return {
    handleAddEquipmentExerciseClick,
    showAddEquipmentExerciseButton,
    commonFormDraft,
    resetCommonFields,
    actualWeight: actualWeightValue,
    setActualWeight,
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
    defaultBarbellFormDraft: defaults,
    boundSaveFormDraftAction,
    boundAddEquipmentExerciseAction,
    boundClearEquipmentFormDraft,
    addExerciseTestId: equipmentSpecificAPI.addExerciseTestId,
    barWeight: equipmentSpecificAPI.barWeight,
    repChoices,
  };
};
