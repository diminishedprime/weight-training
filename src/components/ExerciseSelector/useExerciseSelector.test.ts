import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import {
  useExerciseSelector,
  UseExerciseSelectorProps,
} from "./useExerciseSelector";
import { Database, Constants } from "@/database.types";
import { correspondingEquipment } from "@/util";

type ExerciseType = Database["public"]["Enums"]["exercise_type_enum"];
type EquipmentType = Database["public"]["Enums"]["equipment_type_enum"];

describe("useExerciseSelector", () => {
  it("should set corresponding equipment when only initial exercise is provided", () => {
    const mockOnExerciseChange = vi.fn();

    const props: UseExerciseSelectorProps = {
      onExerciseChange: mockOnExerciseChange,
      initial_exercise: "barbell_squat" as ExerciseType,
    };

    const { result } = renderHook(() => useExerciseSelector(props));

    // Should have set the initial exercise
    expect(result.current.selectedExercise).toBe("barbell_squat");

    // Should have automatically set the corresponding equipment
    expect(result.current.selectedEquipment).toBe("barbell");
  });

  it("should set corresponding equipment when exercise is selected with no initial values", () => {
    const mockOnExerciseChange = vi.fn();

    const props: UseExerciseSelectorProps = {
      onExerciseChange: mockOnExerciseChange,
      initial_exercise: null,
    };

    const { result } = renderHook(() => useExerciseSelector(props));

    // Should start with no selections
    expect(result.current.selectedExercise).toBeNull();
    expect(result.current.selectedEquipment).toBeNull();

    // Select an exercise
    act(() => {
      result.current.handleExerciseChange("barbell_squat" as ExerciseType);
    });

    // Should have set the selected exercise
    expect(result.current.selectedExercise).toBe("barbell_squat");

    // Should have automatically set the corresponding equipment
    expect(result.current.selectedEquipment).toBe("barbell");

    // Should have called the exercise change callback
    expect(mockOnExerciseChange).toHaveBeenCalledWith("barbell_squat");
  });

  it("should filter available exercises when equipment is selected", () => {
    const mockOnExerciseChange = vi.fn();

    const props: UseExerciseSelectorProps = {
      onExerciseChange: mockOnExerciseChange,
      initial_exercise: null,
    };

    const { result } = renderHook(() => useExerciseSelector(props));

    // Should start with no selections and all exercises available
    expect(result.current.selectedExercise).toBeNull();
    expect(result.current.selectedEquipment).toBeNull();
    expect(result.current.availableExercises).toEqual([
      ...Constants.public.Enums.exercise_type_enum,
    ]);

    // Select barbell equipment
    act(() => {
      result.current.handleEquipmentChange("barbell" as EquipmentType);
    });

    // Should have set the selected equipment
    expect(result.current.selectedEquipment).toBe("barbell");

    // Available exercises should now be filtered to only barbell exercises
    const allExercises = [...Constants.public.Enums.exercise_type_enum];
    expect(result.current.availableExercises.length).toBeLessThan(
      allExercises.length
    );

    // Each available exercise should correspond to barbell equipment
    result.current.availableExercises.forEach((exercise) => {
      expect(correspondingEquipment(exercise)).toBe("barbell");
    });
  });

  it("should set equipment based on initial exercise", () => {
    const mockOnExerciseChange = vi.fn();

    const props: UseExerciseSelectorProps = {
      onExerciseChange: mockOnExerciseChange,
      initial_exercise: "barbell_squat" as ExerciseType,
    };

    const { result } = renderHook(() => useExerciseSelector(props));

    // Should have set the initial exercise
    expect(result.current.selectedExercise).toBe("barbell_squat");

    // Should have automatically set the corresponding equipment
    expect(result.current.selectedEquipment).toBe("barbell");
  });

  it("should clear exercise when equipment changes to incompatible type", () => {
    const mockOnExerciseChange = vi.fn();

    const props: UseExerciseSelectorProps = {
      onExerciseChange: mockOnExerciseChange,
      initial_exercise: "barbell_squat" as ExerciseType, // This corresponds to "barbell"
    };

    const { result } = renderHook(() => useExerciseSelector(props));

    // Should start with barbell_squat and barbell equipment
    expect(result.current.selectedExercise).toBe("barbell_squat");
    expect(result.current.selectedEquipment).toBe("barbell");

    // Change equipment to incompatible type
    act(() => {
      result.current.handleEquipmentChange("dumbbell" as EquipmentType);
    });

    // Should have cleared the exercise since barbell_squat is not compatible with dumbbell
    expect(result.current.selectedExercise).toBeNull();
    expect(result.current.selectedEquipment).toBe("dumbbell");

    // Should have called the exercise change callback with null (clearing the exercise)
    expect(mockOnExerciseChange).toHaveBeenCalledWith(null);
  });

  it("should automatically set equipment when selecting an exercise from the full list", () => {
    const mockOnExerciseChange = vi.fn();

    const props: UseExerciseSelectorProps = {
      onExerciseChange: mockOnExerciseChange,
      initial_exercise: null,
    };

    const { result } = renderHook(() => useExerciseSelector(props));

    // Should start with no selections and all exercises available
    expect(result.current.selectedExercise).toBeNull();
    expect(result.current.selectedEquipment).toBeNull();
    expect(result.current.availableExercises).toEqual([
      ...Constants.public.Enums.exercise_type_enum,
    ]);

    // Select a dumbbell exercise from the full list
    act(() => {
      result.current.handleExerciseChange("dumbbell_row" as ExerciseType);
    });

    // Should have set the selected exercise
    expect(result.current.selectedExercise).toBe("dumbbell_row");

    // Should have automatically set the corresponding equipment
    expect(result.current.selectedEquipment).toBe("dumbbell");

    // Should have called the exercise change callback
    expect(mockOnExerciseChange).toHaveBeenCalledWith("dumbbell_row");

    // Available exercises should now be filtered to only dumbbell exercises
    const allExercises = [...Constants.public.Enums.exercise_type_enum];
    expect(result.current.availableExercises.length).toBeLessThan(
      allExercises.length
    );

    // Each available exercise should correspond to dumbbell equipment
    result.current.availableExercises.forEach((exercise) => {
      expect(correspondingEquipment(exercise)).toBe("dumbbell");
    });
  });
});
