import { useMemo, useState } from "react";
import { Constants, Database } from "@/database.types";
import { correspondingEquipment, getExercisesByEquipment } from "@/util";

type ExerciseType = Database["public"]["Enums"]["exercise_type_enum"];
type EquipmentType = Database["public"]["Enums"]["equipment_type_enum"];

/**
 * Props for the useExerciseSelector hook
 */
export interface UseExerciseSelectorProps {
  /** Initial value for the selected exercise. */
  initial_exercise: ExerciseType | null;
  /** Callback when the exercise type changes. */
  onExerciseChange: (exercise: ExerciseType | null) => void;
}

/**
 * API interface returned by useExerciseSelector hook
 */
export interface UseExerciseSelectorAPI {
  /** The currently selected exercise type. */
  selectedExercise: ExerciseType | null;
  /** Handler for exercise selection changes */
  handleExerciseChange: (newExercise: ExerciseType | null) => void;
  /** The list of exercises available. */
  availableExercises: ExerciseType[];
  /** The currently selected equipment type. */
  selectedEquipment: EquipmentType | null;
  /** Handler for equipment selection changes */
  handleEquipmentChange: (newEquipment: EquipmentType | null) => void;
  /** The list of equipment available. */
  availableEquipment: EquipmentType[];
}

/**
 * Hook that provides logic for exercise selection with equipment filtering.
 *
 * Some key features:
 *
 * - If an equipment is not selected, all of the exercises will be available in
 *   the exercises autocomplete.
 *
 * - If an equipment is selected, the exercises autocomplete will be filtered
 *   to only show exercises that match the selected equipment.
 *
 * - If an equipment is not set, and an exercise is selected, the equipment
 *   will be set to the corresponding equipment of that exercise.
 */
export const useExerciseSelector = (
  props: UseExerciseSelectorProps,
): UseExerciseSelectorAPI => {
  const { initial_exercise, onExerciseChange } = props;
  // Initialize state with provided initial values
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType | null>(
    initial_exercise ?? null,
  );
  const [selectedEquipment, setSelectedEquipment] =
    useState<EquipmentType | null>(
      (initial_exercise !== null && correspondingEquipment(initial_exercise)) ||
        null,
    );
  // Calculate available exercises based on selected equipment
  const availableExercises = useMemo(() => {
    if (!selectedEquipment) {
      // If no equipment is selected, return all exercises
      return [...Constants.public.Enums.exercise_type_enum];
    }

    // If equipment is selected, filter exercises by that equipment
    const exercisesByEquipment = getExercisesByEquipment();
    return exercisesByEquipment[selectedEquipment];
  }, [selectedEquipment]);

  // All equipment types are always available
  const availableEquipment = useMemo(() => {
    return [...Constants.public.Enums.equipment_type_enum];
  }, []);

  /**
   * Handler for exercise selection changes.
   * When an exercise is selected and no equipment is set,
   * automatically set the corresponding equipment.
   */
  const handleExerciseChange = (newExercise: ExerciseType | null) => {
    setSelectedExercise(newExercise);
    onExerciseChange(newExercise);

    // If an exercise is selected and no equipment is set, set the corresponding equipment
    if (newExercise && !selectedEquipment) {
      const equipment = correspondingEquipment(newExercise);
      setSelectedEquipment(equipment);
    }
  };

  /**
   * Handler for equipment selection changes.
   * When equipment changes, clear the exercise selection if it doesn't match the new equipment.
   */
  const handleEquipmentChange = (newEquipment: EquipmentType | null) => {
    setSelectedEquipment(newEquipment);

    // If equipment changes and current exercise doesn't match, clear the exercise
    if (selectedExercise && newEquipment) {
      const exerciseEquipment = correspondingEquipment(selectedExercise);
      if (exerciseEquipment !== newEquipment) {
        setSelectedExercise(null);
        onExerciseChange(null);
      }
    }
  };
  return {
    selectedExercise,
    handleExerciseChange,
    availableExercises,
    selectedEquipment,
    handleEquipmentChange,
    availableEquipment,
  };
};
